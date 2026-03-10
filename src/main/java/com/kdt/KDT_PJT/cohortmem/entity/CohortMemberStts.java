package com.kdt.KDT_PJT.cohortmem.entity;

import lombok.Getter;

@Getter
public enum CohortMemberStts {

    // 각 enum 상수는 (DB 코드값, 한글 설명)을 포함함
    APPLIED(1, "수강신청"),
    ENROLLED(2, "수강등록"),
    CANCELED(3, "강의시작전취소"),
    WITHDRAWN(4, "강의 중도 하차"),
    ONGOING(5, "강의 진행중"),
    COMPLETED(6, "강의수료"),
    DENIED(7, "수강신청승인거부");

    // DB에 저장된 숫자 코드 (1~6)
    private final int code;

    // 화면이나 API 응답에서 보여줄 한글 상태명
    private final String description;

    // 생성자
    CohortMemberStts(int code, String description) {
        this.code = code;
        this.description = description;
    }

    // DB에서 코드값을 읽었을 때 enum으로 변환하는 메서드
    public static CohortMemberStts fromCode(int code) {
        for (CohortMemberStts status : values()) {
            if (status.getCode() == code) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid CohortMemberStts code: " + code);
    }
}

