package com.kdt.KDT_PJT.survey.enums;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Getter
@RequiredArgsConstructor

public enum SurveyStatus {

    SCHEDULED,      // 예정, 시작일 전
    ONGOING,        // 진행중, 시작일 ~ 종료일 사이
    CLOSED;         // 마감, 종료일 이후

    public static SurveyStatus of(LocalDateTime now, LocalDateTime start, LocalDateTime end) {
        if (now.isBefore(start)) {
            return SCHEDULED;
        } else if (!now.isAfter(end)) { // now <= end
            return ONGOING;
        } else {
            return CLOSED;
        }

    }
}
