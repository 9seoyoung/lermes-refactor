package com.kdt.KDT_PJT.auth.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    // spring.mail.username 또는 별도 설정(app.mail.from)을 우선 사용
    @Value("${app.mail.from:${spring.mail.username}}")
    private String fromAddress;

    @Value("${app.mail.from-name:LERMES 인증}")
    private String fromName;

    public String sendVerificationCode(String toEmail) {
        String code = generate6Digits();
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper h = new MimeMessageHelper(mime, "UTF-8");
            h.setFrom(fromAddress, fromName);     // 하드코드 금지
            h.setTo(toEmail);
            h.setSubject("[LERMES] 인증코드");
            h.setText("""
                <div style="font-family:system-ui,Arial;line-height:1.6">
                  <h2>이메일 인증코드</h2>
                  <p>아래 코드를 가입 화면에 입력해 주세요.</p>
                  <div style="font-size:24px;font-weight:700;letter-spacing:2px">%s</div>
                  <p style="color:#777">유효 시간: 10분</p>
                </div>
            """.formatted(code), true);
            mailSender.send(mime);
        } catch (Exception e) {
            throw new IllegalStateException("인증 메일 발송 실패", e);
        }
        return code;
    }

    private String generate6Digits() {
        return String.format("%06d", ThreadLocalRandom.current().nextInt(0, 1_000_000));

        // 성능 때문에 ThreadLocalRandom 사용함
    }
}
