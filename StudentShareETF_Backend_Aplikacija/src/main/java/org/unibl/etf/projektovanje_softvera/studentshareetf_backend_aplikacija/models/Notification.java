package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "OBAVJESTENJE")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ObavjestenjeId")
    private Integer id;

    @Column(name = "Naslov", nullable = false)
    private String title;

    @Column(name = "Poruka", nullable = false)
    private String message;

    @Column(name = "Procitano", nullable = false)
    private Boolean read = false;

    @Column(name = "DatumVrijeme", nullable = false)
    private LocalDateTime dateTime;

    @Column(name = "AktivnoOd", nullable = false)
    private LocalDateTime activeFrom;

    @ManyToOne()
    @JoinColumn(name = "StudentId", nullable = false)
    private Student student;

    @Column(name = "AktivnoOd", nullable = false)
    private LocalDateTime aktivnoOd = LocalDateTime.now();

    public Notification() {}

    public Integer getId() {
        return id;
    }
    public void setId(Integer notificationId) {
        this.id = notificationId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getRead() {
        return read;
    }

    public void setRead(Boolean read) {
        this.read = read;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public LocalDateTime getActiveFrom() {
        return activeFrom;
    }

    public void setActiveFrom(LocalDateTime activeFrom) {
        this.activeFrom = activeFrom;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public void setAktivnoOd() {
        this.aktivnoOd = LocalDateTime.now();
    }

    public LocalDateTime getAktivnoOd() {
        return aktivnoOd;
    }
}
