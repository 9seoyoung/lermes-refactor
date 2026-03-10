package com.kdt.KDT_PJT.attend.api;

import com.kdt.KDT_PJT.attend.dto.*;
import com.kdt.KDT_PJT.attend.service.AttendDocumentService;
import com.kdt.KDT_PJT.attend.service.AttendService;
import com.kdt.KDT_PJT.attend.service.DailyAttendTotService;
import com.kdt.KDT_PJT.attend.support.ClientIpResolver;
import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attend")
@RequiredArgsConstructor
public class AttendController {

    private final AttendService attendService;
    private final DailyAttendTotService dailyAttendTotService;
    private final AttendDocumentService attendDocumentService;

    /**
     * 강사: 출석코드 생성
     */
    @PostMapping("/code")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<SimpleResponse> createCode(
            @RequestBody CreateAttendCodeRequest req,
            HttpServletRequest http,
            Authentication auth
    ) {
        String requesterIp = ClientIpResolver.resolve(http);
        String raw = attendService.createCode(req, requesterIp, auth); // 평문 생성
        String code = attendService.peekActiveCode(auth).orElse(null); // 현재 활성 코드(표시용)

        return ResponseEntity.ok(
                SimpleResponse.builder()
                        .ok(true)
                        .message("코드 생성 완료 " + raw)
                        .data(Map.of("code", code))
                        .build()
        );
    }

    /**
     * 현재 활성 코드 조회(학생/강사 공용)
     */
    @GetMapping("/code")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','STUDENT')")
    public ResponseEntity<SimpleResponse> getActiveCode(Authentication auth) {
        String code = attendService.peekActiveCode(auth).orElse(null);
        return ResponseEntity.ok(
                SimpleResponse.builder()
                        .ok(true)
                        .message(null)
                        .data(Map.of("code", code))
                        .build()
        );
    }

    /**
     * 학생: 코드 제출 → 출석 처리
     */
    @PostMapping("/checkin")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CheckinResponse> checkin(
            @RequestBody SubmitAttendRequest req,
            HttpServletRequest http,
            Authentication auth
    ) {
        String clientIp = ClientIpResolver.resolve(http);
        CheckinResponse checkinResponse = attendService.checkin(req, clientIp, auth);
        return ResponseEntity.ok(checkinResponse);
    }

    /**
     * 학생: 퇴실 처리 (코드 불필요)
     */
    @PostMapping("/checkout")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CheckoutResponse> checkout(Authentication auth) {
        CheckoutResponse checkoutResponse = attendService.checkout(auth);
        return ResponseEntity.ok(checkoutResponse);
    }

    /**
     * 학생: 오늘 입/퇴실 시각 조회
     */
    @GetMapping("/status/today")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<AttendTodayResponse> getTodayStatus(Authentication auth) {
        AttendTodayResponse todayStatus = attendService.getTodayStatus(auth);
        return ResponseEntity.ok(todayStatus);
    }

    /**
     * 강사: 출석코드 강제 만료
     */
    @DeleteMapping("/code")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<SimpleResponse> invalidateCode(
            @AuthenticationPrincipal AuthCustomUserDetails me
    ) {
        attendService.invalidateCode(me.getCohortSn()); // ★ cohort 기준으로 통일
        return ResponseEntity.ok(
                SimpleResponse.builder()
                        .ok(true)
                        .message("코드 삭제 완료")
                        .build()
        );
    }

    /** 금일 학생들 출결 현황 조회 (강사용) */
    @GetMapping("/today/list")
    public ResponseEntity<SimpleResponse> getTodayStudentAttendance(Authentication auth) {
        List<StudentAttendanceDto> attendanceList = attendService.getTodayStudentAttendance(auth);
        return ResponseEntity.ok(
                SimpleResponse.builder()
                        .ok(true)
                        .message("오늘 출결 현황")
                        .data(attendanceList)
                        .build()
        );
    }

    /** 금일 학생들 출결 현황 조회 (관리자/테넌트용) */
    @GetMapping("/today/list/cohort/{cohortSn}")
    public ResponseEntity<SimpleResponse> getTodayStudentAttendanceByCohort(
            Authentication auth,
            @PathVariable Long cohortSn) {
        List<StudentAttendanceDto> attendanceList = attendService.getTodayStudentAttendanceByCohort(auth, cohortSn);
        return ResponseEntity.ok(
                SimpleResponse.builder()
                        .ok(true)
                        .message("오늘 출결 현황 - 특정 기수")
                        .data(attendanceList)
                        .build()
        );
    }

