package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

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

    @Column(name = "Poruka", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "Procitano", nullable = false)
    private boolean read;

    @Column(name = "DatumVrijeme", nullable = false)
    private LocalDateTime dateTime;

    @ManyToOne
    @JoinColumn(name = "StudentId", nullable = false)
    private Student student;

    public Notification() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String naslov) { this.title = naslov; }

    public String getMessage() { return message; }
    public void setMessage(String poruka) { this.message = poruka; }

    public boolean getRead() { return read; }
    public void setRead(boolean procitano) { this.read = procitano; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime datumVrijeme) { this.dateTime = datumVrijeme; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
}
