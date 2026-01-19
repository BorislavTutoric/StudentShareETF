package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Task;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {

    List<Task> findByStudentAndDatumVrijemeBetween(Student student, LocalDateTime start, LocalDateTime end);


}
