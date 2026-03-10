package com.kdt.KDT_PJT.bbs.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum BbsScope {
    PUBLIC("전체공개"),
    COMPANY("회사공개"),
    COHORT("그룹공개"),
    PRIVATE("비공개");     //임시저장

    private final String description;
    // JSON 직렬화 시 한글(description)으로 반환
    @JsonValue
    public String getDescription() {
        return description;
    }
    // JSON 역직렬화 시 한글(description) 기준으로 매핑
    @JsonCreator
    public static BbsScope fromDescription(String description) {
        for (BbsScope scope : BbsScope.values()) {
            if (scope.getDescription().equals(description)) {
                return scope;
            }
        }
        throw new IllegalArgumentException("열람권한이 없슴니다.: " + description);
    }
}
