package com.kdt.KDT_PJT.global.exception;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class LmsException extends RuntimeException {
    private final HttpStatus status;
    private final ExceptionType type;

    public enum ExceptionType {
        AUTHORIZATION, // 권한
        GENERAL        // 일반
    }

    public LmsException(String message, HttpStatus status, ExceptionType type) {
        super(message);
        this.status = status;
        this.type = type;
    }

    public static LmsException auth(String message) {
        return new LmsException(message, HttpStatus.FORBIDDEN, ExceptionType.AUTHORIZATION);
    }

    public static LmsException general(String message) {
        return new LmsException(message, HttpStatus.BAD_REQUEST, ExceptionType.GENERAL);
    }

}