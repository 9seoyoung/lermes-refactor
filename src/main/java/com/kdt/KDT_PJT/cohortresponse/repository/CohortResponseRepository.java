package com.kdt.KDT_PJT.cohortresponse.repository;

import com.kdt.KDT_PJT.cohortmem.entity.CohortMember;
import com.kdt.KDT_PJT.cohortresponse.entity.CohortResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CohortResponseRepository extends JpaRepository<CohortResponse, Long> {
    List<CohortResponse> findByParentSn(Integer parentSn);
    Optional<CohortResponse> findByUserSnAndParentSnAndParentType(Integer userSn, Integer parentSn, String parentType);
}
