package com.kdt.KDT_PJT.attend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "TB_ATTEND")
@Getter @Setter
@Builder
@NoArgsConstructor @AllArgsConstructor
public class Attend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ATTEND_SN")
    private Long attendSn;      // PK

    @Column(name = "USER_SN", nullable = false)
    private Long userSn;        // 사용자 PK

    @Column(name = "CO_SN", nullable = false)
    private Long coSn;          // 회사 PK

    @Column(name = "COHORT_SN", nullable = false)
    private Long cohortSn;          // 기수 PK

    @Column(name = "INOUT_YN", nullable = false)
    private Boolean inoutYn;    // 출석 여부(TINYINT(1) 매핑)

    @Column(name = "ATTEND_TM", nullable = false)
    private LocalDateTime attendTm; // 출석 시간

    @Column(name = "MDFR_SN")
    private Long mdfrSn;        // 수정자 PK(옵션)

    @UpdateTimestamp
    @Column(name = "LAST_MDFCN_DT")
    private LocalDateTime lastMdfcnDt; // 마지막 수정 시간(자동)
}
