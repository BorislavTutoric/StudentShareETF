package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "DOGADJAJ")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DogadjajId")
    private Integer id;

    @Column(name = "Naziv", nullable = false)
    private String naziv;

    @Column(name = "Mjesto", nullable = false)
    private String mjesto;

    @Column(name = "DatumVrijeme", nullable = false)
    private LocalDateTime vrijemedatum;

    @Column(name = "Opis", columnDefinition = "TEXT")
    private String opis;

    @ManyToOne
    @JoinColumn(name = "StudentId", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "ModeratorId")
    private User moderator;

    @Column(name = "FileKey")
    private String fileKey;

    @Column(name = "Aktivan", nullable = false)
    private String aktivan = "NEAKTIVAN";

    public Event() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNaziv() { return naziv; }
    public void setNaziv(String naziv) { this.naziv = naziv; }

    public String getMjesto() { return mjesto; }
    public void setMjesto(String mjesto) { this.mjesto = mjesto; }

    public LocalDateTime getDatumVrijeme() { return vrijemedatum; }
    public void setDatumVrijeme(LocalDateTime vrijemedatum) { this.vrijemedatum = vrijemedatum; }

    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public User getModerator() { return moderator; }
    public void setModerator(User moderator) { this.moderator = moderator; }

    public String getFileKey() { return fileKey; }
    public void setFileKey(String fileKey) { this.fileKey = fileKey; }

    public String getAktivan() { return aktivan; }
    public void setAktivan(String status) { this.aktivan = status; }
}