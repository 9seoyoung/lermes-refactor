package com.kdt.KDT_PJT.companymem.Dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyMemberDto {
    private Long companyMemberSn;  // nullable in create
    private Long companySn;
    private Long userSn;
    private Long userAuthrtSn;
    private LocalDateTime orgStartDate;
    private LocalDateTime orgEndDate;
    private String userName;
    private String userEmlAddr;
    private String userTelno;
    private LocalDateTime applyDate;
}

