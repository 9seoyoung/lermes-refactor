package com.kdt.KDT_PJT.attend.service;

import com.kdt.KDT_PJT.attend.dto.AttendAdjustCreateRequest;
import com.kdt.KDT_PJT.attend.dto.AttendDocumentAdminResponse;
import com.kdt.KDT_PJT.attend.dto.AttendDocumentResponse;
import com.kdt.KDT_PJT.attend.entity.AprvSttsNm;
import com.kdt.KDT_PJT.attend.entity.AttendDocument;
import com.kdt.KDT_PJT.attend.repository.AttendDocumentRepository;
import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import com.kdt.KDT_PJT.cohort.repository.CohortRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AttendDocumentService {

    private final AttendDocumentRepository attendDocumentRepository;
    private final UserRepository userRepository;
    private final CohortRepository cohortRepository;

    /**
     * 출결 인정 요청 생성
     * - userSn, coSn, cohortSn 은 컨트롤러에서 Authentication으로 추출해 전달
     * - req: attendDtlTypeNm, bgngDt, endDt(옵션), rmrkCn, fileSn
     * - 기본 승인상태 PENDING
     */
    @Transactional
    public Long create(Authentication auth, AttendAdjustCreateRequest req) {
        AuthCustomUserDetails me = requirePrincipal(auth);

        Long userSn = me.getId();
        Long coSn = me.getCompanySn();
        Long cohortSn = me.getCohortSn();

        if (userSn == null || coSn == null || cohortSn == null) {
            throw new IllegalArgumentException("필수 식별자 누락(userSn || coSn || cohortSn)");
        }

        LocalDate bgng = req.getBgngDt();
        LocalDate end = req.resolvedEndDt();

        if (end.isBefore(bgng)) {
            end = bgng; // 방어: 종료가 시작보다 빠르면 시작일로 보정
        }

        AttendDocument doc = AttendDocument.builder()
                .userSn(userSn)
                .coSn(coSn)
                .cohortSn(cohortSn)
                .bgngDt(bgng)
                .endDt(end)
                .attendDtlTypeNm(req.getAttendDtlTypeNm())
                .rmrkCn(req.getStuRmrkCn())
                .fileSn(req.getFileSn())
                .aprvSttsNm(AprvSttsNm.PENDING) // 기본 대기
                .build();

        attendDocumentRepository.save(doc);
        return doc.getAttendDcmntSn();
    }

    private AuthCustomUserDetails requirePrincipal(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()
                || !(auth.getPrincipal() instanceof AuthCustomUserDetails p)) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }
        return p;
    }

    /**
     * 내 출석 인정 요청 목록 (최신순)
     */
    @Transactional(readOnly = true)
    public Page<AttendDocumentResponse> listMine(Long userSn, Pageable pageable) {
        return attendDocumentRepository
                .findByUserSnOrderByAttendDcmntSnDesc(userSn, pageable)
                .map(AttendDocumentResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<AttendDocumentAdminResponse> listAllByCohort(Long companySn, Pageable pageable) {
        Page<AttendDocument> docs = attendDocumentRepository.findByCoSn(companySn, pageable);

        return docs.map(d -> {
            String userName = userRepository.findById(d.getUserSn())
                    .map(User::getName)
                    .orElse("알수없음");
            String cohortName = cohortRepository.findById(d.getCohortSn())
                    .map(Cohort::getCohortNm)
                    .orElse("미지정");

            return AttendDocumentAdminResponse.from(d, cohortName, userName);
        });
    }

    public Page<AttendDocumentResponse> findAllForAdmin(Pageable pageable) {
        return attendDocumentRepository.findAll(pageable)
                .map(AttendDocumentResponse::from);
    }

    @Transactional
    public void updateStatus(Long id, String status) {
        AttendDocument doc = attendDocumentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("문서 없음"));

        doc.changeAprvStatus("Y".equals(status) ? AprvSttsNm.APPROVED : AprvSttsNm.REJECTED);
        attendDocumentRepository.save(doc);
    }

    /**
     * 회사번호와 관련된 출석인정요청 카운트
     * 단, PENDING 상태인 것만
     */
    @Transactional(readOnly = true)
    public long countRequestAbsence(Long effectiveSn) {
        long coSn = effectiveSn;

        return attendDocumentRepository.countByCoSnAndAprvSttsNm(coSn, AprvSttsNm.PENDING);
    }
}
