package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.enums.Modul;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.enums.TipAkcije;

import java.time.LocalDateTime;

@Entity
@Table(name = "AUDIT_LOG")
@Getter
@Setter
@NoArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AuditLogId", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "KorisnikId")
    private User korisnik;

    @Column(name = "Uloga", length = 50)
    private String uloga;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "TipAkcije", nullable = false, length = 40)
    private TipAkcije tipAkcije;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "Modul", nullable = false, length = 30)
    private Modul modul;

    @Column(name = "EntitetTip", length = 50)
    private String entitetTip;

    @Column(name = "EntitetId")
    private Integer entitetId;

    @Column(name = "Opis", nullable = false, length = 500)
    private String opis;

    @Column(name = "DatumVrijeme", nullable = false)
    private LocalDateTime datumVrijeme;
}
