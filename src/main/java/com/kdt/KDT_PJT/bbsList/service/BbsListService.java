package com.kdt.KDT_PJT.bbsList.service;

import com.kdt.KDT_PJT.bbsList.dto.BbsListResponseDto;
import com.kdt.KDT_PJT.bbsList.mapper.BbsListMapper;
import com.kdt.KDT_PJT.survey.enums.SurveyRole;
import com.kdt.KDT_PJT.survey.enums.SurveyScope;
import com.kdt.KDT_PJT.survey.mapper.SurveyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BbsListService {

    private final BbsListMapper bbsListMapper;

    public List<BbsListResponseDto> getBbsList(Long coSn, Long cohortSn, Long userSn, Long roleId) {

        if (roleId == null) {
            throw new SecurityException("권한 정보가 없습니다.");
        }

        // ✅ 역할 매핑
        SurveyRole role = SurveyRole.fromCode(roleId);

        // ✅ 역할별 허용된 설문 스코프 설정
        List<SurveyScope> allowedScopes = switch (role) {
            case SUPER_ADMIN, TENANT_ADMIN, EMPLOYEE -> List.of(SurveyScope.COHORT);
            case INSTRUCTOR -> List.of(SurveyScope.INTERNAL);
            case STUDENT -> List.of(SurveyScope.COHORT, SurveyScope.INTERNAL);
            default -> List.of(); // VISITOR, GENERAL 등 접근 불가
        };

        if (allowedScopes.isEmpty()) {
            throw new SecurityException("설문 목록 조회 권한이 없습니다.");
        }
        return bbsListMapper.findBbsList(coSn, cohortSn, userSn, allowedScopes);
    }
}
