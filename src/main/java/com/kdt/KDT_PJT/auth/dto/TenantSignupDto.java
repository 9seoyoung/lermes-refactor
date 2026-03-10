package com.kdt.KDT_PJT.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TenantSignupDto {

    @NotBlank(message = "회사명은 필수 입력값입니다.")
    private String companyName;

    @NotBlank(message = "사업자등록번호는 필수 입력값입니다.")
    private String businessNumber;

    @NotBlank(message = "이름은 필수 입력값입니다.")
    private String username;

    @NotBlank(message = "이메일은 필수 입력값입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;

    @NotBlank(message = "인증코드는 필수 입력값입니다.")
    private String verificationCode;

    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    private String password;

    @NotBlank(message = "비밀번호 확인은 필수 입력값입니다.")
    private String confirmPassword;

    @NotBlank(message = "전화번호는 필수 입력값입니다.")
    private String phoneNumber;
}
