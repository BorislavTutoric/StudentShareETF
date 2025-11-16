/*package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;


import jakarta.persistence.*;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "MATERIJAL")
public class Material {

    @Id
    @Column(name = "MaterijalId")
    private Integer materialId;

    @Column(name = "PredmetId")
    private Integer subjectId;

    @ManyToOne
    @MapsId
    @JoinColumn(name = "PredmetId")
    private Subject subject;

    @Column(name = "StudentId")
    private Integer studentId;

    @ManyToOne
    @MapsId
    @JoinColumn(name = "StudentId")
    private Student student;

    @Column(name = "ModeratorId")
    private Integer moderatorId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "ModeratorId")
    private User moderator;

    @Column(name = "file_key")
    private String fileKey;

    @Column(name = "Naziv")
    private String name;

    @Column(name = "Opis")
    private String description;

    @Column(name = "DatumPostavljanja")
    private LocalDateTime date;

    @Column(name = "Kategorija")
    private String category;

    @Column(name = "Odobren")
    private boolean approved;

    public Material() {}

    public Integer getMaterialId() {
        return materialId;
    }
    public void setMaterialId(Integer materialId) {
        this.materialId = materialId;
    }

    public Integer getSubjectId() {
        return subjectId;
    }
    public void setSubjectId(Integer subjectId) {
        this.subjectId = subjectId;
    }

    public Integer getStudentId(){
        return studentId;
    }
    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public Integer getModeratorId(){
        return moderatorId;
    }
    public void setModeratorId(Integer moderatorId) {
        this.moderatorId = moderatorId;
    }

    public String getFileKey() {
        return fileKey;
    }
    public void setFileKey(String fileKey) {
        this.fileKey = fileKey;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDate() {
        return date;
    }
    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isApproved() {
        return approved;
    }
    public void setApproved(boolean approved) {
        this.approved = approved;
    }
}
**/