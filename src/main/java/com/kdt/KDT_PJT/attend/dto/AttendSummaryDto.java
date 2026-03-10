// com.kdt.KDT_PJT.attend.dto.AttendSummaryDto
package com.kdt.KDT_PJT.attend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendSummaryDto {
    private String period;     // "2025-09-01 ~ 2025-09-30"
    private Long present;      // 출석
    private Long lateEarlyOut; // 지각/조퇴
    private Long absent;       // 결석(휴가/병가/공가 포함)
    private Long requiredDays; // 출석 요구일
}
