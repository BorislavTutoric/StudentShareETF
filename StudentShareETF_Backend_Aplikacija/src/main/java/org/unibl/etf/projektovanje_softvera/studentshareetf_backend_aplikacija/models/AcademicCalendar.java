package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "AKADEMSKI_KALENDAR")
public class AcademicCalendar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AkademskiKalendarId")
    private Integer id;

    @Column(name = "file_key", nullable = false)
    String fileKey;

    @Column(name = "Naziv", nullable = false)
    String naziv;

    @Column(name = "DatumPostavljanja", nullable = false)
    private LocalDateTime datumPostavljanja;

    @Column(name = "Aktivan", nullable = false)
    boolean aktivan;

    @ManyToOne
    @JoinColumn(name = "KorisnikId", nullable = false)
    User user;

    public AcademicCalendar() {}

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getNaziv() {
        return naziv;
    }
    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }
    public void setDatumPostavljanja(LocalDateTime datumPostavljanja) {
        this.datumPostavljanja = datumPostavljanja;
    }
    public void setAktivan(boolean aktivan) {
        this.aktivan = aktivan;
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
