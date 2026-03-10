//package com.kdt.KDT_PJT.attend.api;
//
//import com.kdt.KDT_PJT.attend.dto.SimpleResponse;
//import com.kdt.KDT_PJT.attend.service.DailyAttendTotService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//
//@RestController
//@RequestMapping("/api/attend")
//@RequiredArgsConstructor
//public class DailyAttendTotController {
//    private DailyAttendTotService dailyAttendTotService;
//
//    @GetMapping("/defaultAbsent")
//    private ResponseEntity<SimpleResponse> DefaultAbsent(Authentication auth) {
//        dailyAttendTotService.defaultAbsent(auth);
//    }
//}
