package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.compositeKeys.SavedMaterialId;

@Entity
@Table(name = "SACUVAN_MATERIJAL")
public class SavedMaterial {

    @EmbeddedId
    private SavedMaterialId id;

    @ManyToOne
    @MapsId("materialId")
    @JoinColumn(name = "MaterijalId")
    private Material material;

    @ManyToOne
    @MapsId("studentId")
    @JoinColumn(name = "StudentId")
    private Student student;

    public SavedMaterial(){}

    public SavedMaterial(Material material, Student student) {
        this.material = material;
        this.student = student;
        this.id = new SavedMaterialId(material.getMaterialId(), student.getUserId());
    }

    public SavedMaterialId getId() {
        return id;
    }
    public void setId(SavedMaterialId id) {
        this.id = id;
    }
    public Material getMaterial() {
        return material;
    }
    public void setMaterial(Material material) {
        this.material = material;
    }
    public Student getStudent() {
        return student;
    }
    public void setStudent(Student student) {
        this.student = student;
    }

}
