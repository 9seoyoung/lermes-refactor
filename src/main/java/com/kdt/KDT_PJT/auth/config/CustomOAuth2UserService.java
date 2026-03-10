package com.kdt.KDT_PJT.auth.config;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest)
            throws OAuth2AuthenticationException {

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = null;
        String name = null;

        switch (registrationId.toLowerCase()) {
            case "google" -> {
                email = "google_" + (String) attributes.get("email");
                name = (String) attributes.get("name");
            }

            case "kakao" -> {
                Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
                Map<String, Object> kakaoProfile =
                        kakaoAccount != null ? (Map<String, Object>) kakaoAccount.get("profile") : null;

                // 닉네임만 가져오고 이메일은 가짜 생성
                Long kakaoId = ((Number) attributes.get("id")).longValue();
                email = "kakao_" + kakaoId + "@temp.local";
                name = kakaoProfile != null && kakaoProfile.get("nickname") != null
                        ? (String) kakaoProfile.get("nickname")
                        : "KakaoUser";
            }

            case "naver" -> {
                Map<String, Object> response = (Map<String, Object>) attributes.get("response");

                email = "naver_" + response.get("email");
                name = (String) response.get("name");
            }

            default -> throw new IllegalArgumentException("지원하지 않는 OAuth2 플랫폼: " + registrationId);
        }

        // 사용자 조회 및 자동 회원가입
        String finalEmail = email;
        String finalName = name;

        User user = userRepository.findByEmail(finalEmail)
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .email(finalEmail)
                                .name(finalName)
                                .password(registrationId.toUpperCase() + "_LOGIN") // dummy
                                .enabled(true)
                                .roleType(6L)
                                .build()
                ));

        return new AuthCustomUserDetails(user);
    }
}
