// src/main/java/com/kdt/KDT_PJT/attend/dto/AttendAdjustCreateRequest.java
package com.kdt.KDT_PJT.attend.dto;

import com.kdt.KDT_PJT.attend.entity.AttendDtlTypeNm; // SICK/VACATION/OFFICIAL/OUTING
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

/**
 * 출결 인정 요청 생성용 DTO
 * - 회사/기수/사용자 식별자는 Authentication에서 추출
 * - 파일은 업로드 선행 후 fileSn(그룹/파일 식별자)만 전달
 */
@Getter
@Setter
@ToString
public class AttendAdjustCreateRequest {

    /** 출결유형(병가/휴가/공가/외출) */
    @NotNull
    private AttendDtlTypeNm attendDtlTypeNm;

    /** 신청 시작일 (필수) */
    @NotNull
    private LocalDate bgngDt;

    /** 신청 종료일 (선택, null이면 시작일과 동일 처리) */
    private LocalDate endDt;

    /** 사유 (최대 50자) */
    @Size(max = 50)
    private String stuRmrkCn;

    /** 증빙자료 식별자(선택: 파일 업로드 후 받은 fileSn) */
    private Long fileSn;

    /** 컨트롤러/서비스에서 편하게 쓰라고 제공: endDt가 없으면 시작일 반환 */
    public LocalDate resolvedEndDt() {
        return endDt != null ? endDt : bgngDt;
    }
}
