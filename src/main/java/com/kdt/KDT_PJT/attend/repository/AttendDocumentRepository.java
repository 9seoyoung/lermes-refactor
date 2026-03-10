package com.kdt.KDT_PJT.attend.repository;

import com.kdt.KDT_PJT.attend.entity.AprvSttsNm;
import com.kdt.KDT_PJT.attend.entity.AttendDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendDocumentRepository extends JpaRepository<AttendDocument, Long> {
    Page<AttendDocument> findByUserSnOrderByAttendDcmntSnDesc(Long userSn, Pageable pageable);

    Page<AttendDocument> findByCoSn(Long companySn, Pageable pageable);

    long countByCoSnAndAprvSttsNm(Long companySn, AprvSttsNm aprvSttsNm);
}
