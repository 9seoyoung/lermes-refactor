package com.kdt.KDT_PJT.response.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.response.dto.SrvyRequestResponseDto;
import com.kdt.KDT_PJT.response.dto.SrvyResponseResponseDto;
import com.kdt.KDT_PJT.response.service.SrvyResponseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/surveys")
@RequiredArgsConstructor
public class SrvyResponseController {

    //등록, 수정, 삭제 리스트 조회까지만 있음 단건조회는 따로 만들었음 
    private final SrvyResponseService srvyResponseService;

    //등록 및 수정
    @PostMapping("/{srvySn}/responses")
    public ResponseEntity<SrvyResponseResponseDto> createSrvyResponse(
            @PathVariable Long srvySn,
            @RequestBody SrvyRequestResponseDto requestDto,
            @AuthenticationPrincipal AuthCustomUserDetails auth)
            {

        Long userSn = auth.getId();
        Long roleId = auth.getRoleType();
        Long coSn = auth.getCompanySn();
        Long cohortSn = auth.getCohortSn();

        // 요청 DTO 보정
        requestDto.setUserSn(userSn);
        requestDto.setParentSn(srvySn);

        // 서비스 호출 (권한/소속 검증 포함)
        SrvyResponseResponseDto saved =
                srvyResponseService.createResponse(requestDto, roleId, coSn, cohortSn); // 👈 수정됨

        return ResponseEntity.ok(saved);
    }

    /**
     * ✅ 설문 응답 리스트 조회
     * - 관리자: 전체 유저 응답
     * - 수강생: 본인 응답만
     */
    @GetMapping("/{srvySn}/list")
    public ResponseEntity<List<SrvyResponseResponseDto>> getSrvyResponses(
            @PathVariable Long srvySn,
            @AuthenticationPrincipal AuthCustomUserDetails auth) {

        Long userSn = auth.getId();
        Long roleId = auth.getRoleType();

        List<SrvyResponseResponseDto> responses =
                srvyResponseService.getResponses(srvySn, roleId, userSn);

        return ResponseEntity.ok(responses);
    }

    /**
     * ✅ 응답 삭제 (Soft Delete)
     * - 설문 마감 전까지만 삭제 가능
     * - 관리자 및 본인만 가능
     */
    @DeleteMapping("/responses/{responseSn}")
    public ResponseEntity<Void> deleteSrvyResponse(
            @PathVariable Long responseSn,
            @AuthenticationPrincipal AuthCustomUserDetails auth) {

        Long userSn = auth.getId();
        Long roleId = auth.getRoleType();

        srvyResponseService.deleteResponse(responseSn, userSn, roleId);
        return ResponseEntity.noContent().build();
    }
}
