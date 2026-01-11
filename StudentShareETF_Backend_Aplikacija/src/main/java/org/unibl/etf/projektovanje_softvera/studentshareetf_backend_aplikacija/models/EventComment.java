package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "KOMENTAR_DOGADJAJA")
public class EventComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "KomentarDogadjajaId")
    private Integer id;

    @Column(name = "Sadrzaj", nullable = false, length = 200)
    private String content;

    @Column(name = "DatumVrijeme", nullable = false)
    private LocalDateTime dateTime;

    @Column(name = "Prijavljen", nullable = false)
    private boolean reported = false;

    @ManyToOne
    @JoinColumn(name = "DogadjajId", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "KorisnikId", nullable = false)
    private User user;

    public EventComment() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
