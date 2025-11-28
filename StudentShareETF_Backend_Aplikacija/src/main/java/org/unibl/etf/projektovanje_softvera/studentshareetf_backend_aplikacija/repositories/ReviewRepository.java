package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Review;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.ReviewKey;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, ReviewKey> {

    List<Review> findByIdEventId(Integer eventId);

    boolean existsById(ReviewKey id);
}
