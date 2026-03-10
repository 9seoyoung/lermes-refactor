package com.kdt.KDT_PJT.auth.service;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.auth.dto.mypage.UserProfileResponse;
import com.kdt.KDT_PJT.auth.entity.Company;
import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.auth.repository.CompanyRepository;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import com.kdt.KDT_PJT.cohort.repository.CohortRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final CohortRepository cohortRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;

    public UserProfileResponse getProfile(AuthCustomUserDetails me) {
        User user = userRepository.findById(me.getId())
                .orElseThrow(() -> new IllegalArgumentException("유저 없음 UserProfileService 파일임"));

        Cohort cohort = null;
        if (me.getCohortSn() != null) {
            cohort = cohortRepository.findById(me.getCohortSn())
                    .orElseThrow(() -> new IllegalArgumentException("기수 없음 UserProfileService 파일임"));
        }

        // Company (거의 필수)
        Company company = null;
        if (me.getCompanySn() != null) {
            company = companyRepository.findById(me.getCompanySn())
                    .orElseThrow(() -> new IllegalArgumentException("회사 없음 UserProfileService 파일임"));
        }

        String status = user.isEnabled() ? "활성" : "비활성";

        return UserProfileResponse.builder()
                .name(user.getName())
                .status(status)
                .phoneNumber(user.getUserTelno())
                .email(user.getEmail())
                .cohortName(cohort != null ? cohort.getCohortNm() : "-")   // cohort 없으면 "-"
                .courseName(cohort != null ? cohort.getCrclmNm() : "-")    // courseName도 "-"
                .companyName(company != null ? company.getName() : "-")
                .brNo(company != null ? company.getBrno() : "-")
                .userProfileImage(user.getUserProfileImage())
                .build();
    }


    @Transactional
    public void updateInfo(Long userSn, String email, String phoneNumber, Long fileSn) {
        User user = userRepository.findById(userSn)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        if (email != null) user.setEmail(email);
        if (phoneNumber != null) user.setUserTelno(phoneNumber);
        user.setUserProfileImage(fileSn); // null이면 DB에서 컬럼 null로 업데이트

        userRepository.save(user);

        Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();
        if (currentAuth != null) {
            AuthCustomUserDetails newPrincipal = new AuthCustomUserDetails(user);

            Authentication newAuth = new UsernamePasswordAuthenticationToken(
                    newPrincipal,
                    currentAuth.getCredentials(),
                    newPrincipal.getAuthorities()
            );

            SecurityContextHolder.getContext().setAuthentication(newAuth);
        }
    }
}
