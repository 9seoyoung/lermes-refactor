package com.kdt.KDT_PJT.attend.support;

import jakarta.servlet.http.HttpServletRequest;

public final class ClientIpResolver {
    private ClientIpResolver(){}

    public static String resolve(HttpServletRequest req) {
        String h = req.getHeader("X-Forwarded-For");
        if (h != null && !h.isBlank()) {
            // 첫 번째가 원래 클라이언트 IP
            return h.split(",")[0].trim();
        }
        h = req.getHeader("X-Real-IP");
        if (h != null && !h.isBlank()) return h.trim();
        return req.getRemoteAddr();
    }
}
