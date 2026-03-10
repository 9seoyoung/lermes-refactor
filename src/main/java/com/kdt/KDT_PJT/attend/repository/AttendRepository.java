package com.kdt.KDT_PJT.attend.repository;

import com.kdt.KDT_PJT.attend.entity.Attend;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AttendRepository extends JpaRepository<Attend, Long> {
    Optional<Attend> findByUserSnAndInoutYnAndAttendTmBetween(
            Long userSn, boolean inoutYn,
            LocalDateTime start, LocalDateTime end
    );

    Optional<Attend> findByUserSn(Long userSn);

    Optional<List<Attend>> findByCohortSnAndAttendTmBetween(
            Long cohortSn, LocalDateTime start, LocalDateTime end
    );
}