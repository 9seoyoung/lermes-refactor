package com.kdt.KDT_PJT.auth.service;

import com.kdt.KDT_PJT.auth.dto.mypage.PasswordChangeRequest;
import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void changePassword(Long userSn, PasswordChangeRequest req) {
        User user = userRepository.findById(userSn)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 기존 비밀번호 확인
        if (!passwordEncoder.matches(req.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("기존 비밀번호가 일치하지 않습니다.");
        }

        // 새 비밀번호 일치 확인
        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            throw new IllegalArgumentException("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
        }

        if (passwordEncoder.matches(req.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("기존 비밀번호와 동일한 비밀번호로 변경할 수 없습니다.");
        }

        // 새 비번이 기존 비번과 동일한 경우 방지
        String encoded = passwordEncoder.encode(req.getNewPassword());
        user.setPassword(encoded);
        userRepository.save(user);
    }
}