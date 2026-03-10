package com.kdt.KDT_PJT.sample.svc;

import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import com.kdt.KDT_PJT.cmmn.map.CmmnMap;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private CmmnDao cmmnDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // 쿼리 실행
        CmmnMap params = new CmmnMap();
        params.put("username", username); // 또는 username 파라미터가 일치하는 key

        System.out.println("Trying login with username: " + username);
        Map<String, Object> userMap = cmmnDao.selectOne("com.kdt.mapper.sample.findByUserName", params);
        System.out.println("UserMap from DB: " + userMap);
        if (userMap == null) {
            System.out.println("User not found");
            throw new UsernameNotFoundException("User not found");
        }
        String password = (String) userMap.get("password");
        System.out.println("Password from DB: " + password);

        // 시큐리티 User 객체 생성 (권한 없이 로그인만)
        return new User(
            username,
            password,
            true, true, true, true,
            Collections.emptyList()
        );
    }
}
