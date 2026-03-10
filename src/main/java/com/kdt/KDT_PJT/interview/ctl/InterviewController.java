package com.kdt.KDT_PJT.interview.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.calendar.service.CalendarService;
import com.kdt.KDT_PJT.cmmn.Enum.AuthEnums;
import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import com.kdt.KDT_PJT.cmmn.map.CmmnMap;
import com.kdt.KDT_PJT.file.service.FileService;
import com.kdt.KDT_PJT.interview.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Delete;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class InterviewController {
    @Autowired
    CmmnDao dao;

    private final InterviewService interviewService;
    private final CalendarService calendarService;
    private final FileService fileService;

    private final Logger log = LoggerFactory.getLogger(getClass());

    /**
     * @param me     : 로그인한 사용자 정보
     * @param params : 면담 신청 정보를 담고 있는 Map (예: 면담 제목, 내용, 면담 희망하는 계급 번호(관리자 or 강사) 등)
     * @return : 성공 여부 및 저장된 정보를 담은 Map
     * Description    : 면담을 신청하는 API. 로그인한 사용자의 정보를 자동으로 받아와 면담 신청인으로 처리합니다.
     * @methodName : applyInterview
     * @author : 김동식
     * @date : 2025.09.19
     */
    @PostMapping("/apply")
    public ResponseEntity<CmmnMap> applyInterview(
            @AuthenticationPrincipal AuthCustomUserDetails me,
            @RequestBody CmmnMap params){

//         Object formUuid = params.get("formUuid");
         // 처리후 결과 보낼거임
        CmmnMap resp= interviewService.createInterviewRequest(me, params);
//        resp.put("formUuid", formUuid);

        return ResponseEntity.ok(resp);
    }

    /*
    * 면담 확정 전 삭제*/ //TODO
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','EMPLOYEE','INSTRUCTOR', 'STUDENT')") // 뭐 삭제 관리자도 할수잇을듯
    @DeleteMapping("/delete/{itvSn}") // 아 조회하는거 걍 {itvSn} 할걸
    public ResponseEntity<Void> deleteInterviewApplyBeforeConfirm(@PathVariable Integer itvSn){
        interviewService.deleteInterviewApplyBeforeConfirm(itvSn);
        return ResponseEntity.noContent().build();
    }

    /**
     * 내 면담 요청 목록
     * - 강사(INSTRUCTOR=4): url에 cohortSn 없으면 본인 cohortSn 사용, 그것도 없으면 400
     * - 대표/직원(TENANT=2, EMPLOYEE=3): url에 cohortSn 필수
     */
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','EMPLOYEE','INSTRUCTOR', 'STUDENT')") // 권한 체크
    @GetMapping({"/my-requests", "/my-requests/{cohortSn}"}) // 강사/대표/직원 공용
    public List<CmmnMap> getMyInterviewRequests(
            @AuthenticationPrincipal AuthCustomUserDetails me,
            @PathVariable(value = "cohortSn", required = false) Integer pathCohortSn,
            CmmnMap params) {

        if (me == null) { // 로그인 필요
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 필요");
        }

        if (params == null) { // Spring이 바인딩하지 못하는 경우 대비
            params = new CmmnMap();
        }

        final int roleType = Math.toIntExact(me.getRoleType()); // 2=대표,3=직원,4=강사
//        final int userSn   = Math.toIntExact(me.getId()); // 이거는 여기서는 필요없음

        Integer resolvedCohortSn = pathCohortSn;
        switch (roleType) {
            //---------서영추가---------------
            case 5: // 수강생 본인이 신청한 내역
                if (resolvedCohortSn == null) {
                // 내 기수, 선택한 기수
                Long myCohort = me.getCohortSn();
                if (myCohort == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "기수 정보가 없습니다. 관리자에게 문의하세요.");
                }
                resolvedCohortSn = Math.toIntExact(myCohort);
                params.put("userSn", me.getId());
                log.info("userSn" + me.getId());
            }
                break;
            //-------------------------------
            case 4: // 강사인 경우
                if (resolvedCohortSn == null) {
                    // 내 기수, 선택한 기수
                    Long myCohort = me.getCohortSn();
                    if (myCohort == null) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "강사 계정의 기수 정보가 없습니다. 관리자에게 문의하세요.");
                    }
                    resolvedCohortSn = Math.toIntExact(myCohort);
                }
                break;
            case 1: // 슈퍼관리자
            case 2: // 대표인 경우
            case 3: // 직원인 경우
                // 전체 조회 중 강사 한테 요청한 것만 제외 해야함 주석 처리 해놓겠음
                // if (resolvedCohortSn == null) {
                //     throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "기수번호(cohortSn)를 입력하세요.");
                // }
                break;
            default:
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "권한 없음");
        }
        // SQL 분기에 필요한 최소 파라미터만 전달 (Integer 타입 보장)
        // ㅇㅎ params에 권한레벨 넣음
        params.put("roleType", roleType);
        System.out.println("roleType = " + roleType);
