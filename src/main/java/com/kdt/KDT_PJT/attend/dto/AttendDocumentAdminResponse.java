// src/main/java/com/kdt/KDT_PJT/attend/dto/AttendDocumentAdminResponse.java
package com.kdt.KDT_PJT.attend.dto;

import com.kdt.KDT_PJT.attend.entity.AprvSttsNm;
import com.kdt.KDT_PJT.attend.entity.AttendDtlTypeNm;
import com.kdt.KDT_PJT.attend.entity.AttendDocument;
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
public class AttendDocumentAdminResponse {
    private Long attendDcmntSn;
    private AttendDtlTypeNm attendDtlTypeNm;
    private String cohortName;
    private String userName;
    private String rmrkCn;
    private LocalDate bgngDt;
    private LocalDate endDt;
    private boolean hasFile;
    private AprvSttsNm aprvSttsNm;
    private LocalDateTime createdAt;
    private Long fileSn;

    public static AttendDocumentAdminResponse from(AttendDocument d, String cohortName, String userName) {
        return AttendDocumentAdminResponse.builder()
                .attendDcmntSn(d.getAttendDcmntSn())
                .attendDtlTypeNm(d.getAttendDtlTypeNm())
                .cohortName(cohortName)
                .userName(userName)
                .rmrkCn(d.getRmrkCn())
                .bgngDt(d.getBgngDt())
                .endDt(d.getEndDt())
                .hasFile(d.getFileSn() != null)
                .aprvSttsNm(d.getAprvSttsNm())
                .createdAt(d.getRgstDt())
                .fileSn(d.getFileSn())
                .build();
    }
}
