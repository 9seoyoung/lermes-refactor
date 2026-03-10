package com.kdt.KDT_PJT.attend.support;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/** 출석코드 메모리 저장소 (서버 재시작 시 초기화됨) */
@Component
public class CodeStore {

    public record CodeData(String hashedCode, String allowedIp, Instant expiresAt, String displayCode) {}

    private final Map<String, CodeData> map = new ConcurrentHashMap<>();

    /** ttlMinutes 분 동안 유효 */
    public void put(String key, String hashedCode, String allowedIp, int ttlMinutes, String displayCode) {
        Instant exp = Instant.now().plusSeconds(ttlMinutes * 60L);
        map.put(key, new CodeData(hashedCode, allowedIp, exp, displayCode));
    }

    /** 만료 확인 후 반환 */
    public Optional<CodeData> get(String key) {
        CodeData d = map.get(key);
        if (d == null) return Optional.empty();
        if (Instant.now().isAfter(d.expiresAt())) {
            map.remove(key);
            return Optional.empty();
        }
        return Optional.of(d);
    }

    public void clear(String key) {
        map.remove(key);
    }
}
