package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.compositeKeys;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class MajorSubjectId implements Serializable {

    private Integer subjectId;
    private Integer majorId;

    public MajorSubjectId() {}

    public MajorSubjectId(Integer subjectId, Integer majorId) {
        this.subjectId = subjectId;
        this.majorId = majorId;
    }

    public Integer getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Integer subjectId) {
        this.subjectId = subjectId;
    }

    public Integer getMajorId() {
        return majorId;
    }

    public void setMajorId(Integer majorId) {
        this.majorId = majorId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MajorSubjectId)) return false;
        MajorSubjectId that = (MajorSubjectId) o;
        return Objects.equals(subjectId, that.subjectId) &&
                Objects.equals(majorId, that.majorId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(subjectId, majorId);
    }

    @Override
    public String toString() {
        return "MajorSubjectId{" +
                "subjectId=" + subjectId +
                ", majorId=" + majorId +
                '}';
    }
}

