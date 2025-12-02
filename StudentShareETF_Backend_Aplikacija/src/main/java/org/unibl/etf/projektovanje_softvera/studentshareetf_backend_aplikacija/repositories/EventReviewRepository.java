package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.EventReview;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.compositeKeys.EventReviewKey;

import java.util.List;

public interface EventReviewRepository extends JpaRepository<EventReview, EventReviewKey> {

    List<EventReview> findById_EventId(Integer eventId);

    boolean existsById(EventReviewKey id);
}
