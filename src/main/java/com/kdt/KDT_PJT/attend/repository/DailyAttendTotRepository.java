package com.kdt.KDT_PJT.attend.repository;

import com.kdt.KDT_PJT.attend.entity.AttendDtlTypeNm;
import com.kdt.KDT_PJT.attend.entity.DailyAttendTot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Optional;

public interface DailyAttendTotRepository extends JpaRepository<DailyAttendTot, Long> {
    boolean existsByUserSnAndDate(Long userSn, LocalDate date);
    Optional<DailyAttendTot> findByUserSnAndDate(Long userSn, LocalDate date);

    Long countByUserSnAndDateBetweenAndAttendDtlTypeNm(
            Long userSn, LocalDate start, LocalDate end, AttendDtlTypeNm type);

    Long countByUserSnAndDateBetweenAndAttendDtlTypeNmIn(
            Long userSn, LocalDate start, LocalDate end, Collection<AttendDtlTypeNm> types);
}
