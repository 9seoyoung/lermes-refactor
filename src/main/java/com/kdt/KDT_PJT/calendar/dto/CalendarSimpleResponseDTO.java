package com.kdt.KDT_PJT.calendar.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// 막대기 형태로 반환해줄때 여기 실을거임
@Data                        //getter,setter,requiredArgsConstructor, tostring,equalsandhashcode
@Builder
@NoArgsConstructor         // 기본 생성자 (DTO 객체의 필드 값이랑 select문의 필드 값의 갯수가 다르면 빈 객체 만들고 setter로 설정하는 방법을 쓰기 때문에 필수)
@AllArgsConstructor        // Data + builder 조합일때는 @AllArgsConstructor가 자동 생성되서 상관 없는데 @NoArgsConstructor명시하면 자동생성 더이상 안해서 써줘야함
public class CalendarSimpleResponseDTO {
                private Integer         calSn;
                private String          eventNm;
                private LocalDateTime   eventBgngDt;
                private LocalDateTime   eventEndDt;
                private Byte            prvtYn;
    @JsonIgnore private Integer         cohortSn;
    // CalendarSimpleResponseDTO (조회 조건 필드)
    @JsonIgnore private LocalDateTime   searchStartDate;
    @JsonIgnore private LocalDateTime   searchEndDate;
    @JsonIgnore private Integer         userSn;
}
