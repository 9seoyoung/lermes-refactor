package com.kdt.KDT_PJT.cohort.dto;

import com.kdt.KDT_PJT.cohort.entity.QuestionType;
import com.kdt.KDT_PJT.cohort.entity.cohortSttsNm;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CohortDto {
    private String id;               // UUID string
    private Long userSn;
    private Long coSn;
    private String title;
    private String content;
    private String groupName;
    private String type;             // Enum 문자열로 받음
    private LocalDate surveyStart;
    private LocalDate surveyEnd;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime classStart;
    private LocalTime classEnd;
    private com.fasterxml.jackson.databind.JsonNode surveyForm;
    private String place;
    private String stts;


    // 기본 생성자, getter/setter 생략 가능 (롬복 사용 가능)
}
