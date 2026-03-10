package com.kdt.KDT_PJT.studySchedule.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.studySchedule.dto.StudyScheduleResponseDTO;
import com.kdt.KDT_PJT.studySchedule.service.StudyScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/studySchedule")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class StudyScheduleController {

    private final StudyScheduleService studyScheduleService;

    // 학습일정 전체보기용 (강사 이상은 cohortSn 파라미터 필수)
    @GetMapping()
    public ResponseEntity<List<StudyScheduleResponseDTO>> getStudySchedule(@AuthenticationPrincipal AuthCustomUserDetails me,
                                                                           @RequestParam(required = false) Integer cohortSn){ // 관리자 급은 cohortSn 파라미터 필요
        int roleType = me.getRoleType().intValue();
        int userSn = me.getId().intValue();
        if (roleType == 4 || roleType == 5) { // 강사, 학생은 꺼내쓰기
                cohortSn = me.getCohortSn().intValue();
        }
        if (cohortSn == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "cohortSn이 없음");

        return ResponseEntity.ok(studyScheduleService.getStudySchedule(cohortSn,roleType,userSn));
    }
}
