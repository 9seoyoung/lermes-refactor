package com.kdt.KDT_PJT.auth.repository;

import com.kdt.KDT_PJT.auth.entity.User;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String username);

    Optional<List<User>> findByCohortSn(Long cohortSn);

    List<User> findByEnabledTrueAndCohortSnIsNotNull();
    List<User> findByEnabledTrueAndCompanySnIsNotNullAndCohortSnIsNotNull();

    @Override
    List<User> findAll();

    Optional<User> findByNameAndUserTelno(String name, String userTelno);

    List<User> findByCompanySnAndRoleType(Long companySn, Long roleType);

    @Query("""
    SELECT u
    FROM User u
    WHERE u.cohortSn = :cohortSn
      AND u.companySn = :companySn
      AND u.roleType = :roleType
""")
    List<User> findUsersByCompanyAndCohortAndRole(
            @Param("cohortSn") Long cohortSn,
            @Param("companySn") Long companySn,
            @Param("roleType") Long roleType
    );
}