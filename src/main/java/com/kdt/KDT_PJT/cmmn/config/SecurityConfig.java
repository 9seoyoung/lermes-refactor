//package com.kdt.KDT_PJT.cmmn.config;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.firewall.HttpFirewall;
//import org.springframework.security.web.firewall.StrictHttpFirewall;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import com.kdt.KDT_PJT.sample.svc.CustomUserDetailsService;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//
//
//@Configuration
//public class SecurityConfig {
//
//
//	@Autowired
//	private CustomUserDetailsService customUserDetailsService;
//
//
//	/**
//	 * 암호화 임시해제
//	* @methodName    : passwordEncoder
//	* @author        : (성명)/(직위)
//	* @date          : 2025.08.04
//	* @return
//	* Description 	 :실제 서비스시 절대 사용금지
//	 */
//	@Bean
//	public PasswordEncoder passwordEncoder() {
//	    return new PlainTextPasswordEncoder();
//	}
//
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//        	.userDetailsService(customUserDetailsService)  //
//            .authorizeHttpRequests(auth -> auth
//                .requestMatchers(
//                    "/login"	// 로그인 폼
//                	,"/join"	// 회원가입 폼
//                    , "/css/**"
//                    , "/js/**"
//                    , "/sampleReactMvc/**"
//                    //, "/sampleJspMvc/**"
//                    ).permitAll() // 여기에 명시된 페이지는 누구나 접근가능
//                .anyRequest().authenticated() // 나머지는 인증 필요
//            )
//            .formLogin(form -> form
//                .loginPage("/login") // 커스텀 로그인 페이지 경로 (컨트롤러호출)
//                .defaultSuccessUrl("/main", true) // 로그인 성공 시 이동할 페이지
//                .failureUrl("/login?error")
//                .successHandler((request, response, authentication) -> {
//                    System.out.println("로그인 성공: " + authentication.getName());
//                    response.sendRedirect("/main");
//                })
//                .failureHandler((request, response, exception) -> {
//                    System.out.println("로그인 실패: " + exception.getMessage());
//                    response.sendRedirect("/login?error");
//                })
//                .permitAll()
//            )
//            .logout(logout -> logout
//                .logoutUrl("/logout") // 로그아웃 URL (기본값: /logout)
//                .logoutSuccessUrl("/login?logout") // 로그아웃 성공시 이동
//                .invalidateHttpSession(true) // 세션 무효화
//                .deleteCookies("JSESSIONID") // 쿠키 삭제
//            )
//            .csrf().disable() // CSRF 보호 비활성화 (개발용에서만!)
//	        .addFilterBefore(new OncePerRequestFilter() {
//	            @Override
//	            protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, java.io.IOException {
//	                System.out.println("Request URI: " + request.getRequestURI() + ", Method: " + request.getMethod());
//	                filterChain.doFilter(request, response);
//	            }
//	        }, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//
//    /**
//     * 이중 슬래시 허용 설정 추가
//    * @methodName    : looseHttpFirewall
//    * @author        : (성명)/(직위)
//    * @date          : 2025.07.25
//    * @return
//    * Description 	 :
//     */
//    @Bean
//    public HttpFirewall looseHttpFirewall() {
//        StrictHttpFirewall firewall = new StrictHttpFirewall();
//        firewall.setAllowUrlEncodedDoubleSlash(true); // URL 인코딩된 // 허용
//        firewall.setAllowSemicolon(true);
//        firewall.setAllowBackSlash(true);
//        firewall.setAllowUrlEncodedSlash(true);
//        return firewall;
//    }
//
//    // 커스텀 Firewall 등록
//
//    @Bean
//    public WebSecurityCustomizer webSecurityCustomizer(HttpFirewall httpFirewall) {
//        return web -> web.httpFirewall(httpFirewall);
//    }
//}
