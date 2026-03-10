package com.kdt.KDT_PJT.cerfifi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.kdt.KDT_PJT.cerfifi.enums.CertifiType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertifiTemplateRequestDTO {
    @JsonIgnore private Integer certifiSn; // 생성된 SN 받을용도
    private CertifiType certifiTypeNm;   // 증명서 유형 명(Enum) 교육진행확인서 -> EDU , 수료증 -> COMPLETE, TB_CERTIFI_TYPE.CERTIFI_TYPE_NM
    private String certifiTtlNm;    // 증명서 제목 명(회사별 증명서 명) ex) A회사의 수료증은 부트캠프 수료증이라고 출력됨
    private String bodyCn;          // 본문 내용
    private Integer tmpltFileSn;    // 서식 파일 일련번호(A4크기 이미지 파일의 SN) 이건 프론트에서 파일SN 보내줘야함
    @JsonIgnore private Integer coSn;  // 회사 일련번호 -> 백에서 넣을거임
}
