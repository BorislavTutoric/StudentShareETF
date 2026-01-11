package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.utils;

public class MajorSubjectUtil {
    private final Integer majorId;
    private final Integer subjectId;

    public MajorSubjectUtil(Integer majorId, Integer subjectId) {
        this.majorId = majorId;
        this.subjectId = subjectId;
    }

    public Integer getMajorId() {
        return majorId;
    }

    public Integer getSubjectId() {
        return subjectId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MajorSubjectUtil)) return false;
        MajorSubjectUtil that = (MajorSubjectUtil) o;
        return majorId.equals(that.majorId) && subjectId.equals(that.subjectId);
    }

    @Override
    public int hashCode() {
        return 31 * majorId.hashCode() + subjectId.hashCode();
    }
}

