package com.kdt.KDT_PJT.studySchedule.service;

import com.kdt.KDT_PJT.calendar.dto.CalendarDetailResponseDTO;
import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import com.kdt.KDT_PJT.cmmn.map.CmmnMap;
import com.kdt.KDT_PJT.studySchedule.dto.StudyScheduleResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudyScheduleService {

    @Autowired
    CmmnDao dao;

    public List<StudyScheduleResponseDTO> getStudySchedule(Integer cohortSn, int roleType, int userSn){
        CmmnMap params = new CmmnMap();
        params.put("cohortSn",cohortSn);
        params.put("roleType",roleType);
        params.put("userSn",userSn);
        System.out.println("params = " + params);
        return dao.selectList("com.kdt.mapper.studySchedule.getStudyScheduleByCohortSn",params);
    }
}
