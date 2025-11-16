/*package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Material;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Integer> {

    List<Material> findBySubjectIdAndApproved(Integer subjectId, Boolean approved);

}
**/