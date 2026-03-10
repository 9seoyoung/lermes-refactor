package com.kdt.KDT_PJT.cohortmem.dto;

import lombok.Data;

@Data
public class CohortMemberDto {
        private Long userSn;
        private String name;        // User.name
        private String phone;       // User.userTelno
        private String email;       // User.email
        private String cohortName;  // Cohort.cohortName
        private String crclmName;   // Cohort.CRCLM_NM
        private Boolean aprwStts;  // CohortMemberStts.aprwStts
        private Long rspnsSn;
        private String cohortMemStts;
}
