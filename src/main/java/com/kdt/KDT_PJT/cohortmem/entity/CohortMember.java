package com.kdt.KDT_PJT.cohortmem.entity;

import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "TB_COHORT_MEMBER")
@IdClass(CohortMemberId.class)  // 복합키

public class CohortMember {

    @Id
    @Column(name = "COHORT_SN")
    private Long cohortSn;

    @Id
    @Column(name = "USER_SN")
    private Long userSn;

    @Column(name = "USER_AUTHRT_SN")
    private Long userAuthrtSn;

    @Enumerated(EnumType.STRING)
    @Column(name = "COHORT_MEM_STTS")
    private CohortMemberStts cohortMemStts;

    @Column(name = "APLY_DT")
    private LocalDateTime aplyDt;

    @Column(name = "APRV_DT")
    private LocalDateTime aprvDt;

    // 연관관계 (읽기용, 수정/등록 안 함)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COHORT_SN", insertable = false, updatable = false)
    private Cohort cohort;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_SN", insertable = false, updatable = false)
    private User user;
}
