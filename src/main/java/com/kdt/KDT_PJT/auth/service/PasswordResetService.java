package com.kdt.KDT_PJT.auth.service;

import com.kdt.KDT_PJT.auth.dto.ApiResponse;
import com.kdt.KDT_PJT.auth.dto.PasswordResetConfirmRequest;
import com.kdt.KDT_PJT.auth.dto.EmailCodeRequest;
import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PasswordResetService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final VerificationService verificationService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    // 1) 비밀번호 재설정 코드 발송
    public ApiResponse sendResetCode(EmailCodeRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return new ApiResponse(false, "가입되지 않은 이메일입니다.", null);
        }

        String code = emailService.sendVerificationCode(email);
        verificationService.saveCode(email, code);

        return new ApiResponse(true, "비밀번호 재설정용 인증코드를 발송했습니다.", verificationService.ttlSeconds());
    }

    // 2) 새 비밀번호 설정
    @Transactional
    public ApiResponse resetPassword(PasswordResetConfirmRequest req) {
        String email = req.getEmail().trim().toLowerCase();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return new ApiResponse(false, "가입되지 않은 이메일입니다.", null);
        }

        if (!req.getPassword().equals(req.getConfirmPassword())) {
            return new ApiResponse(false, "비밀번호가 일치하지 않습니다.", null);
        }

        if (!verificationService.verify(email,
                req.getVerificationCode() == null ? "" : req.getVerificationCode().trim())) {
            return new ApiResponse(false, "인증코드가 올바르지 않거나 만료되었습니다.", null);
        }

        User user = userOpt.get();
        user.setPassword(bCryptPasswordEncoder.encode(req.getPassword()));
        userRepository.save(user);

        return new ApiResponse(true, "비밀번호 재설정이 완료되었습니다.", null);
    }
}
