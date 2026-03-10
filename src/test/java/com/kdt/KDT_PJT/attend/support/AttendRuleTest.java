package com.kdt.KDT_PJT.attend.support;

import com.kdt.KDT_PJT.attend.entity.AttendDtlTypeNm;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import java.time.LocalTime;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AttendRuleTest {

    // 기본 정책 기준 시간
    static final LocalTime START = LocalTime.of(8, 30);
    static final LocalTime END   = LocalTime.of(17, 30);
    static final LocalTime CUT   = LocalTime.of(12, 30); // 조퇴 컷(기본)

    record Case(String name, LocalTime in, LocalTime out, AttendDtlTypeNm expected) {}

    static Stream<Case> cases() {
        return Stream.of(
                // 절반(4.5h) 경계 테스트
                new Case("정시→12:29 (4h 미만)",  t("08:30"), t("12:29"), AttendDtlTypeNm.ABSENT),
                new Case("정시→12:30 (4h)",      t("08:30"), t("12:30"), AttendDtlTypeNm.ABSENT), // 절반 미달 → 결석
                new Case("정시→13:00 (4.5h)",    t("08:30"), t("13:00"), AttendDtlTypeNm.EARLY_LEAVE), // 절반 충족 + 컷 통과 + 종료 전

                // 출석/조퇴 경계
                new Case("정시→17:29 (종료 직전)", t("08:30"), t("17:29"), AttendDtlTypeNm.EARLY_LEAVE),
                new Case("정시→17:30 (종료)",     t("08:30"), t("17:30"), AttendDtlTypeNm.PRESENT),
                new Case("이른입실→17:30",        t("08:00"), t("17:30"), AttendDtlTypeNm.PRESENT),

                // 지각 케이스
                new Case("지각→종료 전",           t("09:00"), t("17:29"), AttendDtlTypeNm.ABSENT), // 지각+조퇴=결석
                new Case("지각→종료",              t("09:00"), t("17:30"), AttendDtlTypeNm.LATE),

                // 기타
                new Case("입실 없음",              null,       t("12:30"), AttendDtlTypeNm.ABSENT),
                new Case("퇴실 없음",              t("08:30"), null,       AttendDtlTypeNm.ABSENT)
        );
    }

    @ParameterizedTest(name = "{index}. {0}")
    @MethodSource("cases")
    void decide_shouldMatch(Case c) {
        AttendDtlTypeNm result = AttendRule.decide(c.in, c.out, START, END, CUT);
        assertEquals(c.expected, result, c.name);
    }

    private static LocalTime t(String hhmm) {
        String[] p = hhmm.split(":");
        return LocalTime.of(Integer.parseInt(p[0]), Integer.parseInt(p[1]));
    }
}
