package com.kdt.KDT_PJT.interview.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.kdt.KDT_PJT.cmmn.map.CmmnMap;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewRecordDetailResponseDTO {

    private Integer itvRecordSn;    //면담 기록 일련번호
    private Integer itvSn;          //매칭되는 면담에 대한 일련번호
    private String itvRecordTtl;    // 면담 기록 제목
    private String itvRecordCn;     // 면담 기록 내용
//    private Integer itvPicSn;       // 면담 담당자 일련번호
//    private Integer itvTrprSn;      // 면담 대상자 일련번호
    private String itvPicNm;        // 면담 담당자 명
    private String itvTrprNm;       // 면담 대상자 명
    private Integer cohortSn;       // 기수 일련번호
    private Integer viewCnt;        // 조회수
//    private Integer coSn;           // 회사 일련번호
//    private Integer delYn;          // 삭제 여부
    private String date;            // 프론트 용 날짜
    private String time;            // 프론트 용 시간
    private List<CmmnMap> files;    // 파일 리스트
    private LocalDateTime regDt;    //DB에서 꺼내온 등록 일시

    @JsonIgnore private String formUuid;        // 폼 UUID (첨부파일 매칭용)
    @JsonIgnore private LocalDateTime itvDt;    //DB에서 꺼내온 면담일시

    // String으로 날짜, 시간 내보냄
    public String getDate() {
        return itvDt != null ? itvDt.toLocalDate().toString() : null;
    }
    public String getTime() {
        return itvDt != null ? itvDt.toLocalTime().toString() : null;
    }
}
