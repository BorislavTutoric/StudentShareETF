package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Material;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.SavedMaterial;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.compositeKeys.SavedMaterialId;

@Repository
public interface SavedMaterialRepository extends JpaRepository<SavedMaterial, SavedMaterialId> {

    @Query("SELECT sm FROM SavedMaterial sm " +
            "JOIN FETCH sm.material m " +
            "JOIN FETCH m.subject " +
            "WHERE sm.student.userId = :studentId")
    List<SavedMaterial> findByStudentWithMaterialAndSubject(@Param("studentId") Integer studentId);

    void deleteByMaterial_MaterialIdAndStudent_UserId(Integer materialId, Integer studentId);

    boolean existsByMaterialAndStudent(Material material, Student student);
}
