package com.kdt.KDT_PJT.response.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SrvyRequestResponseDto {
    private Long parentSn;        // 부모 일련번호 (설문 SN, 모집 SN 등)
    private String parentType;    // 부모 유형 (SURVEY, COHORT 등)
    private Long userSn;          // 응답자 SN (서비스에서 auth로 보정)
    private String response;      // JSON 응답 (예: {"Q1":"내가 좋아하는 사람?","A1":"꾸끼끼"});
}
