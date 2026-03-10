package com.kdt.KDT_PJT.survey.enums;

import static java.lang.Boolean.TRUE;

public enum SurveyRole {

    SUPER_ADMIN {
        @Override public boolean canCreate(SurveyScope scope) { return scope == SurveyScope.COHORT; }
        @Override public boolean canRespond(SurveyScope scope) { return false; } // 응답 안 함
        @Override public boolean canView(SurveyScope scope) { return true; }
        @Override public boolean canDelete(SurveyScope scope, boolean isOwner) { return true; }
    },
    TENANT_ADMIN {
        @Override public boolean canCreate(SurveyScope scope) { return scope == SurveyScope.COHORT; }
        @Override public boolean canRespond(SurveyScope scope) { return false; }// 응답 안 함
        @Override public boolean canView(SurveyScope scope) { return true; }
        @Override public boolean canDelete(SurveyScope scope, boolean isOwner) { return true; }
    },
    EMPLOYEE {
        @Override public boolean canCreate(SurveyScope scope) { return scope == SurveyScope.COHORT; }
        @Override public boolean canRespond(SurveyScope scope) { return false; } // 응답 안 함
        @Override public boolean canView(SurveyScope scope) { return scope == SurveyScope.COHORT; }
        @Override public boolean canDelete(SurveyScope scope, boolean isOwner) {
            // 자신이 만든 설문이거나, 회사 단위(COHORT) 설문이면 삭제 가능
            return isOwner || scope == SurveyScope.COHORT;
        }
    },
    INSTRUCTOR {
        @Override public boolean canCreate(SurveyScope scope) { return scope == SurveyScope.INTERNAL; }
        @Override public boolean canRespond(SurveyScope scope) { return scope == SurveyScope.INTERNAL; }
        @Override public boolean canView(SurveyScope scope) { return scope == SurveyScope.INTERNAL; }
        @Override public boolean canDelete(SurveyScope scope, boolean isOwner) {
            // 자기 설문이거나, INTERNAL 범위 설문은 삭제 가능
            return isOwner || scope == SurveyScope.INTERNAL;
        }
    },
    STUDENT {
        @Override public boolean canCreate(SurveyScope scope) { return scope == SurveyScope.INTERNAL; }
        @Override public boolean canRespond(SurveyScope scope) { return scope == SurveyScope.COHORT || scope == SurveyScope.INTERNAL; }
        @Override public boolean canView(SurveyScope scope) { return scope == SurveyScope.COHORT || scope == SurveyScope.INTERNAL; }
        @Override public boolean canDelete(SurveyScope scope, boolean isOwner) {
            // 학생은 자기가 만든 설문만 삭제 가능
            return isOwner;
        }
    };

    public abstract boolean canCreate(SurveyScope scope);
    public abstract boolean canRespond(SurveyScope scope);
    public abstract boolean canView(SurveyScope scope);
    public abstract boolean canDelete(SurveyScope scope, boolean isOwner);

    // DB roleType(숫자) → Enum 변환
    public static SurveyRole fromCode(Long roleId) {
        return switch (roleId.intValue()) {
            case 1 -> SUPER_ADMIN;
            case 2 -> TENANT_ADMIN;
            case 3 -> EMPLOYEE;
            case 4 -> INSTRUCTOR;
            case 5 -> STUDENT;
            default -> throw new IllegalArgumentException("Unknown roleId: " + roleId);
        };
    }
    public boolean isAdmin() {
        return this == SUPER_ADMIN || this == TENANT_ADMIN;
    }
}
