package com.kdt.KDT_PJT.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailCodeRequest {
    @Email @NotBlank
    private String email;
}
