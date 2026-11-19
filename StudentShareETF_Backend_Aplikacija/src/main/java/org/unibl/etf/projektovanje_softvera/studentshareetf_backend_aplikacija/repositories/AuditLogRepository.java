package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.AuditLog;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.enums.Modul;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.enums.TipAkcije;

import java.time.LocalDateTime;

public interface AuditLogRepository extends JpaRepository<AuditLog, Integer> {

    @EntityGraph(attributePaths = "korisnik")
    @Query("""
            select a from AuditLog a left join a.korisnik k
            where (:korisnikId is null or k.userId = :korisnikId)
              and (:korisnik is null
                   or lower(k.username) like lower(concat('%', :korisnik, '%'))
                   or lower(k.name)     like lower(concat('%', :korisnik, '%'))
                   or lower(k.surname)  like lower(concat('%', :korisnik, '%')))
              and (:uloga is null or a.uloga like concat(:uloga, '%'))
              and (:tip is null or a.tipAkcije = :tip)
              and (:modul is null or a.modul = :modul)
              and (:od is null or a.datumVrijeme >= :od)
              and (:doIskljucivo is null or a.datumVrijeme < :doIskljucivo)
            """)
    Page<AuditLog> pretraga(@Param("korisnikId") Integer korisnikId,
                            @Param("korisnik") String korisnik,
                            @Param("uloga") String uloga,
                            @Param("tip") TipAkcije tip,
                            @Param("modul") Modul modul,
                            @Param("od") LocalDateTime od,
                            @Param("doIskljucivo") LocalDateTime doIskljucivo,
                            Pageable pageable);
}
