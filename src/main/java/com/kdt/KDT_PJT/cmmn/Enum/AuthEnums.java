package com.kdt.KDT_PJT.cmmn.Enum;

public enum AuthEnums {
    REPRESENTATIVE("대표", 2),
    EMPLOYEE("직원", 3),
    INSTRUCTOR("강사", 4),
    STUDENT("학생", 5);

    private final String roleName;
    private final int roleCode;

    AuthEnums(String roleName, int roleCode) {
        this.roleName = roleName;
        this.roleCode = roleCode;
    }

    public String getRoleName() {
        return roleName;
    }

    public int getRoleCode() {
        return roleCode;
    }

    /**
     * 역할 이름(한글)으로 코드 찾기
     */
    public static int getCodeByName(String roleName) {
        for (AuthEnums role : AuthEnums.values()) {
            if (role.getRoleName().equals(roleName)) {
                return role.getRoleCode();
            }
        }
        throw new IllegalArgumentException("유효하지 않은 역할 이름: " + roleName);
    }
}
