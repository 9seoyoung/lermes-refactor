package com.kdt.KDT_PJT.interview.service;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import com.kdt.KDT_PJT.cmmn.map.CmmnMap;
import com.kdt.KDT_PJT.file.service.FileService;
import com.kdt.KDT_PJT.interview.dto.InterviewRecordDetailResponseDTO;
import com.kdt.KDT_PJT.interview.dto.InterviewRecordListResponseDTO;
import com.kdt.KDT_PJT.interview.dto.InterviewRecordRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class InterviewRecordService {

    private final InterviewService interviewService;
    private final FileService fileService;

    @Autowired
    CmmnDao dao;

    public int countActiveRecord(Integer itvSn) {
        return dao.selectOne("com.kdt.mapper.interviewRecord.countActiveRecordByItvSn", itvSn);
    }


    @Transactional
    public void createInterviewRecord(AuthCustomUserDetails me, InterviewRecordRequestDTO params) { //CmmnMap
        boolean isDateInputProvided = params.getDate() != null && !params.getDate().isBlank();
        Integer itvSn = params.getItvSn();
        if (itvSn != null && countActiveRecord(itvSn) != 0) { // 번개 아님, 이미 itvSn에 대한 기록 존재하는지 체크
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 해당 면담신청에 대한 기록이 존재함");
        }
        if (itvSn != null && !isDateInputProvided){ // itvSn 존재하고, 날짜 입력 안왔으면 해당하는 itvSn에서 가져온다.
            LocalDateTime itvPrnmntDt = interviewService.getItvPrnmntDtByItvSn(itvSn);
            if(itvPrnmntDt != null) params.setItvDt(itvPrnmntDt);   //날짜 가져온게 null 아니라면 DTO에 집어넣음
            else throw new ResponseStatusException(HttpStatus.CONFLICT, "확정 된 면담이 아님"); //비워져있으면 확정 면담 아니니까 예외발생
        }
        if (isDateInputProvided){
            params.buildDateTime();
        }
        if (params.getItvDt() == null) params.buildDateTime(); // 날짜 아직 없으면 현재 시각 으로 채우자
        System.out.println("요청 params = " + params);

        dao.insert("com.kdt.mapper.interviewRecord.createInterviewRecord",params);
        System.out.println("입력된 params = " + params);
    }

    // 나와 관련된 면담 기록 리스트를 리턴
    public List<InterviewRecordListResponseDTO> readInterviewRecord(AuthCustomUserDetails me, Integer cohortSn){
        int roleType = me.getRoleType().intValue();
        int userSn = me.getId().intValue();
        if(roleType <= 3){
            if(cohortSn == null) throw new ResponseStatusException(HttpStatus.CONFLICT, "관리자는 기수번호 실어오세요");
        } else if (roleType <= 5){
            cohortSn = me.getCohortSn().intValue();
        }
        CmmnMap params = new CmmnMap();
        params.put("cohortSn",cohortSn);
        params.put("userSn",userSn);
        return dao.selectList("com.kdt.mapper.interviewRecord.readInterviewRecordByUserSnAndCohortSn",params);
    }

    // 면담 기록 상세 조회
    @Transactional
    public InterviewRecordDetailResponseDTO readInterviewRecordDetail(AuthCustomUserDetails me, Integer itvRecordSn){
           // 조회수 +1
        if(dao.update("com.kdt.mapper.interviewRecord.incViewCnt",itvRecordSn)==0){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "조회수 증가 실패");
        }

        InterviewRecordDetailResponseDTO res = dao.selectOne("com.kdt.mapper.interviewRecord.readInterviewRecordDetailByItvRecordSn",itvRecordSn);
        String formUuid = Objects.toString(res.getFormUuid(), ""); // formUuid 비었으면 ""로 처리
        List<CmmnMap> files = fileService.readFileSnAndNmbyFormUuid(formUuid);
        res.setFiles(files); //파일목록실어줌
        return res;
    }

    // 면담 기록 수정
    @Transactional
    public InterviewRecordDetailResponseDTO updateInterviewRecord(Integer itvRecordSn,InterviewRecordRequestDTO params){
        params.setItvRecordSn(itvRecordSn);
        if(params.getDate() != null && !params.getDate().isBlank()) params.buildDateTime(); // 날짜 실어서 보내면 시간도 업뎃
        if(dao.update("com.kdt.mapper.interviewRecord.updateInterviewRecordByItvRecordSn",params)==0){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "업데이트실패");
        }
        InterviewRecordDetailResponseDTO res = dao.selectOne("com.kdt.mapper.interviewRecord.readInterviewRecordDetailByItvRecordSn",itvRecordSn);
        String formUuid = Objects.toString(res.getFormUuid(), ""); // formUuid 비었으면 ""로 처리
        List<CmmnMap> files = fileService.readFileSnAndNmbyFormUuid(formUuid);
        res.setFiles(files); //파일목록실어줌
        return res;
    }

    // 면담 기록 삭제
    @Transactional
    public void deleteInterviewRecord(Integer itvRecordSn){
        if(dao.update("com.kdt.mapper.interviewRecord.deleteInterviewRecordByItvRecordSn",itvRecordSn)==0)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "삭제실패");
    }
}
