package com.kdt.KDT_PJT.interview.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewRecordListResponseDTO {
    private Integer itvRecordSn;    //PK
    private Integer itvSn;          //매칭되는 면담에 대한 일련번호
    private String itvRecordTtl;    // 면담 기록 제목
    private Integer itvPicSn;       // 면담 담당자 일련번호
    private String itvPicNm;        // 면담 담당자 명
    private Integer viewCnt;        // 조회수
    private LocalDateTime regDt;    //DB에서 꺼내온 등록 일시
    private String postType;        //면담기록

//    public String getPostType() {return "면담기록";}
}
