package com.kdt.KDT_PJT.attend.service;

import com.kdt.KDT_PJT.attend.dto.*;
import com.kdt.KDT_PJT.attend.entity.Attend;
import com.kdt.KDT_PJT.attend.repository.AttendRepository;
import com.kdt.KDT_PJT.attend.support.CodeStore;
import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AttendService {

    private final CodeStore codeStore;                              // 메모리 캐시(표시용 포함)
    private final PasswordEncoder passwordEncoder;                  // BCrypt
    private final AttendRepository attendRepository;
    private final DailyAttendTotService dailyAttendTotService;
    private final UserRepository userRepository;

    @PersistenceContext
    private EntityManager em;                          // 네이티브 쿼리 (exists)

    private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");
    private static final int DEFAULT_TTL = 10; // minutes

    /** 코드 저장 키: cohort 기준으로 통일 */
    private String codeKey(Long cohortSn) {
        return "attend:code:cohort:" + cohortSn;
    }

    /** 강사: 코드 생성 */
    public String createCode(CreateAttendCodeRequest req, String requesterIp, Authentication auth) {
        if (req.getCode() == null || req.getCode().isBlank()) {
            throw new IllegalArgumentException("code는 필수입니다.");
        }

        AuthCustomUserDetails me = requirePrincipal(auth);
        Long cohortSn = requireNonNull(me.getCohortSn(), "로그인 정보에 기수 번호가 없습니다.");

        String allowedIp = (req.getAllowedIp() == null || req.getAllowedIp().isBlank())
                ? requesterIp
                : req.getAllowedIp();

        String hashed = passwordEncoder.encode(req.getCode());
        codeStore.put(codeKey(cohortSn), hashed, allowedIp, DEFAULT_TTL, req.getCode()); // 표시용 저장

        return req.getCode(); // 평문 반환(강사에게만)
    }

    /** 학생/강사 공통: 현재 활성 코드 조회(표시용 평문) */
    public Optional<String> peekActiveCode(Authentication auth) {
        AuthCustomUserDetails me = requirePrincipal(auth);
        Long cohortSn = requireNonNull(me.getCohortSn(), "기수 번호가 없습니다.");
        return codeStore.get(codeKey(cohortSn)).map(CodeStore.CodeData::displayCode);
    }

    /** 학생 출석 처리 */
    @Transactional
    public CheckinResponse checkin(SubmitAttendRequest req, String clientIp, Authentication auth) {
        if (req.getCode() == null || req.getCode().isBlank()) {
            throw new IllegalArgumentException("code는 필수입니다.");
        }

        AuthCustomUserDetails me = requirePrincipal(auth);
        Long userSn   = requireNonNull(me.getId(), "로그인 정보에 사용자 번호가 없습니다.");
        Long coSn     = requireNonNull(me.getCompanySn(), "로그인 정보에 회사 번호가 없습니다.");
        Long cohortSn = requireNonNull(me.getCohortSn(), "로그인 정보에 기수 번호가 없습니다.");

        CodeStore.CodeData data = codeStore.get(codeKey(cohortSn))
                .orElseThrow(() -> new IllegalStateException("유효한 출석코드가 없습니다."));

        if (!clientIp.equals(data.allowedIp())) {
            throw new IllegalStateException("허용되지 않은 네트워크(IP)입니다.");
        }
        if (!passwordEncoder.matches(req.getCode(), data.hashedCode())) {
            throw new IllegalArgumentException("코드가 일치하지 않습니다.");
        }
        if (existsTodayByInout(userSn, true)) {
            throw new IllegalStateException("오늘 이미 입실 처리되었습니다.");
        }

        Attend att = Attend.builder()
                .userSn(userSn)
                .coSn(coSn)
                .cohortSn(cohortSn)
                .attendTm(LocalDateTime.now(ZONE))
                .inoutYn(true) // 입실
                .build();
        attendRepository.save(att);

        return CheckinResponse.builder()
                .ok(true)
                .message("입실 성공")
                .checkinTime(att.getAttendTm())
                .build();
    }

    /** 학생 퇴실 처리 */
    @Transactional
    public CheckoutResponse checkout(Authentication auth) {
        AuthCustomUserDetails me = requirePrincipal(auth);
        Long userSn   = requireNonNull(me.getId(), "로그인 정보에 사용자 번호가 없습니다.");
        Long coSn     = requireNonNull(me.getCompanySn(), "로그인 정보에 회사 번호가 없습니다.");
        Long cohortSn = requireNonNull(me.getCohortSn(), "로그인 정보에 기수 번호가 없습니다.");

        if (!existsTodayByInout(userSn, true)) {
            throw new IllegalStateException("오늘 입실 이력이 없습니다.");
        }
        if (existsTodayByInout(userSn, false)) {
            throw new IllegalStateException("오늘 이미 퇴실 처리되었습니다.");
        }

        Attend att = Attend.builder()
                .userSn(userSn)
                .coSn(coSn)
                .cohortSn(cohortSn)
                .attendTm(LocalDateTime.now(ZONE))
                .inoutYn(false) // 퇴실
                .build();
        attendRepository.save(att);

        LocalDateTime attendTm = att.getAttendTm(); // 학생의 퇴실시간

        dailyAttendTotService.updateDailyAttendTot(userSn, cohortSn, attendTm);

        return CheckoutResponse.builder()
                .ok(true)
                .message("퇴실 성공")
                .checkoutTime(att.getAttendTm())
                .build();
    }

    /** 오늘 입/퇴실 시각 조회 */
    @Transactional(readOnly = true)
    public AttendTodayResponse getTodayStatus(Authentication auth) {
        AuthCustomUserDetails me = requirePrincipal(auth);
        Long userSn = requireNonNull(me.getId(), "로그인 정보에 사용자 번호가 없습니다.");

        LocalDateTime start = LocalDate.now(ZONE).atStartOfDay();
        LocalDateTime end   = start.plusDays(1);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm");

        String checkIn = attendRepository
                .findByUserSnAndInoutYnAndAttendTmBetween(userSn, true, start, end)
                .map(a -> a.getAttendTm().format(fmt))
                .orElse(null);

        String checkOut = attendRepository
                .findByUserSnAndInoutYnAndAttendTmBetween(userSn, false, start, end)
                .map(a -> a.getAttendTm().format(fmt))
                .orElse(null);

        return AttendTodayResponse.builder()
                .ok(true)
                .checkinTime(checkIn)
                .checkoutTime(checkOut)
                .build();
    }

    /** 오늘 특정 in/out 존재 여부 (네이티브) */
    private boolean existsTodayByInout(Long userSn, boolean inoutYn) {
        Object r = em.createNativeQuery("""
                SELECT EXISTS(
                  SELECT 1
                  FROM TB_ATTEND
                  WHERE USER_SN = ?1
                    AND DATE(ATTEND_TM) = CURRENT_DATE
                    AND INOUT_YN = ?2
                  LIMIT 1
                )
                """)
                .setParameter(1, userSn)
                .setParameter(2, inoutYn ? 1 : 0)
                .getSingleResult();

        if (r instanceof BigInteger bi) return bi.intValue() == 1;
        if (r instanceof Number n)     return n.intValue() == 1;
        return Boolean.TRUE.equals(r);
    }

    private AuthCustomUserDetails requirePrincipal(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()
                || !(auth.getPrincipal() instanceof AuthCustomUserDetails p)) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }
        return p;
    }

    private static Long requireNonNull(Long v, String msg) {
        if (v == null) throw new IllegalStateException(msg);
        return v;
    }

    /** 강사: 출석코드 강제 만료(cohort 기준) */
    public void invalidateCode(Long cohortSn) {
        codeStore.clear(codeKey(cohortSn));
    }

    /** 금일 출석현황 조회 강사용 */
    @Transactional(readOnly = true)
    public List<StudentAttendanceDto> getTodayStudentAttendance(Authentication auth) {
        AuthCustomUserDetails me = requirePrincipal(auth);

        Long cohortSn = me.getCohortSn();
        LocalDateTime startOfDay = LocalDate.now(ZONE).atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        List<Attend> todayAttendLogs = attendRepository
                .findByCohortSnAndAttendTmBetween(cohortSn, startOfDay, endOfDay)
                .orElseGet(Collections::emptyList);

        List<User> cohortMembers = userRepository
                .findByCohortSn(cohortSn)
                .orElseGet(Collections::emptyList);

        List<User> cohortStudents = new ArrayList<>();
        for (User member : cohortMembers) {
            if (member.getRoleType() != 4) { // INSTRUCTOR 제외
                cohortStudents.add(member);
            }
        }

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        LocalTime attendStartTm = LocalTime.of(8, 30);
        LocalTime attendEndTm   = LocalTime.of(17, 30);
        Duration fullDay  = Duration.between(attendStartTm, attendEndTm);
        Duration halfDay  = fullDay.dividedBy(2);
        LocalTime lateLimit = attendStartTm.plus(fullDay.dividedBy(2)); // 🔹 절반 이후 입실은 결석 처리

        List<StudentAttendanceDto> results = new ArrayList<>();

        for (User student : cohortStudents) {
            List<Attend> logs = todayAttendLogs.stream()
                    .filter(l -> l.getUserSn().equals(student.getId()))
                    .toList();

            LocalTime checkIn = logs.stream()
                    .filter(l -> Boolean.TRUE.equals(l.getInoutYn()))
                    .map(l -> l.getAttendTm().toLocalTime())
                    .findFirst()
                    .orElse(null);

            LocalTime checkOut = logs.stream()
                    .filter(l -> Boolean.FALSE.equals(l.getInoutYn()))
                    .map(l -> l.getAttendTm().toLocalTime())
                    .findFirst()
                    .orElse(null);

            String checkInStr = checkIn != null ? checkIn.format(timeFormatter) : null;
            String checkOutStr = checkOut != null ? checkOut.format(timeFormatter) : null;

            String status;
            if (checkIn == null) {
                status = "ABSENT";
            } else if (checkOut == null) {
                // 🔹 절반 이후 입실은 결석 처리
                if (checkIn.isAfter(lateLimit)) {
                    status = "ABSENT";
                } else if (checkIn.isAfter(attendStartTm)) {
                    status = "LATE_PENDING";
                } else {
                    status = "PRESENT_PENDING";
                }
            } else {
                Duration work = Duration.between(checkIn, checkOut);
                if (work.compareTo(halfDay) < 0) {
                    status = "ABSENT";
                } else if (checkIn.isAfter(attendStartTm) && checkOut.isBefore(attendEndTm)) {
                    status = "ABSENT";
                } else if (checkOut.isBefore(attendEndTm)) {
                    status = "EARLY_LEAVE";
                } else if (checkIn.isAfter(attendStartTm)) {
                    status = "LATE";
                } else {
                    status = "PRESENT";
                }
            }

            results.add(StudentAttendanceDto.builder()
                    .userSn(student.getId())
                    .username(student.getName())
                    .checkInTime(checkInStr)
                    .checkOutTime(checkOutStr)
                    .status(status)
                    .build());
        }

        return results;
    }

    /** 금일 출석현황 조회 (관리자/테넌트: 기수별 조회용) */
    @Transactional(readOnly = true)
    public List<StudentAttendanceDto> getTodayStudentAttendanceByCohort(Authentication auth, Long cohortSn) {
        LocalDateTime startOfDay = LocalDate.now(ZONE).atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        List<Attend> todayAttendLogs = attendRepository
                .findByCohortSnAndAttendTmBetween(cohortSn, startOfDay, endOfDay)
                .orElseGet(Collections::emptyList);

        List<User> cohortMembers = userRepository
                .findByCohortSn(cohortSn)
                .orElseGet(Collections::emptyList);

        List<User> cohortStudents = new ArrayList<>();
        for (User member : cohortMembers) {
            if (member.getRoleType() != 4) { // INSTRUCTOR 제외
                cohortStudents.add(member);
            }
        }

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        LocalTime attendStartTm = LocalTime.of(8, 30);
        LocalTime attendEndTm   = LocalTime.of(17, 30);
        Duration fullDay  = Duration.between(attendStartTm, attendEndTm);
        Duration halfDay  = fullDay.dividedBy(2);
        LocalTime lateLimit = attendStartTm.plus(fullDay.dividedBy(2)); // 🔹 절반 이후 입실은 결석 처리

        List<StudentAttendanceDto> results = new ArrayList<>();

        for (User student : cohortStudents) {
            List<Attend> logs = todayAttendLogs.stream()
                    .filter(l -> l.getUserSn().equals(student.getId()))
                    .toList();

            LocalTime checkIn = logs.stream()
                    .filter(l -> Boolean.TRUE.equals(l.getInoutYn()))
                    .map(l -> l.getAttendTm().toLocalTime())
                    .findFirst()
                    .orElse(null);

            LocalTime checkOut = logs.stream()
                    .filter(l -> Boolean.FALSE.equals(l.getInoutYn()))
                    .map(l -> l.getAttendTm().toLocalTime())
                    .findFirst()
                    .orElse(null);

            String checkInStr = checkIn != null ? checkIn.format(timeFormatter) : null;
            String checkOutStr = checkOut != null ? checkOut.format(timeFormatter) : null;

            String status;
            if (checkIn == null) {
                status = "ABSENT";
            } else if (checkOut == null) {
                // 🔹 절반 이후 입실은 결석 처리
                if (checkIn.isAfter(lateLimit)) {
                    status = "ABSENT";
                } else if (checkIn.isAfter(attendStartTm)) {
                    status = "LATE_PENDING";
                } else {
                    status = "PRESENT_PENDING";
                }
            } else {
                Duration work = Duration.between(checkIn, checkOut);
                if (work.compareTo(halfDay) < 0) {
                    status = "ABSENT";
                } else if (checkIn.isAfter(attendStartTm) && checkOut.isBefore(attendEndTm)) {
                    status = "ABSENT";
                } else if (checkOut.isBefore(attendEndTm)) {
                    status = "EARLY_LEAVE";
                } else if (checkIn.isAfter(attendStartTm)) {
                    status = "LATE";
                } else {
                    status = "PRESENT";
                }
            }

            results.add(StudentAttendanceDto.builder()
                    .userSn(student.getId())
                    .username(student.getName())
                    .checkInTime(checkInStr)
                    .checkOutTime(checkOutStr)
                    .status(status)
                    .build());
        }

        return results;
    }

    /**
     * 작성자: 940
     * 수업시간 이후 출결 누락자 -> 미출결상태
     * 이전 < 수업시간 + 10분 > 이후 =====================
     * 출근 / 퇴근 / 기타(조퇴/외출)
     * 1(정상) / 1(정상) / -1(비정상)
     * 합이 2면 정상
     * 합이 1이면 지각/조퇴/외출
     * 합이 0이하면 결석
     * ===============================================
     * 출/퇴근 기록과 다름 뭔가 상태로 저장해놔야 성능 좋을 것 같음
     * ===============================================
     *
     */
}
