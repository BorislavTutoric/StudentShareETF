package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Major;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.MajorSubject;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.compositeKeys.MajorSubjectId;

import java.util.List;

@Repository
public interface MajorSubjectRepository extends JpaRepository<MajorSubject, MajorSubjectId> {

    List<MajorSubject> findByMajorAndSemesterIn(Major major, List<Integer> semesters);
}
