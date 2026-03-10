// com.kdt.KDT_PJT.attend.dto.AttendTodayResponse
package com.kdt.KDT_PJT.attend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AttendTodayResponse {
    private boolean ok;
    private String checkinTime;   // 없으면 null
    private String checkoutTime;  // 없으면 null
}
