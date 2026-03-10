package com.kdt.KDT_PJT.bbs.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
//import com.kdt.KDT_PJT.survey.mapper.SurveyMapper;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum BbsType {
    NOTICE("공지사항"),
    CLASS_MATERIAL("자료실"),
    FAQ("FAQ"),
    QNA("문의"),
    SURVEY("설문조사");


    private final String description;

    // JSON 직렬화 시 한글(description)으로 반환
    @JsonValue
    public String getDescription() {
        return description;
    }

    // JSON 역직렬화 시 한글(description) 기준으로 매핑
    @JsonCreator
    public static BbsType fromDescription(String description) {
        for (BbsType type : BbsType.values()) {
            if (type.getDescription().equals(description)) {
                return type;
            }
        }
        throw new IllegalArgumentException("없는 게시판 유형입니다.: " + description);
    }
}