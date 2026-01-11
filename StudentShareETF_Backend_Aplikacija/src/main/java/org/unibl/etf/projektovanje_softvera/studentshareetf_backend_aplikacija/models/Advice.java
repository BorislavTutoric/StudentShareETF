package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "POST")
public class Advice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PostId")
    private Integer id;

    @Column(name = "Sadrzaj", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "DatumVrijeme", nullable = false)
    private LocalDateTime dateTime;

    @Column(name = "Prijavljen")
    private boolean reported = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PredmetId", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "StudentId", nullable = false)
    private Student student;

    public Advice() {}

    public Advice(String content, Subject subject, Student student) {
        this.content = content;
        this.subject = subject;
        this.student = student;
        this.dateTime = LocalDateTime.now();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public boolean isReported() {
        return reported;
    }

    public void setReported(boolean reported) {
        this.reported = reported;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }
}