package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "RECENZIJA_MATERIJALA")
@IdClass(MaterialReviewId.class)
public class MaterialReview {

    @Id
    @Column(name = "MaterijalId")
    private Integer materijalId;

    @ManyToOne
    @MapsId
    @JoinColumn(name = "MaterijalId")
    private Material materijal;

    @Id
    @Column(name = "KorisnikId")
    private Integer studentId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "KorisnikId")
    private User user;

    @Column(name = "Ocjena", nullable = false)
    private Integer ocjena;

    @Column(name = "DatumVrijeme", nullable = false)
    private LocalDateTime datumVrijeme;


    public MaterialReview() {
    }

    public MaterialReview(Integer review, LocalDateTime dateTime, Material material, User user) {
        this.ocjena = review;
        this.datumVrijeme = dateTime;
        this.materijal = material;
        this.user = user;
        this.materijalId = material.getMaterialId();
        this.studentId = user.getUserId();
    }

    public Integer getMaterialId() {return  this.materijalId;}
    public void setMaterialId(Integer materialId) {this.materijalId = materialId;}
    public Material getMaterial() {return this.materijal;}
    public void setMaterial(Material material) {this.materijal = material;}
    public Integer getStudentId() {return this.studentId;}
    public void setStudentId(Integer studentId) {this.studentId = studentId;}
    public User getUser() {return this.user;}
    public void setUser(User user) {this.user = user;}
    public Integer getOcjena() {return this.ocjena;}
    public void setOcjena(Integer ocjena) {this.ocjena = ocjena;}
    public LocalDateTime getDatumVrijeme() { return this.datumVrijeme;}
    public void setDatumVrijeme(LocalDateTime datum){this.datumVrijeme = datum;}
}