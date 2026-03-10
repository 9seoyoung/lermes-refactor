package com.kdt.KDT_PJT.companymem.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "TB_COMPANY_MEMBER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CO_MEM_SN")
    private Long companyMemberSn;

    @Column(name = "CO_SN", nullable = false)
    private Long companySn;

    @Column(name = "USER_SN", nullable = false)
    private Long userSn;

    @Column(name = "USER_AUTHRT_SN", nullable = false)
    private Long userAuthrtSn;

    @Column(name = "OGDP_BGNG_DT")
    private LocalDateTime orgStartDate;

    @Column(name = "OGDP_END_DT")
    private LocalDateTime orgEndDate;

    @Column(name = "APLY_DT")
    private LocalDateTime applyDate;

}

