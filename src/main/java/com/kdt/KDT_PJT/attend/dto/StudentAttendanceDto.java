package com.kdt.KDT_PJT.attend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StudentAttendanceDto {
    private Long userSn;
    private String username;
    private String checkInTime;   // "09:01"
    private String checkOutTime;  // "17:30"
    private String status;        // "ABSENT", "PRESENT", "LATE", "EARLY_LEAVE"
}
