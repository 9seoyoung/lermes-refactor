package com.kdt.KDT_PJT.calendar.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// 글 하나 상세 조회시 사용하는 DTO
@Data
@Builder
@NoArgsConstructor         // 기본 생성자 (DTO 객체의 필드 값이랑 select문의 필드 값의 갯수가 다르면 빈 객체 만들고 setter로 설정하는 방법을 쓰기 때문에 필수)
@AllArgsConstructor         // Data + builder 조합일때는 @AllArgsConstructor가 자동 생성되서 상관 없는데 @NoArgsConstructor명시하면 자동생성 더이상 안해서 써줘야함
public class CalendarDetailResponseDTO {
    private Integer calSn;
    @JsonIgnore private LocalDateTime eventBgngDt;  //EVENT_BGNG_DT
    @JsonIgnore private LocalDateTime eventEndDt;   //EVENT_END_DT
    @JsonProperty("title")
    private String eventNm;             //EVENT_NM 이벤트 이름
    @JsonProperty("memo")
    private String rmrkCn;              //RMRK_CN 이벤트 설명
    @JsonProperty("location")
    private String eventPlc;            //이벤트 장소
    private String userNm;              // 작성자명, TB_USER에서 userSn으로 조인해서 가져오기
    private LocalDateTime eventRegDt;   //EVENT_REG_DT 작성일
    private Byte prvtYn;                //PRVT_YN 개인일정이면1 아니면 0
    //    private Integer coSn;         //굳이? 회사정보 보내줄필요는없을듯
    private Integer viewCnt;            // 조회수 (상세보기 눌렀을떄 up)
    @JsonIgnore private Integer userSn;             //USER_SN 사용자 일련번호 이거는 보내줄필요없을듯,
    @JsonIgnore private Integer cohortSn;           //COHORT_SN

    //Json으로 내보낼때 변환
    public String getStartDate() {
        return eventBgngDt != null ? eventBgngDt.toLocalDate().toString() : null;
    }

    public String getStartTime() {
        return eventBgngDt != null ? eventBgngDt.toLocalTime().toString() : null;
    }

    public String getEndDate() {
        return eventEndDt != null ? eventEndDt.toLocalDate().toString() : null;
    }

    public String getEndTime() {
        return eventEndDt != null ? eventEndDt.toLocalTime().toString() : null;
    }
}
