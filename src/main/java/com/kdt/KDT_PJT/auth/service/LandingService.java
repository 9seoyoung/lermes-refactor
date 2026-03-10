package com.kdt.KDT_PJT.auth.service;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.auth.entity.Company;
import com.kdt.KDT_PJT.auth.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LandingService {
    /**
     * 로그인 성공 시 프론트 라우트 path 반환
     * - SUPER_ADMIN, GENERAL → /
     * - TENANT_ADMIN, EMPLOYEE → adminHome
     * - INSTRUCTOR → tutorHome
     * - STUDENT → stdHome
     */
    public String buildNextPath(AuthCustomUserDetails me) {
        Long roleType = me.getRoleType();
        if (roleType == null) return "/";

        switch (roleType.intValue()) {
            case 1:  // SUPER_ADMIN
            case 6:  // GENERAL
                return "/";

            case 2:  // TENANT_ADMIN
            case 3:  // EMPLOYEE
                return "adminHome";

            case 4:  // INSTRUCTOR
                return "tutorHome";

            case 5:  // STUDENT
                return "stdHome";

            default:
                return "/";
        }
    }
}
