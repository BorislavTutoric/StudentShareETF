package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "RASPORED_ISPITA")
public class ExamSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RasporedIspitaId")
    private Integer id;

    @Column(name = "FileKey", nullable = false)
    String fileKey;

    @Column(name = "Naziv", nullable = false)
    String title;

    @Column(name = "DatumPostavljanja", nullable = false)
    private LocalDateTime date;

    @Column(name = "Aktivan", nullable = false)
    boolean active;

    @ManyToOne
    @JoinColumn(name = "KorisnikId", nullable = false)
    User user;

    public ExamSchedule() {}

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public LocalDateTime getDate() {
        return date;
    }
    public void setDate(LocalDateTime date) {
        this.date = date;
    }
    public boolean isActive() {
        return active;
    }
    public void setActive(boolean active) {
        this.active = active;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public String getFileKey() {
        return fileKey;
    }
    public void setFileKey(String fileKey) {
        this.fileKey = fileKey;
    }

}
