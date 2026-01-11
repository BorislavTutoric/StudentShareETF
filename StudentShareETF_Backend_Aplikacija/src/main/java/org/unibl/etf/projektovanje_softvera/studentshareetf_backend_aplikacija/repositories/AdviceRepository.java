package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Advice;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.MaterialComments;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Subject;
import org.springframework.data.jpa.repository.Query;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdviceRepository extends JpaRepository<Advice, Integer> {

    List<Advice> findBySubject(Subject subject, Sort sort);

    Optional<Advice> findByStudentAndSubject(Student student, Subject subject);

    List<Advice> findByReportedTrue();
}