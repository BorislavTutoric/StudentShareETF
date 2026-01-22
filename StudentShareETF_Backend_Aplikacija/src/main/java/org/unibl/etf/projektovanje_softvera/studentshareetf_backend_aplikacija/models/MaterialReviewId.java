package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import java.io.Serializable;
import java.util.Objects;

public class MaterialReviewId implements Serializable {
    private Integer materijalId;
    private Integer studentId;

    public MaterialReviewId() {}

    public MaterialReviewId(Integer materijalId, Integer studentId) {
        this.materijalId = materijalId;
        this.studentId = studentId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MaterialReviewId)) return false;
        MaterialReviewId that = (MaterialReviewId) o;
        return Objects.equals(materijalId, that.materijalId) &&
                Objects.equals(studentId, that.studentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(materijalId, studentId);
    }

    public Integer getMaterijalId() { return materijalId; }
    public void setMaterijalId(Integer materijalId) { this.materijalId = materijalId; }
    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }
}