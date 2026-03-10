package com.kdt.KDT_PJT.cohortmem.repository;

import com.kdt.KDT_PJT.cohortmem.entity.CohortMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CohortMemberRepository extends JpaRepository<CohortMember, Long> {
    // 커스텀 메서드 추가 가능
    List<CohortMember> findByCohortSn(Long cohortSn);

    Optional<CohortMember> findByUserSn(Long userSn);

    boolean existsByUserSnAndCohortSn(Long userSn, Long cohortSn);

    List<CohortMember> findByCohortSnAndUserCompanySnAndUserRoleType(Long cohortSn, Long companySn, Long roleType);

    List<CohortMember> findByCohortSnAndAprvDtIsNull(Long cohortSn);

}
