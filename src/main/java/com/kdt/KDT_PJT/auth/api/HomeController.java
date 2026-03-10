//package com.kdt.KDT_PJT.auth.api;
//
//import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api")
//@RequiredArgsConstructor
//public class HomeController {
//    public class AdminHomeController {
//
//        private final AdminHomeService adminHomeService;
//
//        // AdminHome.jsx 진입 시 페이지 데이터 번들
//        @GetMapping("/admin/home")
//        public ResponseEntity<?> getAdminHome(@AuthenticationPrincipal AuthCustomUserDetails me) {
//            if (me == null) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                        .body(Map.of("ok", false, "message", "로그인 필요"));
//            }
//            AdminHomeResponseDto dto = adminHomeService.loadHomeData(
//                    me.getId(),             // 로그인 사용자 PK
//                    me.getCompanyId(),      // 소속 회사 PK
//                    me.getRole().name()     // 권한명 (SUPER_ADMIN/ADMIN/...)
//            );
//            return ResponseEntity.ok(dto);
//        }
//}