//        params.put("userSn",   userSn);
        // params에 받아온 기수정보 넣음
        params.put("cohortSn", resolvedCohortSn);

        //params에 받아온 회사정보 넣음
        params.put("coSn", Math.toIntExact(me.getCompanySn()));
        
        // 기수정보가 없거나 0으로 넘어왔을 때는 전체 기수에 대한 조회
        // 강사는 나중에 기수테이블에서 자기 이름?(pk) 박힌거 있으면 그거 다 긁어와야 할 듯
        // 이건 나중에 진령언니랑 얘기해보겠음. 일단 화면 안봐서 킵 ㅋㅋ
        // if (resolvedCohortSn == null && resolvedCohortSn == 0) { 
        //     // 동식이가 만든 xml 복사할 예정. cohortSn만 안들어갈꺼임, 회사SN은 필요한디 모든회사꺼 나오면 곤란 >> effectiveSn 꺼내쓴다.
        //     //@params 안에 cohortSn, effectiveSn 사용 예정
            List<CmmnMap> resp = interviewService.getMyInterviewRequestsAll(params);
//            resp에 게시물 유형 추가해서 반환
        //     log.debug("getMyInterviewRequests result rows={}", (resp != null ? resp.size() : 0));

        //     // 이 경우 빠르게 탈출
        //     return resp;
        // } else {

        // List<CmmnMap> resp = interviewService.getMyInterviewRequests(params);
        log.debug("getMyInterviewRequests result rows={}", (resp != null ? resp.size() : 0));
        return resp;
        // }
    }

    /**
     * 면담 요청 상세보기
     */
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','EMPLOYEE','INSTRUCTOR', 'STUDENT')") // 권한 체크
    @GetMapping("/read/{itvSn}")
    public ResponseEntity<CmmnMap> readInterview(@AuthenticationPrincipal AuthCustomUserDetails me,
                                                 @PathVariable Long itvSn,
                                                 CmmnMap params){ //params는 로컬변수
        if (me == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 필요");
        else if (itvSn == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "뭐를조회할건디요");

        params.put("itvSn",itvSn); // 인터뷰SN 실어줌
        // 해당 글에 접근 권한 있는지 체크 (다른 회사의 글일수도 있으니)
        boolean isSuperAdmin = me.getRoleType().equals(1L); // me.getRoleType() == 1 해도 됨
                                                            // Long 래퍼 객체의 값 비교할때는 equals 써야함. ==는 주소를 비교함. 1L은 롱타입 1말함 근데 기본타입이랑 비교시 == 써서 비교하면
                                                            // 왼쪽의 래퍼 클래스에 담긴 값을 자동 언박싱해서 비교함.
                                                            // 하지만 래퍼 클래스 객체끼리의 값 비교할때는 == 쓰면 주소를 비교하므로 equals써야 내부 값을 비교할수있음
                                                            // 걍 객체의 값 비교할때는 .equals 쓰는게 습관들이는데 좋음
        if(!isSuperAdmin) { // 슈퍼어드민 아닌경우
            System.out.println("님은 슈퍼어드민이 아님, coSN체크 드가겠음");
            CmmnMap scope = interviewService.getCoSnAndCohortSnByItvSn(params);
            System.out.println("scope = " + scope);
            if(scope.get("coSn").equals(me.getCompanySn())) {//접근하고자 하는 글의 coSn이 사용자의 coSn과 다르면 BAD_REQUEST
                System.out.println("coSn = " + scope.get("coSn"));
                System.out.println("내 cosn= "+me.getCompanySn());
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "다른 회사 글 조회 불가능");
            } else if(me.getRoleType() == 4 && scope.get("cohortSn").equals(me.getCohortSn())){ // 선생이면서 다른 cohort의 글 확인하려한다? 나가셈
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "다른 기수 글 조회 불가능");
            }
        }

        //회사 체크 완료, 이제 글 보여드리겠음, 학생 밑으로는 이미 @PreAuthorize로 걸러져서 ㄱㅊ

        //일단 조회수 +1 조지겠음
        int isIncViewCnt = interviewService.incViewCnt(params);
        if (isIncViewCnt == 1) {
            System.out.println("조회수 +1");
        } else{
            System.out.println("조회수 +1 실패");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "조회수 올리기 실패");
        }
        CmmnMap resp = interviewService.readInterviewbyItvSn(params); //실제 상세 조회

        String formUuid = Objects.toString(resp.get("formUuid"), ""); // formUuid 비었으면 ""로 처리
        List<CmmnMap> files = fileService.readFileSnAndNmbyFormUuid(formUuid); //formUuid로 파일명, 파일SN 받아옴 없으면 []
        resp.put("files",files);
        System.out.println("출력전 확인 resp = " + resp);


        return ResponseEntity.ok(resp);
    }

    @Transactional                     //너무길어지는데 걍 여기 트랜잭션으로 가야겠음
    @PutMapping("/confirm/{itvSn}") // 면담 확정
    public void confirmInterview(
            @AuthenticationPrincipal AuthCustomUserDetails me,
            @PathVariable("itvSn") Integer itvSn,
            @RequestBody CmmnMap params) {
        if (me == null) { // 로그인 필요
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 필요");
        } else if(params == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "내용 보내삼");
        }

        // 요청 파라미터 파싱
        final String itvDay  = (String) params.get("itvDay");   // "2025-09-22"
        final String itvTime = (String) params.get("itvTime");  // "09:00"
        final String itvPlc  = (String) params.get("itvPlc");   // 장소
        final String itvPicAns =(String)params.get("itvPicAns"); // 담당자 메시지

        if (itvDay == null || itvTime == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "itvDay, itvTime은 필수입니다.");

        // 날짜+시간 → LocalDateTime
        final LocalDate date;
        final LocalTime time;
        try {
            date = LocalDate.parse(itvDay);        // "yyyy-MM-dd"
            time = LocalTime.parse(itvTime).truncatedTo(java.time.temporal.ChronoUnit.MINUTES);       // "HH:mm" 초 절삭. 분단위만 남김
        } catch (DateTimeParseException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "날짜/시간 포맷이 잘못되었습니다. (예: 2025-09-22, 09:00)");
        }
        final LocalDateTime prnmntDt = LocalDateTime.of(date, time);

        params.put("itvPrnmntDt", prnmntDt);// MyBatis가 LocalDateTime→DATETIME 매핑
        params.put("itvPlc", itvPlc);
        params.put("itvPicAns", itvPicAns);  // url에 온거 map에 실어주기
        params.put("itvPicSn", Math.toIntExact(me.getId()) );
        params.put("coSn",me.getCompanySn().intValue());

        params.put("itvSn",itvSn);
        int isUpdated = interviewService.confirmInterview(params); // 업데이트
        if (isUpdated == 1) {
            System.out.println("확정됨, 캘린더 일정 생성");
            System.out.println("params => " + params);
        }else{
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 확정되었거나 존재하지 않는 면담입니다.");
        }


        System.out.println("itvSn=" + params.get("itvSn"));
        System.out.println(params.get("itvSn").getClass().getName());
        System.out.println("params = " + params);
        CmmnMap m = new CmmnMap(); // 일정 추가 파라미터 작성
        m.put("itvPrnmntDt",params.get("itvPrnmntDt"));
        m.put("itvSn",params.get("itvSn"));
        m.put("itvTime",params.get("itvTime"));
        m.put("coSn", params.get("coSn"));
        System.out.println("m = " + m);
        dao.insert("com.kdt.mapper.calendar.createPicCalendarByItvSn", m); // 인터뷰SN으로 면담 진행할사람 두명 SN,기수SN 가져오고 면담 담당자 일정 추가
        m.put("picCalSn",m.get("calSn")); //picCalSn 저장하기 (면담 담당자의 캘린더SN)
        dao.insert("com.kdt.mapper.calendar.createAplcntCalendarByItvSn", m); // 인터뷰SN으로 면담 진행할사람 두명 SN,기수SN 가져오고 면담 신청자 일정 추가
        m.put("aplcntCalSn",m.get("calSn")); //aplcntCalSn 저장하기 (면담 신청자의 캘린더SN)
        System.out.println("m = " + m);
        dao.update("com.kdt.mapper.interview.insertCalendarSnToInterview",m);
        // 지금 calender 추가하는것 까지는 완료
    }

    //TODO 면담 확정후 시간이나 그런거 수정할수있는 API 만들기~
    //수정하면 그에맞게 캘린더 시간도 update해줘야함.



}
