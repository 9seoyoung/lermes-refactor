package com.kdt.KDT_PJT.bbsList.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BbsListResponseDto {
    private Long contentSn;     //bbs or survey
    private String bbsType;
    private String title;
    private Long userSn;
    private String writerName;    // 작성자 이름
    private Long coSn;            // 회사 SN
    private Long cohortSn;        // 기수 SN
    private LocalDateTime createdAt; // 작성일
    private Boolean delYn;
    private String scope;
    private Integer viewCnt;      //조회수
}
