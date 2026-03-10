package com.kdt.KDT_PJT.response.service;

import com.kdt.KDT_PJT.response.dto.SrvyRequestResponseDto;
import com.kdt.KDT_PJT.response.dto.SrvyResponseResponseDto;
import com.kdt.KDT_PJT.response.mapper.SrvyResponseMapper;
import com.kdt.KDT_PJT.survey.dto.ResponseSurveyDto;
import com.kdt.KDT_PJT.survey.enums.SurveyRole;
import com.kdt.KDT_PJT.survey.enums.SurveyStatus;
import com.kdt.KDT_PJT.survey.enums.SurveyScope;
import com.kdt.KDT_PJT.survey.mapper.SurveyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor

public class SrvyResponseService {

    private final SrvyResponseMapper srvyResponseMapper;
    private final SurveyMapper surveyMapper; // 설문 종료일 체크용

    /**
     * ✅ 설문 응답 등록 또는 수정 (Upsert)
     */
    @Transactional
    public SrvyResponseResponseDto createResponse(SrvyRequestResponseDto requestDto,
                                                  Long roleId, Long coSn, Long cohortSn) {
        Long parentSn = requestDto.getParentSn();
        Long userSn = requestDto.getUserSn();

        // 1. 설문 마감 여부 확인
        ResponseSurveyDto survey = surveyMapper.findSurveyById(parentSn);
        if (survey == null) {
            throw new IllegalArgumentException("해당 설문을 찾을 수 없습니다.");
        }

        SurveyStatus status = SurveyStatus.of(
                LocalDateTime.now(),
                survey.getSrvyBgngDt().atStartOfDay(),
                survey.getSrvyEndDt().atTime(23, 59, 59)
        );

        if (status != SurveyStatus.ONGOING) {
            throw new IllegalStateException("현재는 응답할 수 없는 설문입니다. (시작 전 또는 종료됨)");}

        // ✅ 3. 권한(Role) 체크 추가
        SurveyRole role = SurveyRole.fromCode(roleId);
        if (!role.canRespond(survey.getSrvyScope())) {
            throw new SecurityException("응답 권한이 없습니다."); // 👈
        }

        // ✅ 4. 소속 제한 검증 (회사/기수 일치 여부)
        if (survey.getSrvyScope() == SurveyScope.COHORT &&
                !survey.getCoSn().equals(coSn)) {
            throw new SecurityException("다른 회사의 설문에는 응답할 수 없습니다."); // 👈
        }
        if (survey.getSrvyScope() == SurveyScope.INTERNAL &&
                !survey.getCohortSn().equals(cohortSn)) {
            throw new SecurityException("해당 기수의 설문에만 응답할 수 있습니다."); // 👈
        }

        // 2. 기존 응답 존재 여부 확인
        SrvyResponseResponseDto existing = srvyResponseMapper.findByParentAndUser(parentSn, userSn);

        // 3. 있으면 수정, 없으면 등록
        if (existing == null || Boolean.TRUE.equals(existing.getDelYn())) {
            srvyResponseMapper.insertResponse(requestDto);
        } else {
            srvyResponseMapper.updateResponse(requestDto);
        }
        // 4. 최종 응답 반환
        return srvyResponseMapper.findByParentAndUser(parentSn, userSn);
    }
    //목록 조회(문제발생)
    @Transactional(readOnly = true)
    public List<SrvyResponseResponseDto> getResponses(Long srvySn, Long roleId, Long userSn) {
        if (SurveyRole.fromCode(roleId).isAdmin()) {
            // 관리자, 강사
            return srvyResponseMapper.findAllByParentWithUserName(srvySn);
        }
        // 일반 사용자
        return srvyResponseMapper.findByParentAndUserList(srvySn, userSn);
    }

    //설문 응답 삭제 (Soft Delete) 설문이 마감되면 불가능 / 마감 전 관리자 or 본인만 가능
    @Transactional
    public void deleteResponse(Long rspnsSn, Long userSn, Long roleId) {
        SrvyResponseResponseDto response = srvyResponseMapper.findById(rspnsSn);
        if (response == null) {
            throw new IllegalArgumentException("응답이 존재하지 않습니다.");
        }

        ResponseSurveyDto survey = surveyMapper.findSurveyById(response.getParentSn());
        if (survey == null) {
            throw new IllegalArgumentException("관련 설문을 찾을 수 없습니다.");
        }

        // 설문 마감 여부 확인
        SurveyStatus status = SurveyStatus.of(
                LocalDateTime.now(),
                survey.getSrvyBgngDt().atStartOfDay(),
                survey.getSrvyEndDt().atTime(23, 59, 59)
        );
        if (status == SurveyStatus.CLOSED) {
            throw new IllegalStateException("마감된 설문은 삭제할 수 없습니다.");
        }

        SurveyRole role = SurveyRole.fromCode(roleId);
        boolean isOwner = response.getUserSn().equals(userSn);
        boolean isAdmin = (role == SurveyRole.SUPER_ADMIN || role == SurveyRole.TENANT_ADMIN);

        if (isOwner || isAdmin) {
            srvyResponseMapper.softDelete(rspnsSn, userSn);
        } else {
            throw new SecurityException("응답 삭제 권한이 없습니다.");
        }
    }
}
