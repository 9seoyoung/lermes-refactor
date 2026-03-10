package com.kdt.KDT_PJT.interview.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.interview.dto.InterviewRecordDetailResponseDTO;
import com.kdt.KDT_PJT.interview.dto.InterviewRecordListResponseDTO;
import com.kdt.KDT_PJT.interview.dto.InterviewRecordRequestDTO;
import com.kdt.KDT_PJT.interview.service.InterviewRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/interviewRecord")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class InterviewRecordController {


    private final InterviewRecordService interviewRecordService;


    // 면담기록 등록
    @PostMapping()
    public void createInterviewRecord(@AuthenticationPrincipal AuthCustomUserDetails me,
                                      @RequestBody InterviewRecordRequestDTO params){ //ResponseEntity<InterviewRecordDetailResponseDTO>
        interviewRecordService.createInterviewRecord(me,params); // 상세조회 쿼리 호출해서 올라간거 보여줘도 좋을듯
    }

    // 면담기록 리스트 조회 (본인과 관련된것만)
    @GetMapping() // /api/interviewRecord도 받고 /api/interviewRecord?cohortSn=100도 받음 (관리자는 반드시 cohortSn 필수)
    public List<InterviewRecordListResponseDTO> readInterviewRecord(@AuthenticationPrincipal AuthCustomUserDetails me,
                                                                    @RequestParam (required = false) Integer cohortSn){
        return interviewRecordService.readInterviewRecord(me,cohortSn);
    }

    // 면담기록 상세 조회
    @GetMapping("/{itvRecordSn}")
    public ResponseEntity<InterviewRecordDetailResponseDTO> readInterviewRecordDetail(@AuthenticationPrincipal AuthCustomUserDetails me,
                                                                                      @PathVariable Integer itvRecordSn){
        return ResponseEntity.ok(interviewRecordService.readInterviewRecordDetail(me,itvRecordSn));
    }

    // 면담기록 수정
    @PatchMapping("/{itvRecordSn}")
    public ResponseEntity<InterviewRecordDetailResponseDTO> updateInterviewRecord(@PathVariable Integer itvRecordSn,
                                                                                  @RequestBody InterviewRecordRequestDTO params){
        return ResponseEntity.ok(interviewRecordService.updateInterviewRecord(itvRecordSn,params));
    }

    // 면담기록 삭제
    @DeleteMapping("/{itvRecordSn}")
    public ResponseEntity<Void> deleteInterviewRecord(@PathVariable Integer itvRecordSn){
        interviewRecordService.deleteInterviewRecord(itvRecordSn);
        return ResponseEntity.noContent().build(); // 204 No Content 반환
    }

}
