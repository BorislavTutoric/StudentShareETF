package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "MODERATOR_AUDIT")
public class ModeratorAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AuditId", nullable = false)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "ModeratorId", nullable = false)
    private User moderator;

    @Column(name = "Opis", nullable = false)
    private String opis;

    @Column(name = "DatumVrijeme", nullable = false)
    private LocalDateTime datumVrijeme;

    public ModeratorAudit() {}

    public ModeratorAudit(User moderator, String opis, LocalDateTime datumVrijeme) {
        this.moderator = moderator;
        this.opis = opis;
        this.datumVrijeme = datumVrijeme;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getModerator() {
        return moderator;
    }

    public void setModerator(User moderator) {
        this.moderator = moderator;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public LocalDateTime getDatumVrijeme() {
        return datumVrijeme;
    }

    public void setDatumVrijeme(LocalDateTime datumVrijeme) {
        this.datumVrijeme = datumVrijeme;
    }
}