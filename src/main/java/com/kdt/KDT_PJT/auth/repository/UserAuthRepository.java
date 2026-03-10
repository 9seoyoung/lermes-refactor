package com.kdt.KDT_PJT.auth.repository;

import com.kdt.KDT_PJT.auth.entity.UserAuthrt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAuthRepository extends JpaRepository<UserAuthrt, Long> {
}
