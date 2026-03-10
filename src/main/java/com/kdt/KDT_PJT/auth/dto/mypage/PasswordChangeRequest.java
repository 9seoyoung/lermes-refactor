package com.kdt.KDT_PJT.auth.dto.mypage;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordChangeRequest {
    @NotBlank(message = "기존 비밀번호를 입력해주세요.")
    private String oldPassword;

    @NotBlank(message = "새 비밀번호를 입력해주세요.")
    private String newPassword;

    @NotBlank(message = "새 비밀번호 확인을 입력해주세요.")
    private String confirmPassword;
}