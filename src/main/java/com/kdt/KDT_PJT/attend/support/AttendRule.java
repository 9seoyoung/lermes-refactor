package com.kdt.KDT_PJT.attend.support;

import com.kdt.KDT_PJT.attend.entity.AttendDtlTypeNm;

import java.time.Duration;
import java.time.LocalTime;

public class AttendRule {

    /**
     * 현재 서비스 로직과 동일한 규칙:
     * - work < halfDay ⇒ ABSENT
     * - checkIn <= start:
     *      - earlyCut(기본 12:30) 이상 && end 미만 ⇒ EARLY_LEAVE
     *      - end 이상 ⇒ PRESENT
     * - checkIn > start(지각):
     *      - end 이상 ⇒ LATE
     *      - 그 외 ⇒ ABSENT (지각+조퇴는 결석)
     */
    public static AttendDtlTypeNm decide(LocalTime checkIn,
                                         LocalTime checkOut,
                                         LocalTime attendStartTm,
                                         LocalTime attendEndTm,
                                         LocalTime defaultEarlyLeaveTm) {

        if (checkIn == null || checkOut == null) {
            return AttendDtlTypeNm.ABSENT;
        }

        Duration fullDay = Duration.between(attendStartTm, attendEndTm);
        Duration work = Duration.between(checkIn, checkOut);
        Duration halfDay = fullDay.dividedBy(2);

        // 절반 미만은 결석
        if (work.compareTo(halfDay) < 0) {
            return AttendDtlTypeNm.ABSENT;
        }

        boolean onOrBeforeStart = !checkIn.isAfter(attendStartTm);     // checkIn <= start
        boolean earlyLeave = checkOut.isBefore(attendEndTm);           // checkOut < end
        boolean passEarlyCut = !checkOut.isBefore(defaultEarlyLeaveTm);// checkOut >= earlyCut
        boolean meetEnd = !checkOut.isBefore(attendEndTm);             // checkOut >= end

        if (onOrBeforeStart) {
            if (earlyLeave && passEarlyCut) return AttendDtlTypeNm.EARLY_LEAVE;
            if (meetEnd) return AttendDtlTypeNm.PRESENT;
            return AttendDtlTypeNm.ABSENT;
        } else {
            if (meetEnd) return AttendDtlTypeNm.LATE;
            return AttendDtlTypeNm.ABSENT;
        }
    }
}
