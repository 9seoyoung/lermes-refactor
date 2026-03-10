package com.kdt.KDT_PJT.auth.api;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.auth.dto.*;
import com.kdt.KDT_PJT.auth.service.LandingService;
import com.kdt.KDT_PJT.auth.service.PasswordResetService;
import com.kdt.KDT_PJT.auth.service.SignupService;
import com.kdt.KDT_PJT.auth.service.UserFindService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final LandingService landingService;
    private final SignupService signupService;
    private final AuthenticationManager authenticationManager;
    private final UserFindService userFindService;
    private final PasswordResetService passwordResetService;

    // 인증코드 발송
    @PostMapping("/email/code")
    public ResponseEntity<ApiResponse> emailCode(@RequestBody  EmailCodeRequest req) {
        ApiResponse res = signupService.sendCodeIfEmailAvailable(req);
        return new ResponseEntity<>(res, res.isOk() ? HttpStatus.OK : HttpStatus.CONFLICT);
    }

    // 일반 회원가입
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> signupGeneral(@RequestBody GeneralSignupDto dto) {
        ApiResponse res = signupService.registerGeneral(dto);
        return new ResponseEntity<>(res, res.isOk() ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    // 테넌트 회원가입
    @PostMapping("/signup/tenant")
    public ResponseEntity<ApiResponse> signupTenant(@RequestBody TenantSignupDto dto) {
        ApiResponse res = signupService.registerTenant(dto);
        return new ResponseEntity<>(res, res.isOk() ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }



    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequestDto dto,
                                             HttpServletRequest request,
                                             HttpServletResponse response) {
        String email = dto.getEmail() == null ? "" : dto.getEmail().trim().toLowerCase();
        String password = dto.getPassword() == null ? "" : dto.getPassword();

        if (email.isBlank() || password.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "이메일/비밀번호를 입력하세요.", null));
        }

        try {
            UsernamePasswordAuthenticationToken token =
                    new UsernamePasswordAuthenticationToken(email, password);

            Authentication auth = authenticationManager.authenticate(token); // 비번 검증

            // 🔹 SecurityContext 생성/설정
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            SecurityContextHolder.setContext(context);

            // 🔹 세션에 SecurityContext 저장 (아주 중요)
            SecurityContextRepository repo = new HttpSessionSecurityContextRepository();
            repo.saveContext(context, request, response);

            // (선택) 세션 강제 생성
            request.getSession(true);

            AuthCustomUserDetails me = (AuthCustomUserDetails) auth.getPrincipal();

            return ResponseEntity.ok(new ApiResponse(true, "로그인 성공", null));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "아이디 또는 비밀번호가 올바르지 않습니다.", null));
        }
    }


    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal AuthCustomUserDetails me) {
        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("ok", false, "message", "로그인 필요"));
        }
        String nextPath = landingService.buildNextPath(me);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("USER_SN", me.getId());               // null 허용
        data.put("USER_NM", me.getName());
        data.put("USER_EML_ADDR", me.getEmail());
        data.put("USER_ACTVTN_YN", me.isEnabled());
        data.put("USER_AUTHRT_SN", me.getRoleType());
        data.put("USER_TELNO", me.getUserTelno());     // null이어도 OK
        data.put("USER_OGDP_CO_SN", me.getCompanySn());// null이어도 OK
        data.put("USER_COHORT_SN", me.getCohortSn());  // null이어도 OK
        data.put("HOME_PATH", nextPath);
        data.put("USER_PROFILE_IMAGE", me.getUserProfileImage()); // null이어도 OK

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(Map.of("ok", true, "data", data));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response, HttpSession session) {
    session.invalidate(); // 세션 만료

    // JSESSIONID 쿠키 만료시키기
    ResponseCookie cookie = ResponseCookie.from("JSESSIONID", "")
            .path("/")
            .maxAge(0)       // 즉시 만료
            .httpOnly(true)
            .build();
    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

    return ResponseEntity.ok(Map.of("ok", true, "message", "로그아웃 성공"));
    }

    @PostMapping("/find-id")
    public ResponseEntity<FindIdResponse> findId(@Valid @RequestBody FindIdRequest request) {
        FindIdResponse res = userFindService.findId(request);
        return ResponseEntity.ok(res);
    }

    // 새 비밀번호 인증용 이메일 코드 발송
    @PostMapping("/new-password/code")
    public ApiResponse sendCode(@Valid @RequestBody EmailCodeRequest req) {
        return passwordResetService.sendResetCode(req);
    }

    // 비밀번호 재설정
    @PostMapping("/new-password/confirm")
    public ApiResponse confirm(@Valid @RequestBody PasswordResetConfirmRequest req) {
        return passwordResetService.resetPassword(req);
    }
}