    /** 단위기간 별 출결 조회 (학생 마이페이지) */
    @GetMapping("/summary")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SimpleResponse> getMonthlySummary(
            @AuthenticationPrincipal AuthCustomUserDetails me
    ) {
        AttendSummaryDto dto = dailyAttendTotService.getMonthlySummary(me.getId());
        return ResponseEntity.ok(
                SimpleResponse.builder()
                        .ok(Boolean.TRUE)
                        .message("이번 달 출석 요약")
                        .data(dto)
                        .build()
        );
    }



    /** 기수별 결석 조회 (관리자용) */
    @GetMapping("/absence/by-cohort/today")
    public ResponseEntity<SimpleResponse> getTodayAbsenceByCohort(
            @AuthenticationPrincipal AuthCustomUserDetails me
    ) {
        List<CohortAbsenceRowDto> rows =
                dailyAttendTotService.getTodayAbsenceByCohortUsingAttendLogs(me.getCompanySn());
        return ResponseEntity.ok(
                SimpleResponse.builder()
                        .ok(Boolean.TRUE)
                        .message("오늘 교육 과정별 결석 현황")
                        .data(rows)
                        .build()
        );
    }

    /** 학생 출결인정 요청 생성 */
    @PostMapping("/adjust")
    @PreAuthorize("hasRole('STUDENT')")
    public SimpleResponse create(@Valid @RequestBody AttendAdjustCreateRequest req,
                                 Authentication authentication) {
        Long id = attendDocumentService.create(authentication, req);
        return SimpleResponse.builder()
                .ok(true)
                .message("created")
                .data(id)
                .build();
    }

    /** 학생 내 요청 내역(페이징) */
    @GetMapping("/adjust/my")
    @PreAuthorize("hasRole('STUDENT')")
    public SimpleResponse myList(
            Authentication authentication,
            @PageableDefault(size = 5, sort = "attendDcmntSn", direction = Sort.Direction.DESC)
            Pageable pageable) {

        AuthCustomUserDetails me = requirePrincipal(authentication);
        Page<AttendDocumentResponse> page = attendDocumentService.listMine(me.getId(), pageable);

        return SimpleResponse.builder()
                .ok(true)
                .message("ok")
                .data(page) // 프론트에서 data.content / data.totalPages 등으로 사용
                .build();
    }

    // --- helpers ---
    private AuthCustomUserDetails requirePrincipal(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()
                || !(auth.getPrincipal() instanceof AuthCustomUserDetails p)) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }
        return p;
    }

    /** 관리자: 출석 인정 요청 전체 조회 (회사 기준) */
    @GetMapping("/adjust/admin")
//    @PreAuthorize("hasAnyRole('EMPLOYEE','TENANT_ADMIN')")
    public SimpleResponse adminList(
            @AuthenticationPrincipal AuthCustomUserDetails me,
            @PageableDefault(size = 10, sort = "attendDcmntSn", direction = Sort.Direction.DESC)
            Pageable pageable) {

        Page<AttendDocumentAdminResponse> page =
                attendDocumentService.listAllByCohort(me.getCompanySn(), pageable);

        return SimpleResponse.builder()
                .ok(true)
                .message("ok")
                .data(page)
                .build();
    }

    /**
     * 관리자: 출석 인정 요청 전체 조회 (페이징)
     * 예) GET /api/attend/adjust/admin?page=0&size=5
     */
    @GetMapping("/admin")
//    @PreAuthorize("hasAnyRole('EMPLOYEE','TENANT_ADMIN')")
    public Page<AttendDocumentResponse> adminList(@PageableDefault(size = 5, sort = "attendDcmntSn", direction = Sort.Direction.DESC) Pageable pageable) {
        return attendDocumentService.findAllForAdmin(pageable);
    }

    @PutMapping("/adjust/{id}/status")
//    @PreAuthorize("hasAnyRole('INSTRUCTOR','EMPLOYEE','TENANT_ADMIN')")
    public SimpleResponse updateStatus(@PathVariable Long id,
                                       @RequestBody Map<String, String> body) {
        String status = body.get("status");
        attendDocumentService.updateStatus(id, status);

        return SimpleResponse.builder()
                .ok(true)
                .message("상태 변경 완료")
                .build();
    }

    /**
     * 관리자 출석인정 신규요청건수 조회
     * - 기수 상관없음
     * - PENDING 상태만
     */
    @GetMapping("/absence-requests/count")
    public AbsenceCountsRes getPendingAbsenceCount(
            @RequestHeader("X-Effective-Sn") Long effectiveSn
    ){
        long pendingCount = attendDocumentService.countRequestAbsence(effectiveSn);

        return AbsenceCountsRes.builder()
                .pendingCount(pendingCount)
                .build();
    }
}
