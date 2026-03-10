package com.kdt.KDT_PJT.survey.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.bbs.enums.BbsType;
import com.kdt.KDT_PJT.survey.dto.RequestSurveyDto;
import com.kdt.KDT_PJT.survey.dto.ResponseSurveyDto;
import com.kdt.KDT_PJT.survey.service.SurveyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/survey")
@RequiredArgsConstructor
public class SurveyController {

    private final SurveyService surveyService;
    // 설문 등록
    @PostMapping("/post")
    public ResponseEntity<ResponseSurveyDto> createSurvey(@RequestBody RequestSurveyDto requestDto,
                                                          @AuthenticationPrincipal AuthCustomUserDetails auth) {
        Long userSn = auth.getId();
        Long roleId = auth.getRoleType();

        requestDto.setUserSn(userSn);

        ResponseSurveyDto responseDto = surveyService.createSurvey(requestDto, userSn, roleId);
        return ResponseEntity.ok(responseDto);
    }

    // 설문 단건 조회
    @GetMapping("/{srvySn}")
    public ResponseEntity<ResponseSurveyDto> getSurvey(
            @PathVariable Long srvySn,
            @AuthenticationPrincipal AuthCustomUserDetails auth) {

        Long roleId = auth.getRoleType();
        Long userSn = auth.getId();
        Long coSn = auth.getCompanySn();
        Long cohortSn = auth.getCohortSn();

        return ResponseEntity.ok(
                surveyService.getSurvey(srvySn, roleId, userSn, coSn, cohortSn)
        );
    }

    // 목록 조회
    @GetMapping("/list/{coSn}")
    public ResponseEntity<List<ResponseSurveyDto>> getSurveyList(
            @AuthenticationPrincipal AuthCustomUserDetails me,
            @RequestParam(required = false) Long coSn,
            @RequestParam(required = false) Long cohortSn,
            @RequestParam(required = false) BbsType bbsType
    ) {
        // 👇 로그인한 유저의 roleId 가져오기
        Long roleId = me.getRoleType(); // getRoleId() 혹은 getRoleCode() 등 프로젝트 구조에 따라 수정

        List<ResponseSurveyDto> list = surveyService.getSurveyList(coSn, cohortSn, roleId, bbsType);
        return ResponseEntity.ok(list);
    }

    // 설문 수정
    @PutMapping("/{srvySn}")
    public ResponseEntity<String> updateSurvey(@PathVariable Long srvySn,
                                               @RequestBody RequestSurveyDto requestDto,
                                               @AuthenticationPrincipal AuthCustomUserDetails auth) {
        Long userSn = auth.getId();       // 유저 ID
        Long roleId = auth.getRoleType(); // 롤 타입 (숫자)
        surveyService.updateSurvey(srvySn, requestDto, userSn, roleId);
        return ResponseEntity.ok("수정 성공");
    }
    //설문 삭제 (본인 or 권한자)
    @DeleteMapping("/{srvySn}")
    public ResponseEntity<String> deleteSurvey(@PathVariable Long srvySn,
                                               @AuthenticationPrincipal AuthCustomUserDetails auth) {
        Long userSn = auth.getId();
        Long roleId = auth.getRoleType();
        Long coSn = auth.getCompanySn();
        Long cohortSn = auth.getCohortSn();
        surveyService.deleteSurvey(srvySn, userSn, roleId, coSn, cohortSn);
        return ResponseEntity.ok("삭제 성공");
    }

}
