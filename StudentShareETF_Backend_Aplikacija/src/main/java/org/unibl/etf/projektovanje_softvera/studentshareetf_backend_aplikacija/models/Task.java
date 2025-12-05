package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "OBAVEZA")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ObavezaId")
    private Integer id;

    @Column(name = "Naslov",nullable = false)
    String naslov;

    @Column(name = "Opis")
    String opis;

    @Column(name = "DatumVrijeme",nullable = false)
    LocalDateTime datumVrijeme;

    @ManyToOne
    @JoinColumn(name = "StudentId",nullable = false)
    private Student student;

    public Task() {}

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getNaslov() {
        return naslov;
    }
    public void setNaslov(String naslov) {
        this.naslov = naslov;
    }
    public String getOpis() {
        return opis;
    }
    public void setOpis(String opis) {
        this.opis = opis;
    }
    public LocalDateTime getDatumVrijeme() {
        return datumVrijeme;
    }
    public void setDatumVrijeme(LocalDateTime datumVrijeme) {
        this.datumVrijeme = datumVrijeme;
    }
    public Student getStudent() {
        return student;
    }
    public void setStudent(Student student) {
        this.student = student;
    }

}
