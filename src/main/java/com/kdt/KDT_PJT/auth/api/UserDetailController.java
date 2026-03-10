package com.kdt.KDT_PJT.auth.api;

import com.kdt.KDT_PJT.auth.dto.ApiResponse;
import com.kdt.KDT_PJT.auth.dto.mypage.UserDetailRequest;
import com.kdt.KDT_PJT.auth.entity.UserDetail;
import com.kdt.KDT_PJT.auth.service.UserDetailService;
import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user-detail")
public class UserDetailController {

    private final UserDetailService userDetailService;

    /**
     * 내 상세 정보 등록 및 수정
     */
    @PostMapping("/save")
    public ResponseEntity<ApiResponse> save(
            @AuthenticationPrincipal AuthCustomUserDetails me,
            @Valid @RequestBody UserDetailRequest req
    ) {
        UserDetail detail = userDetailService.upsert(me.getId(), req);
        return ResponseEntity.ok(
                new ApiResponse(true, "저장 성공", detail)
        );
    }

    /**
     * 내 상세 정보 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse> getMyDetail(
            @AuthenticationPrincipal AuthCustomUserDetails me
    ) {
        UserDetail detail = userDetailService.getByUserSn(me.getId());
        if (detail == null) {
            return ResponseEntity.ok(
                    new ApiResponse(false, "상세 정보 없음", null)
            );
        }
        return ResponseEntity.ok(
                new ApiResponse(true, "상세 정보 조회 성공", detail)
        );
    }
}
