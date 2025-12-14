package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.StudyProgram;

import java.util.Optional;

@Repository
public interface StudyProgramRepository extends JpaRepository<StudyProgram, Integer> {

    Optional<StudyProgram> findByName(String name);

}
