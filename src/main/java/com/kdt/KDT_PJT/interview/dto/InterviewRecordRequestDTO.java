package com.kdt.KDT_PJT.interview.dto;

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
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewRecordRequestDTO {
    private Integer itvSn;          //매칭되는 면담에 대한 일련번호, 번개면 없어도됨
    private String itvRecordTtl;    // 면담 기록 제목
    @JsonProperty("content")
    @JsonAlias("itvRecordCn")
    private String itvRecordCn;     // 면담 기록 내용
    @JsonProperty("id")
    private String formUuid;        // 폼 UUID (첨부파일 매칭용)
    private Integer itvPicSn;       // 면담 담당자 일련번호
    private Integer itvTrprSn;      // 면담 대상자 일련번호
    private Integer cohortSn;       // 기수 일련번호
    private Integer coSn;           // 회사 일련번호
    private String date;            // 프론트 입력 받기용 (날짜)
    private String time;            // 프론트 입력 받기용 (시간)

    @JsonIgnore private LocalDateTime itvDt;    //DB저장용 면담 일시
    @JsonIgnore private Integer itvRecordSn;    //면담 기록 일련번호

    public void buildDateTime(){
        // 년월일 비워져있으면 현재 연월일시분초 입력
        if(date == null || date.isBlank()){
            this.itvDt = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
            return;
        }
        // 년월일 입력됐지만 시간 비워져있으면
        if (time == null || time.isBlank()) {
            LocalDate targetDate = LocalDate.parse(this.date);
            LocalTime nowTime = LocalTime.now().truncatedTo(ChronoUnit.SECONDS);
            this.itvDt = LocalDateTime.of(targetDate, nowTime);
            return;
        }
        // 둘다있는경우
        this.itvDt = LocalDateTime.parse(this.date + "T" + this.time).truncatedTo(ChronoUnit.SECONDS);
    }
}
