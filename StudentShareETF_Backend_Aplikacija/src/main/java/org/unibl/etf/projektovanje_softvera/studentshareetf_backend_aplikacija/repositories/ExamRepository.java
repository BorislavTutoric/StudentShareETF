package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Exam;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Major;

import java.time.LocalDateTime;
import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Integer> {

    List<Exam> findByMajor(Major major);

    @Modifying
    @Transactional
    @Query(""" 
        DELETE FROM Exam e
        WHERE e.dateTime >= :start
        AND e.dateTime < :end
        """)
    int deleteByMonthAndYear(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
