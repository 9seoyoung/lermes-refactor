package com.kdt.KDT_PJT.auth.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse {
    private boolean ok;
    private String message;
    private Object data; // 시간일때 코드 유효 시간(초), url일때 url 경로
}
