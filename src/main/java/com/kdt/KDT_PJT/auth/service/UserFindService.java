package com.kdt.KDT_PJT.auth.service;

import com.kdt.KDT_PJT.auth.dto.FindIdRequest;
import com.kdt.KDT_PJT.auth.dto.FindIdResponse;
import com.kdt.KDT_PJT.auth.entity.User; // 네 엔티티명에 맞게 수정
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserFindService {

    private final UserRepository userRepository;

    public FindIdResponse findId(FindIdRequest request) {
        Optional<User> userOpt = userRepository.findByNameAndUserTelno(
                request.getName(),
                request.getPhoneNumber()
        );

        if (userOpt.isEmpty()) {
            return new FindIdResponse(false, "일치하는 사용자가 없습니다.", null);
        }

        String maskedEmail = maskEmail(userOpt.get().getEmail());
        return new FindIdResponse(true, "아이디(이메일) 찾기 성공", maskedEmail);
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return email;
        String[] parts = email.split("@");
        String local = parts[0];
        String domain = parts[1];

        if (local.length() <= 1) {
            return local + "@" + domain;
        } else if (local.length() == 2) {
            return local.charAt(0) + "*" + "@" + domain;
        } else {
            return local.substring(0, 2)
                    + "*".repeat(local.length() - 2)
                    + "@" + domain;
        }
    }
}
