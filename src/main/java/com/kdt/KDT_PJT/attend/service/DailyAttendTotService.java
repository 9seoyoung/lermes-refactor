package com.kdt.KDT_PJT.attend.service;

import com.kdt.KDT_PJT.attend.dto.AttendSummaryDto;
import com.kdt.KDT_PJT.attend.dto.CohortAbsenceRowDto;
import com.kdt.KDT_PJT.attend.entity.AttendDtlTypeNm;
import com.kdt.KDT_PJT.attend.entity.DailyAttendTot;
import com.kdt.KDT_PJT.attend.repository.AttendRepository;
import com.kdt.KDT_PJT.attend.repository.DailyAttendTotRepository;
import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import com.kdt.KDT_PJT.cohort.repository.CohortRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DailyAttendTotService {

    private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");

    private final UserRepository userRepository;
    private final AttendRepository attendRepository;
    private final DailyAttendTotRepository dailyAttendTotRepository;
    private final CohortRepository cohortRepository;

    @PersistenceContext
    private EntityManager em;

    /** 매일 새벽: 모든 학생 기본값 결석 처리 */
    @Transactional
    public void seedAbsent(LocalDate date) {
        List<User> users = userRepository.findByEnabledTrueAndCompanySnIsNotNullAndCohortSnIsNotNull();
        for (User user : users) {
            // STUDENT = 5
            if (user.getRoleType() == 5) {
                if (!dailyAttendTotRepository.existsByUserSnAndDate(user.getId(), date)) {
                    DailyAttendTot row = DailyAttendTot.builder()
                            .date(date)
                            .userSn(user.getId())
                            .companySn(user.getCompanySn())
                            .cohortSn(user.getCohortSn() != null ? user.getCohortSn() : 0L)
                            .attendDtlTypeNm(AttendDtlTypeNm.ABSENT)
                            .build();
                    dailyAttendTotRepository.save(row);
                }
            }
        }
    }

    /** 퇴실 시 출결 상태 업데이트 (MIN/MAX 쿼리로 단건 보장) */
    @Transactional
    public void updateDailyAttendTot(Long userSn, Long cohortSn, LocalDateTime time) {
        DailyAttendTot stdDaily = dailyAttendTotRepository
                .findByUserSnAndDate(userSn, time.toLocalDate())
                .orElseThrow(() -> new IllegalStateException("DailyAttendTot not found: " + userSn));

        Cohort cohort = cohortRepository.findById(cohortSn)
                .orElseThrow(() -> new IllegalStateException("cohort not found: " + cohortSn));

        // 기본/코호트별 시간
        LocalTime defaultStartTm = LocalTime.of(8, 30);
        LocalTime defaultEndTm   = LocalTime.of(17, 30);
        LocalTime defaultEarlyLeaveTm = LocalTime.of(12, 30);

        LocalTime attendStartTm = cohort.getAttendStartTm() != null ? cohort.getAttendStartTm() : defaultStartTm;
        LocalTime attendEndTm   = cohort.getAttendEndTm()   != null ? cohort.getAttendEndTm()   : defaultEndTm;
        Duration fullDay = Duration.between(attendStartTm, attendEndTm);

        // 당일 구간
        LocalDate date = time.toLocalDate();
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end   = start.plusDays(1);

        // 첫 입실 시각(MIN)
        LocalTime checkIn = selectMinTime(userSn, true, start, end);
        // 마지막 퇴실 시각(MAX)
        LocalTime checkOut = selectMaxTime(userSn, false, start, end);

        if (checkIn == null) throw new IllegalStateException("입실 시간이 없음");

        if (checkOut != null) {
            Duration work = Duration.between(checkIn, checkOut);
            Duration halfDay = fullDay.dividedBy(2);

            if (work.compareTo(halfDay) >= 0) {
                if (!checkIn.isAfter(attendStartTm)) {
                    // 정시 입실
                    if (!checkOut.isBefore(defaultEarlyLeaveTm) && checkOut.isBefore(attendEndTm)) {
                        stdDaily.updateAttendDtlType(AttendDtlTypeNm.EARLY_LEAVE);
                    } else if (!checkOut.isBefore(attendEndTm)) {
                        stdDaily.updateAttendDtlType(AttendDtlTypeNm.PRESENT);
                    }
                } else {
                    // 지각
                    if (!checkOut.isBefore(attendEndTm)) {
                        stdDaily.updateAttendDtlType(AttendDtlTypeNm.LATE);
                    }
                }
            }
        }
    }

    /** 월간 요약 */
    @Transactional(readOnly = true)
    public AttendSummaryDto getMonthlySummary(Long userSn) {
        LocalDate today = LocalDate.now(ZONE);
        LocalDate start = today.withDayOfMonth(1);
        LocalDate end   = today.withDayOfMonth(today.lengthOfMonth());

        Long absent = dailyAttendTotRepository
                .countByUserSnAndDateBetweenAndAttendDtlTypeNm(userSn, start, end, AttendDtlTypeNm.ABSENT);

        Long present = dailyAttendTotRepository
                .countByUserSnAndDateBetweenAndAttendDtlTypeNmIn(
                        userSn, start, end,
                        List.of(AttendDtlTypeNm.PRESENT, AttendDtlTypeNm.VACATION,
                                AttendDtlTypeNm.SICK_LEAVE, AttendDtlTypeNm.OFFICIAL_LEAVE));

        Long lateEarlyOut = dailyAttendTotRepository
                .countByUserSnAndDateBetweenAndAttendDtlTypeNmIn(
                        userSn, start, end,
                        List.of(AttendDtlTypeNm.LATE, AttendDtlTypeNm.EARLY_LEAVE, AttendDtlTypeNm.OUTING));

        long requiredDays = 0;
        LocalDate date = start;
        while (!date.isAfter(end)) {
            DayOfWeek dow = date.getDayOfWeek();
            if (dow != DayOfWeek.SATURDAY && dow != DayOfWeek.SUNDAY) {
                requiredDays++;
            }
            date = date.plusDays(1);
        }

        return AttendSummaryDto.builder()
                .period(start + " ~ " + end)
                .present(present)
                .lateEarlyOut(lateEarlyOut)
                .absent(absent)
                .requiredDays(requiredDays)
                .build();
    }

    /** 코호트별 금일 결석 현황 (COUNT로 체크인 여부 판정) */
    @Transactional(readOnly = true)
    public List<CohortAbsenceRowDto> getTodayAbsenceByCohortUsingAttendLogs(Long companySn) {
        LocalDate today = LocalDate.now(ZONE);
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end   = start.plusDays(1);

        List<User> users = userRepository.findByEnabledTrueAndCompanySnIsNotNullAndCohortSnIsNotNull();

        // 코호트별 총원
        Map<Long, Long> totalByCohort = new HashMap<>();
        for (User u : users) {
            if (!companySn.equals(u.getCompanySn())) continue;
            if (u.getRoleType() != 5) continue;
            Long cohortSn = u.getCohortSn();
            if (cohortSn == null) continue;
            totalByCohort.put(cohortSn, totalByCohort.getOrDefault(cohortSn, 0L) + 1);
        }

        // 코호트명
        Map<Long, String> labelByCohort = new HashMap<>();
        for (Cohort c : cohortRepository.findAll()) {
            if (!companySn.equals(c.getCoSn())) continue;
            labelByCohort.put(c.getCohortSn(), c.getCohortNm());
        }

        // 오늘 체크인 인원
        Map<Long, Long> checkedInByCohort = new HashMap<>();
        for (User u : users) {
            if (!companySn.equals(u.getCompanySn())) continue;
            if (u.getRoleType() != 5) continue;
            Long cohortSn = u.getCohortSn();
            if (cohortSn == null) continue;

            boolean hasCheckIn = countAttend(u.getId(), true, start, end) > 0;
            if (hasCheckIn) {
                checkedInByCohort.put(cohortSn, checkedInByCohort.getOrDefault(cohortSn, 0L) + 1);
            }
        }

        // 결과 조립
        List<CohortAbsenceRowDto> rows = new ArrayList<>();
        for (Map.Entry<Long, Long> e : totalByCohort.entrySet()) {
            Long cohortSn = e.getKey();
            Long total = e.getValue();
            Long in = checkedInByCohort.getOrDefault(cohortSn, 0L);
            Long absent = Math.max(0L, total - in);

            rows.add(CohortAbsenceRowDto.builder()
                    .cohortSn(cohortSn)
                    .label(labelByCohort.getOrDefault(cohortSn, cohortSn + "기"))
                    .absent(absent)
                    .build());
        }
        rows.sort(Comparator.comparing(CohortAbsenceRowDto::getCohortSn));
        return rows;
    }

    /* ===================== 내부 유틸 (EntityManager 사용) ===================== */

    /** 당일 첫 입실(최소 시각) */
    private LocalTime selectMinTime(Long userSn, boolean inout, LocalDateTime start, LocalDateTime end) {
        Object r = em.createNativeQuery("""
                SELECT MIN(ATTEND_TM)
                FROM TB_ATTEND
                WHERE USER_SN = ?1
                  AND INOUT_YN = ?2
                  AND ATTEND_TM >= ?3 AND ATTEND_TM < ?4
                """)
                .setParameter(1, userSn)
                .setParameter(2, inout ? 1 : 0)
                .setParameter(3, start)
                .setParameter(4, end)
                .getSingleResult();
        if (r == null) return null;
        if (r instanceof java.sql.Timestamp ts) return ts.toLocalDateTime().toLocalTime();
        if (r instanceof LocalDateTime ldt) return ldt.toLocalTime();
        return null;
    }

    /** 당일 마지막 퇴실(최대 시각) */
    private LocalTime selectMaxTime(Long userSn, boolean inout, LocalDateTime start, LocalDateTime end) {
        Object r = em.createNativeQuery("""
                SELECT MAX(ATTEND_TM)
                FROM TB_ATTEND
                WHERE USER_SN = ?1
                  AND INOUT_YN = ?2
                  AND ATTEND_TM >= ?3 AND ATTEND_TM < ?4
                """)
                .setParameter(1, userSn)
                .setParameter(2, inout ? 1 : 0)
                .setParameter(3, start)
                .setParameter(4, end)
                .getSingleResult();
        if (r == null) return null;
        if (r instanceof java.sql.Timestamp ts) return ts.toLocalDateTime().toLocalTime();
        if (r instanceof LocalDateTime ldt) return ldt.toLocalTime();
        return null;
    }

    /** 존재 여부/카운트 (체크인 여부 판정용) */
    private long countAttend(Long userSn, boolean inout, LocalDateTime start, LocalDateTime end) {
        Number n = (Number) em.createNativeQuery("""
                SELECT COUNT(*)
                FROM TB_ATTEND
                WHERE USER_SN = ?1
                  AND INOUT_YN = ?2
                  AND ATTEND_TM >= ?3 AND ATTEND_TM < ?4
                """)
                .setParameter(1, userSn)
                .setParameter(2, inout ? 1 : 0)
                .setParameter(3, start)
                .setParameter(4, end)
                .getSingleResult();
        return n.longValue();
    }
}
