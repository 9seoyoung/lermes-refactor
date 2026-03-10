package com.kdt.KDT_PJT.bbs.enums;

public enum BbsRole {
    SUPER_ADMIN {
        @Override public boolean canCreate(BbsType type) { return true; }
        @Override public boolean canRead(BbsType type) { return true; }
        @Override public boolean canUpdate(BbsType type) { return true; }
        @Override public boolean canDelete(BbsType type) { return true; }
    },

    TENANT {
        @Override public boolean canCreate(BbsType type) {
            return switch (type) {
                case NOTICE, FAQ, QNA, CLASS_MATERIAL-> true;
                default -> false;
            };
        }
        @Override public boolean canRead(BbsType type) { return true; }
        @Override public boolean canUpdate(BbsType type) {
            return switch (type) {
                case NOTICE, FAQ, QNA, CLASS_MATERIAL -> true;
                default -> false;
            };
        }
        @Override public boolean canDelete(BbsType type) {
            return switch (type) {
                case NOTICE, FAQ, QNA, CLASS_MATERIAL -> true;
                default -> false;
            };
        }
    },

    EMPLOYEE {
        @Override public boolean canCreate(BbsType type) {
            return switch (type) {
                case NOTICE, FAQ, QNA, CLASS_MATERIAL -> true;
                default -> false;
            };
        }
        @Override public boolean canRead(BbsType type) {
            return switch (type) {
                case NOTICE, FAQ, QNA, CLASS_MATERIAL -> true;
                default -> false;
            };
        }

        @Override public boolean canUpdate(BbsType type) {
            return switch (type) {
                case NOTICE, FAQ, QNA, CLASS_MATERIAL  -> true;
                default -> false;
            };
        }
        @Override public boolean canDelete(BbsType type) {
            return switch (type) {
                case NOTICE, FAQ, QNA, CLASS_MATERIAL -> true;
                default -> false;
            };
        }
    },

    INSTRUCTOR {
        @Override public boolean canCreate(BbsType type) {
            return switch (type) {
                case CLASS_MATERIAL, QNA -> true;
                default -> false;
            };
        }
        @Override public boolean canRead(BbsType type) { return true; }

        @Override public boolean canUpdate(BbsType type) {
            return switch (type) {
                case CLASS_MATERIAL, QNA  -> true;
                default -> false;
            };
        }
        @Override public boolean canDelete(BbsType type) {
            return switch (type) {
                case CLASS_MATERIAL, QNA -> true;
                default -> false;
            };
        }
    },

    STUDENT {
        @Override public boolean canCreate(BbsType type) {
            return switch (type) {
                case CLASS_MATERIAL, QNA -> true;
                default -> false;
            };
        }
        @Override public boolean canRead(BbsType type) { return true; }

        @Override public boolean canUpdate(BbsType type) {
            return switch (type) {
                case CLASS_MATERIAL, QNA -> true;
                default -> false;
            };
        }
        @Override public boolean canDelete(BbsType type) {
            return switch (type) {
                case CLASS_MATERIAL, QNA -> true;
                default -> false;
            };
        }
    },

    GENERAL {
        @Override public boolean canCreate(BbsType type) { return type == BbsType.QNA; }
        @Override public boolean canRead(BbsType type) {
            return switch (type) {
                case NOTICE, QNA, FAQ -> true;
                default -> false;
            };
        }
        @Override public boolean canUpdate(BbsType type) {
            return type == BbsType.QNA;   // QNA는 본인 글 수정 가능
        }
        @Override public boolean canDelete(BbsType type) { return false; }
    },

    VISITOR {
        @Override public boolean canCreate(BbsType type) { return false; } // 글 작성 불가
        @Override public boolean canRead(BbsType type) {
            return type == BbsType.NOTICE || type == BbsType.FAQ; // 공지 + FAQ 열람 가능
        }
        @Override public boolean canUpdate(BbsType type) { return false; }
        @Override public boolean canDelete(BbsType type) { return false; }
    };

    // 공통 메서드
    public abstract boolean canCreate(BbsType type);
    public abstract boolean canRead(BbsType type);
    public abstract boolean canUpdate(BbsType type);
    public abstract boolean canDelete(BbsType type);

   // DB roleType(숫자) → Enum 변환 메서드
    public static BbsRole fromCode(Long roleId) { //수정됨 (Long 지원)
        if (roleId == null) return VISITOR;
        return fromCode(roleId.intValue()); // int 버전 호출
    }


    // DB roleType(숫자) → Enum 변환 메서드
    public static BbsRole fromCode(int roleId) {
        return switch (roleId) {
            case 1 -> SUPER_ADMIN;
            case 2 -> TENANT;
            case 3 -> EMPLOYEE;
            case 4 -> INSTRUCTOR;
            case 5 -> STUDENT;
            case 6 -> GENERAL;
            default -> VISITOR; // Unknown 안전 fallback
        };
    }
}
