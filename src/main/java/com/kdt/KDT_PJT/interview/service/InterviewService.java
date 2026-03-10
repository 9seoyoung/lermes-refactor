package com.kdt.KDT_PJT.interview.service;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.cmmn.Enum.AuthEnums;
import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import com.kdt.KDT_PJT.cmmn.map.CmmnMap;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InterviewService {
    @Autowired
    CmmnDao dao;
    /**
     * @methodName : createInterviewRequest
     * @author : 김동식
     * @date : 2025.09.19
     * @param me : 로그인한 사용자 정보(교사 또는 학생)
     * @param params : 면담 정보(담당자, 대상자, 일시 등)를 담은 Map
     * @return : 성공 여부 및 저장된 정보를 담은 Map
     * Description : 면담 이벤트와 기록을 생성하고 데이터베이스에 저장합니다.
     * 하나의 면담에 하나의 기록만 존재하는 1:1 관계를 가집니다.
     */
    @PreAuthorize("hasAnyRole('INSTRUCTOR','STUDENT')") //얘네만 면담신청 가능
    @Transactional
    public CmmnMap createInterviewRequest(AuthCustomUserDetails me, CmmnMap params) {
        // 0) 인증 확인
        if (me == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 필요");   //예외 발생시 정상응답(200ok)대신 상태코드에 맞는 HTTP응답을 클라이언트에 돌려보냄
        }
        //params에 담긴 정보 : 면담 신청 제목, 면담 신청 내용, 면담 담당자 권한
        params.put("itvAplcntSn", Math.toIntExact(me.getId()));      //로그인유저 사용자SN 가져옴
        params.put("cohortSn", Math.toIntExact(me.getCohortSn()));   //로그인 유저의 기수SN 가져옴
//        String uuid = UUID.randomUUID().toString().replace("-", ""); //하이픈 제거된 uuid 얻음(신청글에대한 uuid) // 파일 먼저업로드 후 받아온값 넣기로 변경 (이줄은 사용X)
//        params.put("formUuid", uuid);                                                                     // 이미 들어있음
        params.put("itvAplyDt", LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS)); // 면담 신청 일시 추가(기록용)
        params.put("coSn",Math.toIntExact(me.getCompanySn())); // 해당유저 회사번호 가져옴

        //itvPicAuthrt 값을 문자열로 가져와서 Integer로 변환
        String authrtString = (String) params.get("itvPicAuthrt");

        Integer authrtCode;
        try {
            // 공통 Enum 클래스에서 코드 변환
            authrtCode = AuthEnums.getCodeByName(authrtString);
            params.put("itvPicAuthrt", authrtCode);
        } catch (IllegalArgumentException e) {
            // getCodeByName()에서 던진 예외를 잡아서 처리
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
        System.out.println("면담대상자 authrtCode = " + authrtCode);
        // 2) 변환된 Integer 값을 다시 CmmnMap에 넣기
        params.put("itvPicAuthrt", authrtCode);


        dao.insert("com.kdt.mapper.interview.insertApplyInterview", params); //itvSn 생성되어 들어옴.
        System.out.println("params = " + params);
        System.out.println(params.get("itvPicAuthrt"));
        System.out.println(params.get("itvPicAuthrt").getClass().getName());
        System.out.println(params.get("itvAplcntSn").getClass().getName());
//        CmmnMap result = new CmmnMap();
        CmmnMap result = params;
        return result;
    }


    @Transactional
    public List<CmmnMap> getMyInterviewRequests(CmmnMap params) { //params에 where에 쓸거 실려옴
//        params.put("pathCohortSn",pathCohortSn); // params에 실어서 보내기
        List<CmmnMap> paramsList = dao.selectList("com.kdt.mapper.interview.getMyInterviewRequests", params);
        return paramsList;
    }

    @Transactional
    public List<CmmnMap> getMyInterviewRequestsAll(CmmnMap params) { //params에 where에 쓸거 실려옴
//        params.put("pathCohortSn",pathCohortSn); // params에 실어서 보내기
        List<CmmnMap> paramsList = dao.selectList("com.kdt.mapper.interview.getMyInterviewRequestsAll", params);
        return paramsList;
    }

    @Transactional
    public int confirmInterview(CmmnMap params){


        return dao.update("com.kdt.mapper.interview.confirmInterview", params); //업데이트
    }

    @Transactional
    public CmmnMap getCoSnAndCohortSnByItvSn(CmmnMap params){
        return dao.selectOne("com.kdt.mapper.interview.getCoSnAndCohortSnByItvSn",params);
    }

    @Transactional
    public CmmnMap readInterviewbyItvSn(CmmnMap params){
        return dao.selectOne("com.kdt.mapper.interview.readInterviewbyItvSn", params);
    }

    @Transactional
    public int incViewCnt(CmmnMap params){
        return dao.update("com.kdt.mapper.interview.incViewCnt", params);
    }

    @Transactional
    public void deleteInterviewApplyBeforeConfirm(Integer itvSn){
        int isDeleted = dao.update("com.kdt.mapper.interview.deleteInterviewApplyBeforeConfirm",itvSn); // itvSn으로 해당 글 delYn 1로 바꾸기
        if(isDeleted == 1) {
            System.out.println("성공");
        }else{
            throw new ResponseStatusException(HttpStatus.CONFLICT, "삭제실패, 이미삭제됐거나 뭐 잘못됨~");
        }
    }

    public LocalDateTime getItvPrnmntDtByItvSn(Integer itvSn){
        return dao.selectOne("com.kdt.mapper.interview.getItvPrnmntDtByItvSn",itvSn);
    }
}
