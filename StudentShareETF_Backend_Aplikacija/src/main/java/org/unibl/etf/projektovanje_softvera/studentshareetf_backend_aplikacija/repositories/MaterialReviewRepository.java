package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AverageReview;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Material;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.MaterialComments;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.MaterialReview;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Subject;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialCommentResponse;

import java.util.List;

@Repository
public interface MaterialReviewRepository extends JpaRepository<MaterialReview, Integer> {

    List<MaterialReview> findByMaterijal_MaterialId(Integer materialId);

    void deleteByMaterijalIdAndStudentId(Integer materijalId, Integer studentId);

    @Query("SELECT new org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AverageReview(r.materijalId, AVG(r.ocjena)) " +
            "FROM MaterialReview r " +
            "JOIN Material m ON r.materijalId = m.materialId " +
            "JOIN m.subject s " +
            "WHERE s.name = :subjectName " +
            "GROUP BY r.materijalId")
    List<AverageReview> findAvgRatingsBySubjectName(@Param("subjectName") String subjectName);

}