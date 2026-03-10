package com.kdt.KDT_PJT.global.exception;

import com.kdt.KDT_PJT.cerfifi.exception.CertifiDuplicateException;
import jakarta.servlet.http.HttpServletRequest;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.nio.file.AccessDeniedException;

/**
 * 전역 예외 핸들러 (REST API 전용)
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** 예상하지 못한 예외 → 500 */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        ex.printStackTrace(); // 로그 출력
        return buildResponse("서버 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /** 커스텀 LMS 예외 */
    @ExceptionHandler(LmsException.class)
    public ResponseEntity<ErrorResponse> handleLmsException(LmsException ex) {
        HttpStatus status = ex.getType() == LmsException.ExceptionType.AUTHORIZATION
                ? HttpStatus.FORBIDDEN // 권한 없음
                : HttpStatus.BAD_REQUEST; // 일반 예외

        return buildResponse(ex.getMessage(), status);
    }

    /** 잘못된 파라미터 타입 → 400 */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String message = String.format("'%s' 값이 올바르지 않습니다.", ex.getName());
        return buildResponse(message, HttpStatus.BAD_REQUEST);
    }

    /** 유효성 제약 위반 → 400 */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex) {
        return buildResponse("입력값이 유효하지 않습니다.", HttpStatus.BAD_REQUEST);
    }

    /** 지원하지 않는 HTTP 메서드 → 405 */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        return buildResponse("지원하지 않는 요청 방식입니다.", HttpStatus.METHOD_NOT_ALLOWED);
    }

    /** 접근 거부 → 403 */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        return buildResponse("접근이 거부되었습니다.", HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        ex.printStackTrace();
        // 백에서 만든 의미 있는 메시지를 그대로 내려보내자
        String msg = (ex.getMessage() != null && !ex.getMessage().isBlank())
                ? ex.getMessage()
                : "요청 처리 중 오류가 발생했습니다.";
        return buildResponse(msg, HttpStatus.BAD_REQUEST);
    }


    /** 증명서 서식 중복 등록 예외 (DB Duplicate Key) → 409 Conflict */
    @ExceptionHandler(CertifiDuplicateException.class)
    public ResponseEntity<ErrorResponse> handleCertifiDuplicateException(CertifiDuplicateException ex) {
        // 409 Conflict는 자원의 현재 상태와 충돌하여 요청을 처리할 수 없을 때 사용됩니다.
        return buildResponse(ex.getMessage(), HttpStatus.CONFLICT);
    }



    /** 공통 응답 생성 */
    private ResponseEntity<ErrorResponse> buildResponse(String message, HttpStatus status) {
        return ResponseEntity.status(status).body(
                ErrorResponse.builder()
                        .ok(false)
                        .status(status.value())
                        .message(message)
                        .build()
        );
    }

}
