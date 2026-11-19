package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "AKTIVNOST_MODULA")
public class ModuleActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AktivnostId")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "KorisnikId", nullable = false)
    private User korisnik;

    @Column(name = "Modul", nullable = false)
    private String modul;

    @Column(name = "Datum", nullable = false)
    private LocalDate datum;

    @Column(name = "TrajanjeSekundi", nullable = false)
    private Integer trajanjeSekundi;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getKorisnik() {
        return korisnik;
    }

    public void setKorisnik(User korisnik) {
        this.korisnik = korisnik;
    }

    public String getModul() {
        return modul;
    }

    public void setModul(String modul) {
        this.modul = modul;
    }

    public LocalDate getDatum() {
        return datum;
    }

    public void setDatum(LocalDate datum) {
        this.datum = datum;
    }

    public Integer getTrajanjeSekundi() {
        return trajanjeSekundi;
    }

    public void setTrajanjeSekundi(Integer trajanjeSekundi) {
        this.trajanjeSekundi = trajanjeSekundi;
    }
}