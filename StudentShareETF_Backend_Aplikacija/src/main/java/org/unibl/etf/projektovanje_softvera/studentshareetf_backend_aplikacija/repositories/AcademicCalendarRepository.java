package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.AcademicCalendar;

import java.util.Optional;

@Repository
public interface AcademicCalendarRepository extends JpaRepository<AcademicCalendar, Integer> {

    // Vrati jedini aktivni kalendar (pošto će uvijek postojati samo jedan)
    Optional<AcademicCalendar> findByAktivan(boolean aktivan);
}
