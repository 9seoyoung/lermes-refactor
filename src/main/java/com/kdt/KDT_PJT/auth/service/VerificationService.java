package com.kdt.KDT_PJT.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VerificationService {

    private static final int TTL_SECONDS = 600;
    private final Map<String, StoredCode> store = new ConcurrentHashMap<>();

    private String key(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    public void saveCode(String email, String code) {
        long expiresAt = Instant.now().plusSeconds(TTL_SECONDS).toEpochMilli();
        store.put(key(email), new StoredCode(code, expiresAt));
    }

    public boolean verify(String email, String code) {
        StoredCode sc = store.get(key(email));
        if (sc == null) return false;
        if (Instant.now().toEpochMilli() > sc.expiresAt) { store.remove(key(email)); return false; }
        boolean ok = sc.code.equals(code);
        if (ok) store.remove(key(email));
        return ok;
    }
    public int ttlSeconds() { return TTL_SECONDS; }

    private record StoredCode(String code, long expiresAt) {}
}

