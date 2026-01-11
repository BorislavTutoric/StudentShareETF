package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.compositeKeys;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class SavedMaterialId implements Serializable {

    private Integer materialId;
    private Integer studentId;

    public SavedMaterialId() {
    }

    public SavedMaterialId(Integer materialId, Integer studentId) {
        this.materialId = materialId;
        this.studentId = studentId;
    }

    public Integer getMaterialId() {
        return materialId;
    }

    public void setMaterialId(Integer materialId) {
        this.materialId = materialId;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SavedMaterialId that = (SavedMaterialId) o;
        return Objects.equals(materialId, that.materialId) &&
                Objects.equals(studentId, that.studentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(materialId, studentId);
    }
}
