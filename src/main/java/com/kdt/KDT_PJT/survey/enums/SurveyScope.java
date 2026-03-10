package com.kdt.KDT_PJT.survey.enums;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor

public enum SurveyScope {

    COHORT("기수전체"),        //테넌트, 직원, 수강생 전용
    INTERNAL("그룹공개");      //강사, 수강생 전용

    private final String description;

    // 역직렬화: JSON → Enum
    @JsonCreator
    public static SurveyScope from(String value) {
        for (SurveyScope scope : SurveyScope.values()) {
            if (scope.description.equals(value)) {
                return scope;
            }
        }
        throw new IllegalArgumentException("잘못된 설문 범위: " + value);
    }

    // 직렬화: Enum → JSON
    @JsonValue
    public String toJson() {
        return description;
    }

}