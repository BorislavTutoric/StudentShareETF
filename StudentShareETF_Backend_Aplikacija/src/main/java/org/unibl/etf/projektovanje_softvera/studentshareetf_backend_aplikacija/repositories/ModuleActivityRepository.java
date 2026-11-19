package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.ModuleActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ModuleActivityRepository extends JpaRepository<ModuleActivity, Integer> {

    @Modifying
    @Query(value = """
        INSERT INTO AKTIVNOST_MODULA (KorisnikId, Modul, Datum, TrajanjeSekundi)
        VALUES (:korisnikId, :modul, :datum, :sek)
        ON DUPLICATE KEY UPDATE TrajanjeSekundi = TrajanjeSekundi + :sek
        """, nativeQuery = true)
    void dodajSekunde(@Param("korisnikId") Integer korisnikId, @Param("modul") String modul,
                      @Param("datum") LocalDate datum, @Param("sek") int sek);

    interface ModulSekundi { String getModul(); Long getSekundi(); }
    interface DanSekundi   { LocalDate getDatum(); Long getSekundi(); }

    @Query("select a.modul as modul, sum(a.trajanjeSekundi) as sekundi from ModuleActivity a " +
            "where a.korisnik.userId = :id and a.datum between :od and :dop group by a.modul")
    List<ModulSekundi> poModuluZaKorisnika(@Param("id") Integer id,
                                           @Param("od") LocalDate od, @Param("dop") LocalDate dop);

    @Query("select a.datum as datum, sum(a.trajanjeSekundi) as sekundi from ModuleActivity a " +
            "where a.korisnik.userId = :id and a.datum between :od and :dop group by a.datum order by a.datum")
    List<DanSekundi> poDanuZaKorisnika(@Param("id") Integer id,
                                       @Param("od") LocalDate od, @Param("dop") LocalDate dop);

    interface ModulStat   { String getModul(); Long getUkupno(); Long getBrojStudenata(); }
    interface MjesecStat  { Number getMjesec(); Long getAktivni(); Long getUkupno(); }

    @Query("select a.modul as modul, sum(a.trajanjeSekundi) as ukupno, " +
            "count(distinct a.korisnik.userId) as brojStudenata from ModuleActivity a " +
            "where a.korisnik.role = 'STUDENT' and a.datum between :od and :dop " +
            "group by a.modul order by sum(a.trajanjeSekundi) desc")
    List<ModulStat> statistikaPoModulima(@Param("od") LocalDate od, @Param("dop") LocalDate dop);

    @Query("select count(distinct a.korisnik.userId) from ModuleActivity a " +
            "where a.korisnik.role = 'STUDENT' and a.datum between :od and :dop")
    long brojAktivnihStudenata(@Param("od") LocalDate od, @Param("dop") LocalDate dop);

    @Query("select extract(month from a.datum) as mjesec, " +
            "count(distinct a.korisnik.userId) as aktivni, sum(a.trajanjeSekundi) as ukupno " +
            "from ModuleActivity a where a.korisnik.role = 'STUDENT' " +
            "and a.datum between :od and :dop group by extract(month from a.datum)")
    List<MjesecStat> statistikaPoMjesecima(@Param("od") LocalDate od, @Param("dop") LocalDate dop);
}
