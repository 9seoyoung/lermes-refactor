package com.kdt.KDT_PJT.calendar.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;

@Data
@Builder // 사용시 .로 와다다 붙이기 ㄱㄴ
@NoArgsConstructor
@AllArgsConstructor
public class CalendarRequestDTO {
    @JsonProperty("detailScope")
    @JsonAlias("cohortSn")
    private Integer cohortSn;           //COHORT_SN
    private String startDate;
    private String endDate;             //nullable, 안들어오면 = startDate
    private String startTime;           //nullable, 안들어오면 00:00:00 으로 고정
    private String endTime;             //nullable, 안들어오면 23:59:59 으로 고정
    @JsonProperty("location")
    private String eventPlc;
    @JsonProperty("title")
    private String eventNm;             //EVENT_NM 이벤트 이름
    @JsonProperty("memo")
    @JsonAlias("content")
    private String rmrkCn;              //RMRK_CN 이벤트 설명
    private Integer userSn;             //USER_SN 사용자 일련번호
    @JsonProperty("isPrivate")
    private Boolean prvtYn;                //PRVT_YN 개인일정이면1 아니면 0

    @JsonIgnore private LocalDateTime eventBgngDt;  //저장용
    @JsonIgnore private LocalDateTime eventEndDt;   //저장용
    @JsonIgnore private LocalDateTime eventRegDt;   //저장용
    @JsonIgnore private Integer coSn;               //저장용
    @JsonIgnore private Integer calSn;              //생성된 pk 받기용


    public void buildDateTime() {
        this.eventBgngDt = mergeToDateTime(this.startDate, this.startTime, false);
        this.eventEndDt  = mergeToDateTime(
                (this.endDate == null || this.endDate.isBlank()) ? this.startDate : this.endDate,
                this.endTime,
                true
        );
        this.eventRegDt = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
    }
    // 시간 값 날아온거 db에 넣기 좋게 파싱
    private LocalDateTime mergeToDateTime(String date, String time, boolean isEnd) {
        LocalDate d = LocalDate.parse(date);
        if (time == null || time.isBlank()) {
            return isEnd ? d.atTime(23, 59, 59) : d.atStartOfDay(); // 시작시간 안날아왔으면 00:00:00 넣고 종료시간 안날아왔으면 23:59:59 넣음
        }
        return LocalDateTime.of(d, LocalTime.parse(time));
    }
}
