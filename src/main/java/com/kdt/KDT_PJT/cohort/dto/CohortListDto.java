package com.kdt.KDT_PJT.cohort.dto;

import jakarta.persistence.Column;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Map;

@Data @Getter
@Setter
public class CohortListDto {

    private Long cohortSn;  // 수정, 조회 응답용

    private String cohortNm;

    private Map<String, Object> crclmCn;

    private String crclmNm;

    private LocalDate recruitBgngDt;

    private LocalDate recruitEndDt;

    private LocalDate crclmBgngYmd;

    private LocalDate crclmEndYmd;

    private String cohortSttsNm;

    // 기본 생성자, getter/setter 생략 가능 (롬복 사용 가능)
}
