package com.kdt.KDT_PJT.cerfifi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Builder
@Data //TODO 증명서 신청한거 출력시 필요한 정보 담아서 보내는거
public class CertifiResponseDTO {
    @JsonIgnore
    private Integer certSn;         //내부용 값, json 안만들어짐
    @JsonIgnore
    private LocalDate issueDt;      //내부용 값, json 안만들어짐

    private String certifiNo;       // 증명서 일련번호 YYYY_00000000(certifiSn을 8자리로 만들어서 붙인거)

}
