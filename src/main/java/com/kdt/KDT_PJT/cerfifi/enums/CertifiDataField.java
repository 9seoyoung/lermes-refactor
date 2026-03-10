package com.kdt.KDT_PJT.cerfifi.enums;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public enum CertifiDataField {

    // 필드명(DB 컬럼명 역할), 표시명(UI 표시 역할)
    COHORT_NM("TB_COHORT.COHORT_NM", "기수명"),
    CRCLM_NM("TB_COHORT.CRCLM_NM", "기수 커리큘럼명"),
    CRCLM_BGNG_YMD("TB_COHORT.CRCLM_BGNG_YMD", "기수 시작일"),
    CRCLM_END_YMD("TB_COHORT.CRCLM_END_YMD", "기수 종료일");



    // 필요하다면 다른 정보 필드도 추가 가능 (예: 교육생 이름 등)
    // USER_NM("TB_USER.USER_NM", "교육생 이름");

    private final String dbColumnName; // Mybatis 조인 쿼리에 사용될 실제 컬럼 경로/별칭
    private final String frontName; // 프론트엔드/UI에서 보여줄 이름

    // 생성자 정의
    CertifiDataField(String dbColumnName, String frontName) {
        this.dbColumnName = dbColumnName;
        this.frontName = frontName;
    }

    public String getColumnName() {
        return dbColumnName;
    }

    public String getFrontName() {
        return frontName;
    }

    /**
     * TB_CERTIFI_TYPE.CERTIFI_DATA_FIELDS 값(쉼표 구분 문자열)을 파싱하여 Enum 목록으로 반환하는 정적 메서드
     */
    public static List<CertifiDataField> fromDbString(String fieldString) {
        if (fieldString == null || fieldString.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.stream(fieldString.split(","))
                .map(String::trim)
                .map(fieldCode -> {
                    try {
                        // 문자열 코드를 Enum 상수로 변환
                        return CertifiDataField.valueOf(fieldCode);
                    } catch (IllegalArgumentException e) {
                        // 정의되지 않은 코드가 DB에 있을 경우 처리 (예: 경고 로깅 후 null 반환 또는 예외 발생)
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * Enum 리스트를 DB 저장을 위한 쉼표 구분 문자열로 변환하는 정적 메서드
     * 예: [COHORT_NM, CRCLM_BGNG_YMD] -> "COHORT_NM,CRCLM_BGNG_YMD"
     */
    public static String toDbString(List<CertifiDataField> selectedFields) {
        if (selectedFields == null || selectedFields.isEmpty()) {
            return "";
        }
        return selectedFields.stream()
                .map(CertifiDataField::name) // Enum 객체 -> 상수 이름 String
                .collect(Collectors.joining(",")); // 쉼표로 연결
    }
}
