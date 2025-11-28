package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;


import jakarta.persistence.*;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "MATERIJAL")
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaterijalId")
    private Integer materialId;

    @ManyToOne
    @JoinColumn(name = "PredmetId")
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "StudentId")
    private Student student;

    @ManyToOne
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

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public User getModerator() {
        return moderator;
    }

    public void setModerator(User moderator) {
        this.moderator = moderator;
    }

    public Integer getMaterialId() {
        return materialId;
    }
    public void setMaterialId(Integer materialId) {
        this.materialId = materialId;
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