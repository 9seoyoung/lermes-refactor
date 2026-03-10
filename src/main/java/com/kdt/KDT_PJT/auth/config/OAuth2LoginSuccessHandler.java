package com.kdt.KDT_PJT.auth.config;

import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = (String) oAuth2User.getAttributes().get("email");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + email));

        // SecurityContext 생성 및 저장
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);

        HttpSession session = request.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
        session.setAttribute("USER_SN", user.getId());

        // 추가: SecurityContextRepository에도 저장
        new HttpSessionSecurityContextRepository().saveContext(context, request, response);

        System.out.println("OAuth2 로그인 성공: " + email);
        System.out.println("   세션 ID: " + session.getId());

        // 쿠키 재설정
        String sessionId = session.getId();
        response.setHeader("Set-Cookie",
                "JSESSIONID=" + sessionId + "; Path=/; HttpOnly; SameSite=None; Secure=false");

        // redirect
        response.setStatus(HttpServletResponse.SC_OK);
        response.sendRedirect("http://localhost:3000/welcome/oauth2-redirect");
    }
}
