package com.kdt.KDT_PJT.company.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyWithStatusDto {

    private Long id;              // 회사 PK
    private String brno;          // 사업자등록번호
    private String name;          // 회사명
    private boolean active;       // 활성여부
    private LocalDateTime registeredAt; // 등록일자
    private Integer fileSn;       // 파일 순번 (null 허용)
    private String companyAddress;         // 회사 소재지
    private String companyAddressDetail;   // 회사 상세주소
    private String companyTel;             // 회사 전화번호
    private String stts; // 코호트 상태(RECRUITING 여부)
}
