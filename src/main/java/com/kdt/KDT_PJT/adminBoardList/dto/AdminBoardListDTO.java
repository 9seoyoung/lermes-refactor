package com.kdt.KDT_PJT.adminBoardList.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminBoardListDTO {
    private Integer sn;             // 고유번호 (테이블별)
    private String boardType;       // 게시판 타입, 이걸로 무슨테이블 글인지 구분할거임. (enum으로 정해야하나)
    private String title;           // 글 제목
    private LocalDateTime regDt;    // 게시일 YYYYMMDD
    private String userNm;          // 글 작성자 이름 (userTB와 join 필요)
    private Integer viewCnt;        // 게시글 조회수
    @JsonIgnore private Integer cohortSn;
    @JsonIgnore private Integer userSn;
    @JsonIgnore private Integer roleType;
}
