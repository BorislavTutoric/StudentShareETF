package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Major;

import java.util.Optional;

public interface MajorRepository extends JpaRepository<Major, Integer> {

    Optional<Major> findByName(String name);
}
