package com.kdt.KDT_PJT.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FindIdRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String phoneNumber;
}

