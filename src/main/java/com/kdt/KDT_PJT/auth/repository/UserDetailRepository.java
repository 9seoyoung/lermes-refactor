package com.kdt.KDT_PJT.auth.repository;

import com.kdt.KDT_PJT.auth.entity.UserDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDetailRepository extends JpaRepository<UserDetail, Long> {
    Optional<UserDetail> findByUserSn(Long userSn);
}
