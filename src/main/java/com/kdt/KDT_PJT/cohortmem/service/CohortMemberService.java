package com.kdt.KDT_PJT.cohortmem.service;

import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import com.kdt.KDT_PJT.cohort.repository.CohortRepository;
import com.kdt.KDT_PJT.cohortmem.dto.CohortMemberDto;
import com.kdt.KDT_PJT.cohortmem.entity.CohortMember;
import com.kdt.KDT_PJT.cohortmem.entity.CohortMemberStts;
import com.kdt.KDT_PJT.cohortmem.repository.CohortMemberRepository;
import com.kdt.KDT_PJT.cohortresponse.repository.CohortResponseRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CohortMemberService {

    private final CohortMemberRepository cohortMemberRepository;
    private final CohortRepository cohortRepository;
    private final UserRepository userRepository;
    private final CohortResponseRepository cohortResponseRepository;

    public CohortMemberService(CohortMemberRepository cohortMemberRepository, CohortRepository cohortRepository, UserRepository userRepository, CohortResponseRepository cohortResponseRepository) {
        this.cohortMemberRepository = cohortMemberRepository;
        this.cohortRepository = cohortRepository;
        this.userRepository = userRepository;
        this.cohortResponseRepository = cohortResponseRepository;
    }

    public List<CohortMemberDto> getAppByCohortSn(Long cohortSn) {
        List<CohortMember> members = cohortMemberRepository.findByCohortSn(cohortSn);

        return members.stream().map(member -> {
            CohortMemberDto dto = new CohortMemberDto();
            dto.setUserSn(member.getUserSn());
            dto.setName(member.getUser().getName());
            dto.setPhone(member.getUser().getUserTelno());
            dto.setEmail(member.getUser().getEmail());
            dto.setCohortName(member.getCohort().getCohortNm());  // 기수 이름
            dto.setCrclmName(member.getCohort().getCrclmNm());    // 과정 이름
            dto.setAprwStts(member.getAprvDt() != null);          // 승인여부 true/false
            dto.setCohortMemStts(member.getCohortMemStts().name());

            cohortResponseRepository.findByUserSnAndParentSnAndParentType(
                    member.getUserSn().intValue(),
                    cohortSn.intValue(),
                    "COHORT"
            ).ifPresent(response -> dto.setRspnsSn(response.getRspnsSn()));

            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void applyForCohort(Long userSn, Long cohortSn) {
        if (cohortMemberRepository.existsByUserSnAndCohortSn(userSn, cohortSn)) {
            throw new RuntimeException("이미 신청한 사용자입니다.");
        }

        User user = userRepository.findById(userSn)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        Cohort cohort = cohortRepository.findById(cohortSn)
                .orElseThrow(() -> new RuntimeException("코호트를 찾을 수 없습니다."));

        CohortMember member = new CohortMember();

        member.setUser(user);
        member.setCohort(cohort);

            // 연관관계 필드는 insertable=false, updatable=false
        member.setUserSn(user.getId());
        member.setCohortSn(cohort.getCohortSn());
        member.setUserAuthrtSn(user.getRoleType());
        member.setCohortMemStts(CohortMemberStts.APPLIED);
        member.setAplyDt(LocalDateTime.now());
        member.setAprvDt(null);


        cohortMemberRepository.save(member);
    }

//    public void approveMember(Long memberId) {
//        CohortMember member = cohortMemberRepository.findByUserSn(memberId)
//                .orElseThrow(() -> new RuntimeException("신청 정보를 찾을 수 없습니다."));
//
//        member.setAprvDt(LocalDateTime.now());
//        member.setCohortMemStts(CohortMemberStts.ENROLLED);
//        member.setUserAuthrtSn(5L);
//
//        User user = member.getUser();
//        user.setRoleType(5L);
//        userRepository.save(user);
//
//        cohortMemberRepository.save(member);
//    }

    public void approveMember(Long memberId, Long cohortSn, Long companySn) {
        CohortMember member = cohortMemberRepository.findByUserSn(memberId)
                .orElseThrow(() -> new RuntimeException("신청 정보를 찾을 수 없습니다."));

        member.setAprvDt(LocalDateTime.now());
        member.setCohortMemStts(CohortMemberStts.ENROLLED);
        member.setUserAuthrtSn(5L);

        User user = member.getUser();
        user.setRoleType(5L);
        user.setCohortSn(cohortSn);
        user.setCompanySn(companySn);

        userRepository.save(user);

        cohortMemberRepository.save(member);
    }

    public void rejectMember(Long memberId) {
        CohortMember member = cohortMemberRepository.findByUserSn(memberId)
                .orElseThrow(() -> new RuntimeException("신청 정보를 찾을 수 없습니다."));

        member.setAprvDt(LocalDateTime.now());
        member.setCohortMemStts(CohortMemberStts.DENIED);

        cohortMemberRepository.save(member);
    }
}
