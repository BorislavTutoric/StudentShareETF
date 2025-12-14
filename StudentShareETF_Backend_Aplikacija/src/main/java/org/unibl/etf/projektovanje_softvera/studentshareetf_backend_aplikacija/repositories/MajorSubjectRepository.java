package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Major;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.MajorSubject;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Subject;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.compositeKeys.MajorSubjectId;

import java.util.List;
import java.util.Optional;

@Repository
public interface MajorSubjectRepository extends JpaRepository<MajorSubject, MajorSubjectId> {

    List<MajorSubject> findByMajorAndSemesterIn(Major major, List<Integer> semesters);

    @Query("SELECT ms FROM MajorSubject ms JOIN FETCH ms.subject JOIN FETCH ms.major")
    List<MajorSubject> findAllWithSubjectAndMajor();
}
