package com.kdt.KDT_PJT.companymem.repository;

import com.kdt.KDT_PJT.companymem.entity.CompanyMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompanyMemberRepository extends JpaRepository<CompanyMember, Long> {

    List<CompanyMember> findByCompanySn(Long companySn);

    List<CompanyMember> findByUserSn(Long userSn);

    boolean existsByUserSnAndCompanySn(Long userSn, Long companySn);
}
