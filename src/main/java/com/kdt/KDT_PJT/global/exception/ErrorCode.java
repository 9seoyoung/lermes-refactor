package com.kdt.KDT_PJT.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    USER_NOT_FOUND("존재하지 않는 사용자입니다.", HttpStatus.NOT_FOUND),
    INVALID_INPUT("입력값이 유효하지 않습니다.", HttpStatus.BAD_REQUEST);

    private final String message;
    private final HttpStatus status;

    ErrorCode(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
    }

}
