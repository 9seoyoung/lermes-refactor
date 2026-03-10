package com.kdt.KDT_PJT.auth.service;

import com.kdt.KDT_PJT.auth.dto.ApiResponse;
import com.kdt.KDT_PJT.auth.dto.EmailCodeRequest;
import com.kdt.KDT_PJT.auth.dto.GeneralSignupDto;
import com.kdt.KDT_PJT.auth.dto.TenantSignupDto;
import com.kdt.KDT_PJT.auth.entity.Company;
import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.auth.repository.CompanyRepository;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SignupService {
    private final CompanyRepository companyRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final VerificationService verificationService;

    // 0) 인증 버튼: (1) 중복 체크 → (2) 미존재 시 코드 발송
    public ApiResponse sendCodeIfEmailAvailable(EmailCodeRequest req) {
        String email = req.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            return new ApiResponse(false, "이미 가입된 이메일입니다.", null);
        }

        String code = emailService.sendVerificationCode(email);
        verificationService.saveCode(email, code);
        return new ApiResponse(true, "인증코드를 발송했습니다.", verificationService.ttlSeconds());
    }

    // 1) 일반 회원가입
    @Transactional
    public ApiResponse registerGeneral(GeneralSignupDto dto) {
        String email = dto.getEmail().trim().toLowerCase();

        // 1) 이메일 중복
        if (userRepository.existsByEmail(email)) {
            return new ApiResponse(false, "이미 가입된 이메일입니다.", null);
        }
        // 2) 비밀번호 확인
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            return new ApiResponse(false, "비밀번호가 일치하지 않습니다.", null);
        }
        // 3) 인증코드 검증
        if (!verificationService.verify(email,
                dto.getVerificationCode() == null ? "" : dto.getVerificationCode().trim())) {
            return new ApiResponse(false, "이메일 인증 실패", null);
        }

        User user = User.builder()
                .name(dto.getUsername())
                .email(email)
                .password(bCryptPasswordEncoder.encode(dto.getPassword()))
                .enabled(true)
                .roleType(6L)    // 일반 회원
                .userTelno(dto.getPhoneNumber())
                .companySn(null)
                .cohortSn(null)
                .build();

        userRepository.save(user);
        return new ApiResponse(true, "회원가입 완료", null);
    }

    // 2) 테넌트 회원가입
    @Transactional
    public ApiResponse registerTenant(TenantSignupDto dto) {
        final String email = dto.getEmail().trim().toLowerCase();
        final String brno  = dto.getBusinessNumber().trim();

        // 1) 중복체크
        if (userRepository.existsByEmail(email)) {
            return new ApiResponse(false, "이미 가입된 이메일입니다.", null);
        }
        if (companyRepository.existsByBrno(brno)) {
            return new ApiResponse(false, "이미 등록된 사업자등록번호입니다.", null);
        }

        // 2) 비밀번호 확인 (먼저 수행: 코드 소모 방지)
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            return new ApiResponse(false, "비밀번호가 일치하지 않습니다.", null);
        }

        // 3) 이메일 인증 확인 (true면 1회성 코드 소모)
        if (!verificationService.verify(email,
                dto.getVerificationCode() == null ? "" : dto.getVerificationCode().trim())) {
            return new ApiResponse(false, "이메일 인증 실패", null);
        }

        // 4) 회사 생성
        Company company = companyRepository.save(
                Company.builder()
                        .brno(brno)
                        .name(dto.getCompanyName())
                        .active(true)
                        .build()
        );

        // 5) 관리자 유저 생성 (회사 FK 연결)
        User admin = User.builder()
                .name(dto.getUsername())
                .email(email)
                .password(bCryptPasswordEncoder.encode(dto.getPassword()))
                .enabled(true)
                .roleType(2L) // 테넌트 관리자
                .userTelno(dto.getPhoneNumber())
                .companySn(company.getId()) // FK: TB_USER.OGDP_CO_SN
                .cohortSn(null)
                .build();

        userRepository.save(admin);

        return new ApiResponse(true, "테넌트 관리자 등록 완료", null);
    }
}
