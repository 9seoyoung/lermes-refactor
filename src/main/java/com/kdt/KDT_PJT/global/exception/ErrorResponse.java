package com.kdt.KDT_PJT.global.exception;

import lombok.Builder;
import lombok.Getter;

/**
 * 예외 응답 DTO
 */
@Getter
@Builder
public class ErrorResponse {
    private final boolean ok;
    private final int status;
    private final String message;
}
