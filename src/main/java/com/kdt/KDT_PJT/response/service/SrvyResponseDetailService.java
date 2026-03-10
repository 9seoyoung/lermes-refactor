package com.kdt.KDT_PJT.response.service;

import com.kdt.KDT_PJT.response.dto.SrvyResponseDetailDto;
import com.kdt.KDT_PJT.response.mapper.SrvyResponseDetailMapper;
import com.kdt.KDT_PJT.survey.enums.SurveyRole;
import com.kdt.KDT_PJT.survey.enums.SurveyScope;
import com.kdt.KDT_PJT.survey.mapper.SurveyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class SrvyResponseDetailService {

    private final SrvyResponseDetailMapper detailMapper;
    private final SurveyMapper surveyMapper;



    //자기 응답만 조회
    @Transactional(readOnly = true)
    public SrvyResponseDetailDto getSurveyDetail(Long srvySn, Long userSn) {
        return detailMapper.findSurveyDetailWithResponse(srvySn, userSn);
    }
    //작성자용 전체 조회
    @Transactional(readOnly = true)
    public List<SrvyResponseDetailDto> getAllResponses(
            Long srvySn,
            Long requesterSn,
            Long roleId,
            Long requesterCohortSn
    ) {
        Map<String, Object> surveyInfo = surveyMapper.findWriterBySurveySn(srvySn);
        if (surveyInfo == null) {
            throw new IllegalArgumentException("존재하지 않는 설문입니다.");
        }

        Long writerSn = ((Number) surveyInfo.get("writerSn")).longValue();
        SurveyScope scope = SurveyScope.valueOf((String) surveyInfo.get("srvyScope"));
        Long surveyCohortSn = surveyInfo.get("cohortSn") != null
                ? ((Number) surveyInfo.get("cohortSn")).longValue()
                : null;

        SurveyRole role = SurveyRole.fromCode(roleId);

        boolean isAuthorized = false;

        switch (role) {
            case SUPER_ADMIN, TENANT_ADMIN -> {
                if (scope == SurveyScope.COHORT) isAuthorized = true; // 관리자: 기수전체만
            }
            case INSTRUCTOR -> {
                if (scope == SurveyScope.INTERNAL
                        && Objects.equals(surveyCohortSn, requesterCohortSn)) {
                    isAuthorized = true; // 강사: 동일 코호트 내부 설문만
                }
            }
            default -> {
                if (Objects.equals(writerSn, requesterSn)) isAuthorized = true; // 본인
            }
        }
        //본인은 무조건 허용
        if (Objects.equals(writerSn, requesterSn)) {isAuthorized = true;}

        if (!isAuthorized) {
            throw new AccessDeniedException("해당 설문 전체 응답을 조회할 권한이 없습니다.");
        }

        return detailMapper.findAllResponsesBySurvey(srvySn);
    }


}
