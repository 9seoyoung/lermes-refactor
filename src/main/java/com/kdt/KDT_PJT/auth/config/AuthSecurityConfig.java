package com.kdt.KDT_PJT.auth.config;

import com.kdt.KDT_PJT.auth.service.AuthCustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.config.Customizer; // 서영 추가


import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class AuthSecurityConfig {

    private final AuthCustomUserDetailsService customUserDetailsService;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final CustomOAuth2UserService customOAuth2UserService;


    // DaoAuthenticationProvider (지금은 anyRequest().permitAll() 이라 실사용 X, 그래도 보관)
    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider p = new DaoAuthenticationProvider();
        p.setUserDetailsService(customUserDetailsService);
        p.setPasswordEncoder(passwordEncoder());
        return p;
    }

    // 비밀번호 인코더
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // AuthenticationManager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
//
    //서영 주석 품
   @Bean
   public CorsConfigurationSource corsConfigurationSource() {
       CorsConfiguration c = new CorsConfiguration();

       // 오리진은 "프로토콜+호스트+포트"까지만 (슬래시 금지)
       c.setAllowedOrigins(List.of(
               "http://localhost:3000",
               "http://127.0.0.1:3000",
               "http://192.168.0.14:3000",
               "http://onopco2.iptime.org:3000"
       ));
       c.setAllowCredentials(true);
       c.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
//       이거 헤더 "X-Effective-Sn", "Content-Type", "Authorization" 일단 사용
       c.setAllowedHeaders(List.of("*"));
       c.setExposedHeaders(List.of("Set-Cookie"));

       UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();
       s.registerCorsConfiguration("/**", c);
       return s;
   }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults()) //서영 추가함
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/api/login") // 기존 로그인 엔드포인트 유지
                        .userInfoEndpoint(user -> user.userService(customOAuth2UserService))
                        .successHandler(oAuth2LoginSuccessHandler)
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .logoutSuccessUrl("http://localhost:3000/welcome/login")
                        // .logoutSuccessUrl("http://onopco2.iptime.org:3000/welcome/login") //외부 배포용
                )
                .httpBasic(basic -> basic.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
//                                "/api/login",
//                                "/api/signup/**",
//                                "/api/email/code/**",
//                                "/api/find-id",
//                                "/api/new-password/**",
//                                "/api/user-detail/**"
                                "/api/**"
                        ).permitAll()
                        .requestMatchers("/api/files/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll()
                )
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, e) -> {
                            res.setStatus(401);
                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"ok\":false,\"message\":\"로그인 필요\"}");
                        })
                );

        return http.build();
    }



    @Bean
    public HttpFirewall looseHttpFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        firewall.setAllowUrlEncodedDoubleSlash(true); // URL 인코딩된 // 허용
        firewall.setAllowSemicolon(true);
        firewall.setAllowBackSlash(true);
        firewall.setAllowUrlEncodedSlash(true);
        return firewall;
    }

    // 커스텀 Firewall 등록
    //
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer(HttpFirewall httpFirewall) {
        return web -> web.httpFirewall(httpFirewall);
    }
}
