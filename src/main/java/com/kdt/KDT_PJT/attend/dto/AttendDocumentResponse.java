// src/main/java/com/kdt/KDT_PJT/attend/dto/AttendDocumentResponse.java
package com.kdt.KDT_PJT.attend.dto;

import com.kdt.KDT_PJT.attend.entity.AttendDocument;
import com.kdt.KDT_PJT.attend.entity.AttendDtlTypeNm;
import com.kdt.KDT_PJT.attend.entity.AprvSttsNm;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendDocumentResponse {

    private AttendDtlTypeNm attendDtlTypeNm;  // 유형
    private String rmrkCn;                    // 사유
    private LocalDate bgngDt;                 // 시작일
    private LocalDate endDt;                  // 종료일
    private AprvSttsNm aprvSttsNm;            // 승인상태
    private LocalDateTime createdAt;          // 생성일(신청일)
    private boolean hasFile;                  // 첨부 유무
    private Long fileSn;                      // 첨부파일 번호

    public static AttendDocumentResponse from(AttendDocument d) {
        return AttendDocumentResponse.builder()
                .attendDtlTypeNm(d.getAttendDtlTypeNm())
                .rmrkCn(d.getRmrkCn())
                .bgngDt(d.getBgngDt())
                .endDt(d.getEndDt())
                .aprvSttsNm(d.getAprvSttsNm())
                .createdAt(d.getRgstDt())
                .hasFile(d.getFileSn() != null)
                .fileSn(d.getFileSn())
                .build();
    }
}
