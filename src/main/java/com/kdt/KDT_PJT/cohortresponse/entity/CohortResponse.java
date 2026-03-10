package com.kdt.KDT_PJT.cohortresponse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "TB_RESPONSE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CohortResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RSPNS_SN")
    private Long rspnsSn;

    @Column(name = "PARENT_TYPE")
    private String parentType;

    @Column(name = "PARENT_SN")
    private Integer parentSn;

    @Column(name = "USER_SN")
    private Integer userSn;

    @Column(name = "RSPNS_DT")
    private LocalDateTime rspnsDt;

    @Column(name = "RSPNS_CN", columnDefinition = "json")
    private String rspnsCn;

    @Column(name = "VIEW_CNT")
    private Integer viewCnt;

    @Column(name = "DEL_YN")
    private Boolean delYn;

    @Column(name = "FORM_UUID")
    private String formUuid;
}
