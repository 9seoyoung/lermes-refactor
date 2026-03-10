package com.kdt.KDT_PJT.cohortresponse.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CohortResponseDto {

    private Long rspnsSn;

    @JsonProperty("type")
    private String parentType;

    @JsonProperty("cohortSn")
    private Integer parentSn;

    private Integer userSn;

    private LocalDateTime rspnsDt;

    @JsonProperty("crclmCn")
    private String rspnsCn;

    private Integer viewCnt;

    private Boolean delYn;

    @JsonProperty("id")
    private String formUuid;
}
