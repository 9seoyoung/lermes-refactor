package com.kdt.KDT_PJT.studySchedule.dto;

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
public class StudyScheduleResponseDTO {

    private Integer scheduleSn; //걍 sn 다실음
    private String boardType;   //이거로 어떤 건지 구분함
    private String title;
    private String createdAt;   //작성일
    @JsonIgnore private LocalDateTime regDt;
    private String userNm;
    private Integer viewCnt;
//    private Integer userSn;

    public String getcreatedAt() {
        return regDt != null ? regDt.toLocalDate().toString() : null;
    }
}
