package com.kdt.KDT_PJT.calendar.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarUpdateRequestDTO { // 업데이트 전용 DTO
//    private LocalDateTime eventBgngDt;
//    private LocalDateTime eventEndDt;
//    private String eventNm;
//    private String rmrkCn;
//    private Byte prvtYn;

    private Integer calSn;              // 수정할 일정에 대한 sn 넣어주는용도
    @JsonProperty("detailScope")
    @JsonAlias("cohortSn")
    private Integer cohortSn;           //관리자는 실어서 보내야하고, 강사.학생은 ㄱㅊ COHORT_SN

    private String startDate;           //nullable, 들어오면 일정시작 종료 수정한다는 의미
    private String endDate;             //nullable, 안들어오면 = startDate
    private String startTime;           //nullable, 안들어오면 00:00:00 으로 고정
    private String endTime;             //nullable, 안들어오면 23:59:59 으로 고정
    @JsonProperty("location")
    private String eventPlc;            //nullable, 장소
    @JsonProperty("title")
    private String eventNm;             //nullable, EVENT_NM 이벤트 이름
    @JsonProperty("memo")
    @JsonAlias("content")
    private String rmrkCn;              //nullable, RMRK_CN 이벤트 설명
    @JsonProperty("isPrivate")
    private Boolean prvtYn;                //개인일정1, 공식일정0

    @JsonIgnore private LocalDateTime eventBgngDt;  //저장용
    @JsonIgnore private LocalDateTime eventEndDt;   //저장용
    @JsonIgnore private LocalDateTime eventRegDt;   //저장용
    @JsonIgnore private Integer coSn;               //저장용

    @JsonIgnore private Integer userSn;

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
