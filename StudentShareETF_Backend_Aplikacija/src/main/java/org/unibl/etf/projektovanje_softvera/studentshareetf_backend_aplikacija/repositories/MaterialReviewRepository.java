package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AverageReview;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.MaterialReview;

import java.util.List;

@Repository
public interface MaterialReviewRepository extends JpaRepository<MaterialReview, Integer> {

    void deleteByMaterijalIdAndStudentId(Integer materijalId, Integer studentId);

    @Query("SELECT new org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AverageReview(r.materijalId, AVG(r.ocjena)) " +
            "FROM MaterialReview r " +
            "JOIN Material m ON r.materijalId = m.materialId " +
            "JOIN m.subject s " +
            "WHERE s.name = :subjectName " +
            "GROUP BY r.materijalId")
    List<AverageReview> findAvgRatingsBySubjectName(@Param("subjectName") String subjectName);

    @Query("""
        SELECT m
        FROM MaterialReview m
        JOIN m.user u
        WHERE m.materijal.materialId = :materialId
            AND u.active = true
        """)
    List<MaterialReview> findReviewsOfActiveUsersByMaterialId(
            @Param("materialId") Integer materialId
    );
}