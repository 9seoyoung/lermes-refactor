package com.kdt.KDT_PJT.cohort.mapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kdt.KDT_PJT.cohort.dto.CohortDto;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import com.kdt.KDT_PJT.cohort.entity.QuestionType;

public class CohortConverter {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static Cohort toEntity(CohortDto dto) {
        if (dto == null) return null;

        Cohort entity = new Cohort();

        entity.setCohortNm(dto.getGroupName());
        entity.setCrclmNm(dto.getTitle());
        entity.setCoSn(dto.getUserSn());
        entity.setRecruitBgngDt(dto.getSurveyStart());
        entity.setRecruitEndDt(dto.getSurveyEnd());
        entity.setCrclmBgngYmd(dto.getStartDate());
        entity.setCrclmEndYmd(dto.getEndDate());

        if (dto.getSurveyForm() != null) {
            try {
                String jsonStr = objectMapper.writeValueAsString(dto.getSurveyForm());
                entity.setCrclmCn(jsonStr);
            } catch (Exception e) {
                throw new RuntimeException("surveyForm 직렬화 실패", e);
            }
        }

        if (dto.getType() != null) {
            try {
                entity.setCohortCate(QuestionType.valueOf(dto.getType()));
            } catch (IllegalArgumentException e) {
                entity.setCohortCate(null);
            }
        }

        entity.setAttendStartTm(dto.getClassStart());
        entity.setAttendEndTm(dto.getClassEnd());
        entity.setCohortPl(dto.getPlace());

        // 여기서 cohortSttsNm 관련 처리 절대 안 함!
        // 백엔드 서비스 계층에서 날짜 기준으로 직접 세팅할 것

        return entity;
    }

    public static CohortDto toDto(Cohort entity) {
        if (entity == null) return null;

        CohortDto dto = new CohortDto();

        dto.setTitle(entity.getCrclmNm());
        dto.setGroupName(entity.getCohortNm());
        dto.setUserSn(entity.getCoSn());
        dto.setSurveyStart(entity.getRecruitBgngDt());
        dto.setSurveyEnd(entity.getRecruitEndDt());
        dto.setStartDate(entity.getCrclmBgngYmd());
        dto.setEndDate(entity.getCrclmEndYmd());

        if (entity.getCrclmCn() != null) {
            try {
                JsonNode node = objectMapper.readTree(entity.getCrclmCn());
                dto.setSurveyForm(node);
            } catch (Exception e) {
                throw new RuntimeException("surveyForm 역직렬화 실패", e);
            }
        }

        dto.setType(entity.getCohortCate() == null ? null : entity.getCohortCate().name());

        dto.setClassStart(entity.getAttendStartTm());
        dto.setClassEnd(entity.getAttendEndTm());
        dto.setPlace(entity.getCohortPl());

        // dto.setScope(??) 이 부분도 제거!
        // scope은 프론트에서 안 받고, 백엔드에서 따로 계산해서 셋팅할 예정

        return dto;
    }
}
