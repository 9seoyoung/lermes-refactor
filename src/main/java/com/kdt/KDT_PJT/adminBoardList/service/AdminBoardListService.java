package com.kdt.KDT_PJT.adminBoardList.service;

import com.kdt.KDT_PJT.adminBoardList.dto.AdminBoardListDTO;
import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import com.kdt.KDT_PJT.cmmn.map.CmmnMap;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminBoardListService {
    @Autowired
    CmmnDao dao;


    public List<AdminBoardListDTO> getAdminBoardListByCohortSn(AdminBoardListDTO adminBoardListDTO){

        return dao.selectList("com.kdt.mapper.AdminBoardListMapper.getAdminBoardListByCohortSn",adminBoardListDTO);    }
}
