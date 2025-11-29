package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Material;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Subject;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Integer> {

    List<Material> findBySubjectAndApproved(Subject subject, Boolean approved);

    Optional<Material> findByMaterialId(Integer integer);
}