package com.kdt.KDT_PJT.attend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/** 강사가 입력하는 평문 코드 + 옵션 TTL, 허용IP */
@Getter @Setter
public class CreateAttendCodeRequest {
    @NotBlank
    private String code;        // 반드시 입력(예: 2자리)
    private String allowedIp;   // 미입력 시 요청자의 공인IP 사용, 공인IP 못쓰겠으면 @NotBlank 추가
}
