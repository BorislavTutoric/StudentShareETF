package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
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

}