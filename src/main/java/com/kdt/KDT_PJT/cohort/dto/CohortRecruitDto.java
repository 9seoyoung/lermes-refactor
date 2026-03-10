package com.kdt.KDT_PJT.cohort.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CohortRecruitDto {
    private Long cohortSn;
    private String cohortNm;
    private String crclmNm;
    private LocalDate recruitBgngYmd;
    private LocalDate recruitEndYmd;
    private LocalDate crclmBgngYmd;
    private LocalDate crclmEndYmd;
    private LocalTime attendStartTm;
    private LocalTime attendEndTm;
    private String cohortPl;
    private String crclmCn;

    // 회사 로고
    private Long bigLogoFileSn;

    // 기수 전용 이미지
    private Long cohortImg;
}
