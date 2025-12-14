package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Exam;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Major;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Integer> {
    List<Exam> findByMajor(Major major);
}
