package com.kdt.KDT_PJT.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

// 코드 발송 요청 (회원가입 때 쓰던 EmailCodeRequest 재사용 가능)

// 비밀번호 재설정 요청
@Getter
@Setter
public class PasswordResetConfirmRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String verificationCode;

    @NotBlank
    private String password;

    @NotBlank
    private String confirmPassword;
}
