package com.kdt.KDT_PJT.attend.api;

import com.kdt.KDT_PJT.attend.dto.SimpleResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Attend 전용 예외 핸들러
 * - 이 Advice는 AttendController에만 적용됨
 */
@RestControllerAdvice(assignableTypes = AttendController.class)
public class AttendExceptionHandler {

    /** 잘못된 요청(입력값 등) → 400 */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<SimpleResponse> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(
                SimpleResponse.builder()
                        .ok(false)
                        .message(e.getMessage())
                        .build()
        );
    }

    /** 상태 위반(중복 출석/퇴실, 코드 없음 등) → 409 (로그인 필요는 401로 변경) */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<SimpleResponse> handleIllegalState(IllegalStateException e) {
        HttpStatus status = "로그인 필요".equals(e.getMessage())
                ? HttpStatus.UNAUTHORIZED   // 401
                : HttpStatus.CONFLICT;      // 409
        return ResponseEntity.status(status).body(
                SimpleResponse.builder()
                        .ok(false)
                        .message(e.getMessage())
                        .build()
        );
    }

    /** 기타 예외 → 500 */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<SimpleResponse> handleEtc(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                SimpleResponse.builder()
                        .ok(false)
                        .message("서버 오류가 발생했습니다: " + e.getMessage())
                        .build()
        );
    }
//
//    @RestControllerAdvice
//    public class GlobalAdvice {
//        @ExceptionHandler(IllegalArgumentException.class)
//        ResponseEntity<?> bad(IllegalArgumentException e){
//            return ResponseEntity.badRequest().body(Map.of("ok", false, "message", e.getMessage()));
//        }
//    }
}
