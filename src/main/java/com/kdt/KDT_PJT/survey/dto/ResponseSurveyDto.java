package com.kdt.KDT_PJT.survey.dto;
//설문 등록/조회/수정

import com.kdt.KDT_PJT.bbs.enums.BbsType;
import com.kdt.KDT_PJT.survey.enums.SurveyScope;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResponseSurveyDto {

    private Long srvySn;            // 설문 일련번호 (PK)
    private String srvyTtl;         // 설문 제목
    private Object srvyQitem;       // 설문 문항 (JSON 문자열)
    private LocalDate srvyBgngDt;   // 설문 시작일
    private LocalDate srvyEndDt;    // 설문 종료일
    private SurveyScope srvyScope;  // 설문 범위 (COHORT/INTERNAL → "기수 전체"/"기수 내부")
    private BbsType bbsType;         // 게시판 유형 (SURVEY 고정)

    private Long coSn;              // 회사 일련번호 (FK) 15
    private Long cohortSn;          // 기수/과정 일련번호 (FK) 100

    private Long userSn;             // 작성자 ID
    private String userNm;           // 작성자

    private String formUuid;         // 설문 폼 UUID
    private int viewCnt;             // 조회수
    private LocalDateTime srvyFrstWrtDt; // 최초 작성일
    private LocalDateTime srvyLastMdfcnDt; // 마지막 수정일
    private boolean delYn;           // 삭제 여부 (true = 삭제됨)

}
