package com.kdt.KDT_PJT.bbs.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.kdt.KDT_PJT.bbs.enums.BbsScope;
import com.kdt.KDT_PJT.bbs.enums.BbsType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostRequestDto {
    private Long postSn;        // 게시물 일련번호 (PK, 수정/삭제 시 필요)
    @JsonProperty("title")
    @JsonAlias({"postTtl"})
    private String postTtl;     // 게시물 제목
    @JsonProperty("content")
    @JsonAlias({"postCn"})
    private String postCn;      // 게시물 내용
    @JsonProperty("userSn")
    private Long postWrtrSn;    // 작성자 일련번호 (세션에서 꺼내서 넣을 수도 있음)
    @JsonProperty("coSn")
    @JsonAlias("effectiveSn")
    private Long coSn;          // 회사 일련번호 (FK)
    @JsonProperty("cohortSn")
    @JsonAlias("detailScope")
    private Long cohortSn;      // 기수/과정 일련번호 (FK)
    @JsonProperty("type")
    @JsonAlias({"bbsType"})
    private BbsType bbsType;     // 게시판 유형 (공지, 자료실, FAQ, 문의, 임시저장)
    @JsonProperty("scope")
    @JsonAlias({"bbsScope"})
    private BbsScope bbsScope;    // 공개 범위 (전체, 회사, 기수, 비공개)


    private LocalDateTime postFrstWrtDt;
    private LocalDateTime postLastMdfcnDt;

}
