package com.kdt.KDT_PJT.survey.dto;
//설문 등록/조회/수정

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kdt.KDT_PJT.bbs.enums.BbsType;
import com.kdt.KDT_PJT.survey.enums.SurveyScope;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestSurveyDto {

    private Long srvySn;            // 설문 일련번호 (PK)
    @JsonProperty("title")
    private String srvyTtl;         // 설문 제목
    @JsonProperty("surveyForm")
    private String srvyQitem;       // 설문 문항 (JSON 문자열)
    @JsonProperty("surveyStart")
    private String srvyBgngDt;   // 설문 시작일
    @JsonProperty("surveyEnd")
    private String srvyEndDt;    // 설문 종료일
    @JsonProperty("type")
    private BbsType bbsType;        //게시판 유형 기본값 survey
    @JsonProperty("scope")
    private SurveyScope srvyScope;  //공개범위
    @JsonProperty("coSn")
    private Long coSn;              // 회사 일련번호 (FK) 15
    @JsonProperty("cohortSn")
    private Long cohortSn;          // 기수/과정 일련번호 (FK) 100
    @JsonProperty("userSn")
    private Long userSn;             //작성자 id 값을 받아서 user_nm으로 처리
}
