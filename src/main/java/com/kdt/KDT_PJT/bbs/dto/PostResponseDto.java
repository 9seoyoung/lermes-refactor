package com.kdt.KDT_PJT.bbs.dto;

import com.kdt.KDT_PJT.bbs.enums.BbsScope;
import com.kdt.KDT_PJT.bbs.enums.BbsType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PostResponseDto {
    private Long postSn;                  // 게시물 일련번호 (PK)
    private String postTtl;               // 게시물 제목
    private String postCn;                // 게시물 내용
    private Long postWrtrSn;              // 작성자 일련번호
    private String postWriterName;        // 작성자 이름 (USER 테이블 join)
    private LocalDateTime postFrstWrtDt;  // 최초 작성일시
    private LocalDateTime postLastMdfcnDt;// 최종 수정일시
    private Boolean delYn;                // 삭제 여부
    private Long coSn;                    // 회사 일련번호 (FK)
    private Long cohortSn;                // 기수/과정 일련번호 (FK)
    private String formUuid;              // UUID
    private BbsType bbsType;              // 게시판 유형 (영문 Enum)
    private BbsScope bbsScope;            // 공개 범위
    private Integer viewCnt;             //조회수
}
