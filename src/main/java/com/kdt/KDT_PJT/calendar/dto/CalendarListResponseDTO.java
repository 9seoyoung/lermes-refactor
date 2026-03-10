package com.kdt.KDT_PJT.calendar.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor         // 기본 생성자 (DTO 객체의 필드 값이랑 select문의 필드 값의 갯수가 다르면 빈 객체 만들고 setter로 설정하는 방법을 쓰기 때문에 필수)
@AllArgsConstructor         // Data + builder 조합일때는 @AllArgsConstructor가 자동 생성되서 상관 없는데 @NoArgsConstructor명시하면 자동생성 더이상 안해서 써줘야함
public class CalendarListResponseDTO { // 상세보기 들어가기 전, 리스트로 보여주기용.
    private Integer calSn;
//    private Integer cohortSn;           //COHORT_SN
    private LocalDateTime eventBgngDt;  //EVENT_BGNG_DT
    private LocalDateTime eventEndDt;   //EVENT_END_DT
    @JsonProperty("title")
    private String eventNm;             //EVENT_NM 이벤트 이름
//    private String rmrkCn;              //RMRK_CN 이벤트 설명 -> 상세보기에서 보여주기
    private String userNm;                // 작성자명, TB_USER에서 userSn으로 조인해서 가져오기
    private LocalDateTime eventRegDt;   //EVENT_REG_DT 작성일
    private Byte prvtYn;                //PRVT_YN 개인일정이면1 아니면 0
    @JsonProperty("postType") // 또는 @JsonGetter("postType")
    public String getPostType() {
        return Byte.valueOf((byte)1).equals(prvtYn) ? "개인 일정" : "공식 일정";
    }
//    private Integer coSn;             //굳이? 회사정보 보내줄필요는없을듯
    private Integer viewCnt;            // 조회수 (상세보기 눌렀을떄 up)
    // CalendarSimpleResponseDTO (조회 조건 필드)
    @JsonIgnore private LocalDateTime searchStartDate;
    @JsonIgnore private LocalDateTime searchEndDate;
    @JsonIgnore private Integer userSn;
}
