package com.kdt.KDT_PJT.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FindIdResponse {
    private boolean ok;
    private String message;
    private String email; // 마스킹된 이메일
}