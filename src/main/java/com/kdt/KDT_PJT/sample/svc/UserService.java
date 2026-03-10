package com.kdt.KDT_PJT.sample.svc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import com.kdt.KDT_PJT.cmmn.map.CmmnMap;

@Service
public class UserService {

    
    @Autowired
    private CmmnDao cmmnDao;
    

    public CmmnMap findByUserId(CmmnMap params) {
    	
    	String queryId = "com.kdt.mapper.sample.findByUserName";
    	return cmmnDao.selectOne(queryId, params);   	
    	
    }
    

}