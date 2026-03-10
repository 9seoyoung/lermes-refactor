package com.kdt.KDT_PJT.cohort.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Setter
@Getter
@Table(name = "TB_COHORT")
public class Cohort {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COHORT_SN")
    private Long cohortSn;

    @Column(name = "COHORT_NM")
    private String cohortNm;

    @Column(name = "CRCLM_NM")
    private String crclmNm;

    //    @Column(name = "CRCLM_CN")
//    private String crclmCn;
    @Column(name = "CRCLM_CN", columnDefinition = "json")
    private String crclmCn;

    @Column(name = "CO_SN")
    private Long coSn;

    @Column(name = "RECRUIT_BGNG_DT")
    private LocalDate recruitBgngDt;

    @Column(name = "RECRUIT_END_DT")
    private LocalDate recruitEndDt;

    @Column(name = "CRCLM_BGNG_YMD")
    private LocalDate crclmBgngYmd;

    @Column(name = "CRCLM_END_YMD")
    private LocalDate crclmEndYmd;

    @Column(name = "COHORT_STTS_NM")
    @Enumerated(EnumType.STRING)
    private cohortSttsNm cohortSttsNm;

    @Column(name = "COHORT_CATE")
    @Enumerated(EnumType.STRING)
    private QuestionType cohortCate;

    @Column(name = "ATTEND_START_TM")
    private LocalTime attendStartTm;

    @Column(name = "ATTEND_END_TM")
    private LocalTime attendEndTm;

    @Column(name = "COHORT_PL")
    private String cohortPl;

    @Column(name = "COHORT_IMAGE_FILE_SN")
    private Long cohortImg;
}
