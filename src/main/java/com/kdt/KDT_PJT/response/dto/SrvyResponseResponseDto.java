package com.kdt.KDT_PJT.response.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SrvyResponseResponseDto {
    private Long rspnsSn;        // 응답 일련번호 (PK)
    private String responseUuid;    //uuid
    private String parentType;   // 부모 유형 (SURVEY, COHORT 등)
    private Long parentSn;       // 부모 일련번호 (설문 SN 등)
    private Long userSn;         // 응답자 SN
    private LocalDateTime rspnsDt; // 응답 일시
    private String rspnsCn;      // 응답 내용(JSON 문자열)
    private Integer viewCnt;     // 조회 수
    private Boolean delYn;       // 삭제 여부 (0=false, 1=true)
}
