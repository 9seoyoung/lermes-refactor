package com.kdt.KDT_PJT.attend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class AbsenceCountsRes {
    private long pendingCount;
}
