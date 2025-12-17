package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "KOMENTAR_MATERIJALA")
public class MaterialComments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "KomentarMaterijalaId")
    private Integer id;

    @Column(name = "Sadrzaj", nullable = false)
    private String sadrzaj;

    @Column(name = "DatumVrijeme", nullable = false)
    private LocalDateTime datumVrijeme;

    @ManyToOne
    @JoinColumn(name = "MaterijalId", nullable = false)
    private Material materijal;

    @ManyToOne
    @JoinColumn(name = "KorisnikId", nullable = false)
    private User korisnik;


    @Column(name = "Prijavljen", nullable = false)
    private Boolean prijavljen = false;

    @Version
    @Column(name = "Version")
    private Long version = 0L;

    public MaterialComments() {}

    public MaterialComments(String content, LocalDateTime dateTime, Material material, User user) {
        this.sadrzaj = content;
        this.datumVrijeme = dateTime;
        this.materijal = material;
        this.korisnik = user;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getSadrzaj() { return sadrzaj; }
    public void setSadrzaj(String sadrzaj) { this.sadrzaj = sadrzaj; }

    public LocalDateTime getDatumVrijeme() { return datumVrijeme; }
    public void setDatumVrijeme(LocalDateTime datumVrijeme) { this.datumVrijeme = datumVrijeme; }

    public Material getMaterijal() { return materijal; }
    public void setMaterijal(Material materijal) { this.materijal = materijal; }

    public User getKorisnik() { return korisnik; }
    public void setKorisnik(User korisnik) { this.korisnik = korisnik; }

    public Boolean getPrijavljen() { return prijavljen; }
    public void setPrijavljen(Boolean prijavljen) { this.prijavljen = prijavljen; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
}
