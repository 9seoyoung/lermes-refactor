package com.kdt.KDT_PJT.cohortmem.ctl;

import com.kdt.KDT_PJT.cohortmem.dto.CohortMemberDto;
import com.kdt.KDT_PJT.cohortmem.service.CohortMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cohort-member") // 선택적
@RequiredArgsConstructor
public class CohortMemberController {

    private final CohortMemberService cohortMemberService;

    @GetMapping("/cohort/{cohortSn}/applicants")
    public ResponseEntity<List<CohortMemberDto>> getApplicants(@PathVariable Long cohortSn) {
        List<CohortMemberDto> applicants = cohortMemberService.getAppByCohortSn(cohortSn); // <- 이름도 맞춰야 함
        return ResponseEntity.ok(applicants);
    }

    @PostMapping("/apply")
    public ResponseEntity<String> applyForCohort(
            @RequestParam Long userSn,
            @RequestParam Long cohortSn
    ) {
        cohortMemberService.applyForCohort(userSn, cohortSn);
        return ResponseEntity.ok("수강신청 완료");
    }

//    @PostMapping("/{memberId}/approve")
//    public ResponseEntity<String> approveMember(
//            @PathVariable Long memberId,
//            @RequestBody Map<String, Long> body)
//    {
//        cohortMemberService.approveMember(memberId);
//        return ResponseEntity.ok("승인 완료");
//    }

    @PostMapping("/{memberId}/approve")
    public ResponseEntity<String> approveMember(
            @PathVariable Long memberId,
            @RequestBody Map<String, Long> body
    ) {
        Long companySn = body.get("companySn");
        Long cohortSn = body.get("cohortSn");

        cohortMemberService.approveMember(memberId, cohortSn, companySn);
        return ResponseEntity.ok("승인 완료");
    }

    @PostMapping("/{memberId}/reject")
    public ResponseEntity<String> rejectMember(@PathVariable Long memberId) {
        cohortMemberService.rejectMember(memberId);
        return ResponseEntity.ok("반려 완료");
    }
}
