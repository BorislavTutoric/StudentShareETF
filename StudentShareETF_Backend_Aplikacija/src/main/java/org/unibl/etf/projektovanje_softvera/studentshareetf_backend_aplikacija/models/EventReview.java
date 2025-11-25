package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "RECENZIJA_DOGADJAJA")
@IdClass(EventReviewId.class)
public class EventReview {

    @Id
    @ManyToOne
    @JoinColumn(name = "DogadjajId", nullable = false)
    private Event event;

    @Id
    @ManyToOne
    @JoinColumn(name = "KorisnikId", nullable = false)
    private Student student;

    @Column(name = "Ocjena", nullable = false)
    private Integer ocjena;

    @Column(name = "DatumVrijeme", nullable = false)
    private LocalDateTime datumVrijeme;

    public EventReview() {}

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Integer getOcjena() { return ocjena; }
    public void setOcjena(Integer ocjena) { this.ocjena = ocjena; }

    public LocalDateTime getDatumVrijeme() { return datumVrijeme; }
    public void setDatumVrijeme(LocalDateTime datumVrijeme) { this.datumVrijeme = datumVrijeme; }
}