package com.kdt.KDT_PJT.attend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "TB_ATTEND_DOCUMENT")
@EntityListeners(AuditingEntityListener.class)
@Builder
public class AttendDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ATTEND_DCMNT_SN")
    private Long attendDcmntSn;

    // 신청자
    @Column(name = "USER_SN", nullable = false)
    private Long userSn;

    // 시작일(단일일자면 시작=종료 동일)
    @Column(name = "BGNG_DT", nullable = false)
    private LocalDate bgngDt;

    // 종료일
    @Column(name = "END_DT", nullable = false)
    private LocalDate endDt;

    // 출결 상세 유형(병가/휴가/공가/외출 등) - 문자열 코드
    @Enumerated(EnumType.STRING)
    @Column(name = "ATTEND_DTL_TYPE_NM", nullable = false, length = 10)
    private AttendDtlTypeNm attendDtlTypeNm;

    // 승인 상태 코드/이름 (DB 기본값 '1'로 보임)
    @Enumerated(EnumType.STRING)
    @Column(name = "APRV_STTS_NM", nullable = false, length = 10)
    private AprvSttsNm aprvSttsNm;

    // 승인자(없을 수 있음)
    @Column(name = "AUTZR_SN")
    private Long autzrSn;

    // 사유(비고)
    @Column(name = "RMRK_CN", length = 4000)
    private String rmrkCn;

    // 첨부 파일 식별자
    @Column(name = "FILE_SN")
    private Long fileSn;

    // 승인 일시(없을 수 있음)
    @Column(name = "APRV_DT")
    private LocalDateTime aprvDt;

    // 회사 식별자
    @Column(name = "CO_SN", nullable = false)
    private Long coSn;

    // 기수 식별자
    @Column(name = "COHORT_SN", nullable = false)
    private Long cohortSn;

    @Column(name = "STU_RMRK_CN", length = 50)     // 학생 입력 사유
    private String stuRmrkCn;

    @CreatedDate
    @Column(name = "RGST_DT", nullable = false, updatable = false) // 신청일
    private LocalDateTime rgstDt;

    public void approve() {
        this.aprvSttsNm = AprvSttsNm.APPROVED;
    }

    public void reject() {
        this.aprvSttsNm = AprvSttsNm.REJECTED;
    }

    // AttendDocument.java
    public void changeAprvStatus(AprvSttsNm newStatus) {
        this.aprvSttsNm = newStatus;
        this.aprvDt = LocalDateTime.now(); // 승인/반려 시각도 같이 기록하고 싶으면
    }
}
