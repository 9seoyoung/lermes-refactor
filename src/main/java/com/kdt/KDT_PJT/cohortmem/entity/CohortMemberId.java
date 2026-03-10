package com.kdt.KDT_PJT.cohortmem.entity;

import java.io.Serializable;
import java.util.Objects;

public class CohortMemberId implements Serializable {
    private Long cohortSn;
    private Long userSn;

    public CohortMemberId() {}

    public CohortMemberId(Long cohortSn, Long userSn) {
        this.cohortSn = cohortSn;
        this.userSn = userSn;
    }

    // equals & hashCode 필수
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CohortMemberId)) return false;
        CohortMemberId that = (CohortMemberId) o;
        return Objects.equals(cohortSn, that.cohortSn) &&
                Objects.equals(userSn, that.userSn);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cohortSn, userSn);
    }
}
