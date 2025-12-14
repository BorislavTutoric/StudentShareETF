package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.SubjectSimple;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Major;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Subject;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Integer> {

    List<Subject> findBySemesterIn(List<Integer> semesters);

    Optional<Subject> findByName(String name);

    List<Subject> findByNameContainingIgnoreCase(String search);

    @Query("""
        SELECT DISTINCT s
        FROM Subject s
        JOIN Material m ON m.subject = s
        JOIN SavedMaterial sm ON sm.material = m
        WHERE sm.student = :student
    """)
    List<Subject> findSubjectsByStudentSavedMaterials(@Param("student") Student student);

    @Query("""
        SELECT DISTINCT new org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.SubjectSimple(
            s.name,
            ms.semester
        )
        FROM SavedMaterial sm
        JOIN sm.material m
        JOIN m.subject s
        JOIN MajorSubject ms ON ms.subject = s
        JOIN sm.student st
        WHERE st = :student
        AND ms.major = :major
        AND ms.semester IN :semesters
    """)
    List<SubjectSimple> findFilteredSubjectsWithSavedMaterialsForStudent(
            @Param("student") Student student,
            @Param("major") Major major,
            @Param("semesters") List<Integer> semesters
    );
}