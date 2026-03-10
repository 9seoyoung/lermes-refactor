package com.kdt.KDT_PJT.response.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.response.dto.SrvyResponseDetailDto;
import com.kdt.KDT_PJT.response.mapper.SrvyResponseDetailMapper;
import com.kdt.KDT_PJT.response.service.SrvyResponseDetailService;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.LifecycleState;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/surveys")
@RequiredArgsConstructor
public class SrvyResponseDetailController {

    private final SrvyResponseDetailService detailService;

    //단건조회 - 본잉응답만 조회
    @GetMapping("/{srvySn}/detail")
    public ResponseEntity<SrvyResponseDetailDto> getSurveyDetail(
            @PathVariable Long srvySn,
            @AuthenticationPrincipal AuthCustomUserDetails auth) {

        Long userSn = auth.getId();
        SrvyResponseDetailDto detail = detailService.getSurveyDetail(srvySn, userSn);
        return ResponseEntity.ok(detail);
    }

    //작성자용 전체 응답 조회
    @GetMapping("/{srvySn}/responses/all")
    public ResponseEntity<List<SrvyResponseDetailDto>> getAllResponses(
            @PathVariable Long srvySn,
            @AuthenticationPrincipal AuthCustomUserDetails auth) {

        Long requesterSn = auth.getId();
        Long roleId = auth.getRoleType();
        Long requesterCohortSn = auth.getCohortSn();

        List<SrvyResponseDetailDto> responses =
                detailService.getAllResponses(srvySn, requesterSn, roleId, requesterCohortSn);
        return ResponseEntity.ok(responses);
    }
}