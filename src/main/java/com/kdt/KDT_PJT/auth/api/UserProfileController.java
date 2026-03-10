package com.kdt.KDT_PJT.auth.api;

import com.kdt.KDT_PJT.attend.dto.SimpleResponse;
import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.auth.dto.ApiResponse;
import com.kdt.KDT_PJT.auth.dto.mypage.PasswordChangeRequest;
import com.kdt.KDT_PJT.auth.dto.mypage.UpdateUserProfileRequest;
import com.kdt.KDT_PJT.auth.dto.mypage.UserProfileResponse;
import com.kdt.KDT_PJT.auth.service.PasswordService;
import com.kdt.KDT_PJT.auth.service.UserProfileService;
import com.kdt.KDT_PJT.file.dto.UploadResultDTO;
import com.kdt.KDT_PJT.file.service.FileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user-profile")
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final FileService fileService;
    private final PasswordService passwordService;

    @GetMapping
    public ResponseEntity<ApiResponse> getUserProfile(
            @AuthenticationPrincipal AuthCustomUserDetails me) {

        UserProfileResponse profile = userProfileService.getProfile(me);

        ApiResponse response = ApiResponse.builder()
                .ok(true)
                .message("유저 프로필 조회")
                .data(profile)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/info")
    public SimpleResponse updateInfo(
            @AuthenticationPrincipal AuthCustomUserDetails me,
            @RequestBody UpdateUserProfileRequest req
    ) {
        Long userSn = me.getId();

        userProfileService.updateInfo(userSn, req.getUserEmlAddr(), req.getUserTelno(), req.getUserProfileImage());

        return SimpleResponse.builder()
                .ok(true)
                .message("프로필 수정 완료")
                .data(Map.of(
                        "email", req.getUserEmlAddr() != null ? req.getUserEmlAddr() : "",
                        "phoneNumber", req.getUserTelno() != null ? req.getUserTelno() : "",
                        "fileSn", req.getUserProfileImage() != null ? req.getUserProfileImage() : 0L
                ))
                .build();
    }

    @PostMapping("/password/change")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal AuthCustomUserDetails principal,
            @Valid @RequestBody PasswordChangeRequest req) {

        if (principal == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("ok", false, "message", "로그인이 필요합니다."));
        }

        try {
            passwordService.changePassword(principal.getId(), req);
            return ResponseEntity.ok(Map.of("ok", true, "message", "비밀번호가 변경되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("ok", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("ok", false, "message", "서버 오류가 발생했습니다."));
        }
    }
}
