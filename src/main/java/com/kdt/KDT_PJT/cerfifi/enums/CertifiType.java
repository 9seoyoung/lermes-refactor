package com.kdt.KDT_PJT.cerfifi.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/*
Enum 사용법
CertifiType.EDU                 ->  숫자로 구분됨 (사용안할거임)
CertifiType.EDU.name()          ->	"EDU" (String)
CertifiType.EDU.getFrontName()  ->  "교육진행확인서" (String)
*/
public enum CertifiType {
    EDU("교육진행확인서"),
    COMPLETE("수료증");

    private final String frontName;

    CertifiType(String frontName){ // 생성자
        this.frontName = frontName;
    }

    public String getFrontName() {
        return frontName;
    }

    // JSON이 "교육진행확인서" 같은 문자열로 올 때만 매핑
    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    public static CertifiType fromJson(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("증명서 유형(한글명)은 필수입니다.");
        }
        for (CertifiType t : values()) {
            if (t.frontName.equals(value.trim())) return t;
        }
        throw new IllegalArgumentException("유효하지 않은 증명서 유형: " + value);
    }

    // 응답(JSON)으로 "교육진행확인서"/"수료증"을 그대로 내보냄
    @JsonValue
    public String toJson() {
        return this.getFrontName();
    }



}
