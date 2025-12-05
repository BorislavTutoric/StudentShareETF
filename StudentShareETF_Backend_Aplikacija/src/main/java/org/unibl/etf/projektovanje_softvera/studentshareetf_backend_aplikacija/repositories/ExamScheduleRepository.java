package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.ExamSchedule;

import java.util.List;

@Repository
public interface ExamScheduleRepository extends JpaRepository<ExamSchedule, Integer> {

    List<ExamSchedule> findByActiveTrue();
}
