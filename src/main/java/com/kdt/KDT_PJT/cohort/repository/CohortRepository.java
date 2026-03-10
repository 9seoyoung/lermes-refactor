package com.kdt.KDT_PJT.cohort.repository;


import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CohortRepository extends JpaRepository<Cohort, Long> {

    List<Cohort> findByCoSn(Long coSn);

    Optional<Cohort> findById(Long id);

    @Query("SELECT c.cohortNm FROM Cohort c")
    List<String> findAllCohortTitles();

}
