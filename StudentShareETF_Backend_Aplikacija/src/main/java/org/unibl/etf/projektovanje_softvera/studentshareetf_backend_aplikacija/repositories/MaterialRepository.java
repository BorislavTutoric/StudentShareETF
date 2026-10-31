package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Material;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Subject;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Integer> {

    List<Material> findBySubjectAndApproved(Subject subject, Boolean approved);

    Optional<Material> findByMaterialId(Integer integer);

    @Query("""
        SELECT m
        FROM SavedMaterial sm
        JOIN sm.material m
        WHERE sm.student = :student
        AND m.subject = :subject
    """)
    List<Material> findSavedMaterialsByStudentAndSubject(@Param("student") Student student, @Param("subject") Subject subject
    );

    List<Material> findByApprovedFalseAndModeratorIsNull();

    Page<Material> findBySubjectAndApprovedTrueAndCategory(Subject subject, String category, Pageable pageable);

    @Query("""
        SELECT m.category, COUNT(m)
        FROM Material m
        WHERE m.subject = :subject
        AND m.approved = true
        GROUP BY m.category
    """)
    List<Object[]> countApprovedBySubjectGroupByCategory(@Param("subject") Subject subject);
}