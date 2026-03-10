package com.kdt.KDT_PJT.attend.support;

import com.kdt.KDT_PJT.attend.service.DailyAttendTotService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class AttendScheduler {

    private final DailyAttendTotService dailyAttendTotService;

    // 매일 새벽 00:10 → 결석 기본값 세팅
    @Scheduled(cron = "0 10 00 * * *", zone = "Asia/Seoul")
    public void seedAbsentJob() {
        dailyAttendTotService.seedAbsent(LocalDate.now());
    }

//    // 매일 밤 23:50 → 출결 재집계
//    @Scheduled(cron = "0 59 23 * * *", zone = "Asia/Seoul")
//    public void recomputeJob() {
//        dailyAttendTotService.recompute(LocalDate.now());
//    }
}
