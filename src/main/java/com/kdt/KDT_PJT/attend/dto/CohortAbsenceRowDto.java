package com.kdt.KDT_PJT.attend.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CohortAbsenceRowDto {
    private Long cohortSn;   // 10기/11기 식 라벨 뽑을 때 사용
    private String label;    // "10기"
    private Long absent;     // 오늘 결석 수 (총원 - 오늘 체크인자)
}
