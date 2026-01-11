package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.EventReview;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.MaterialReview;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.compositeKeys.EventReviewKey;

import java.util.List;

public interface EventReviewRepository extends JpaRepository<EventReview, EventReviewKey> {

    List<EventReview> findById_EventId(Integer eventId);

    boolean existsById(EventReviewKey id);

    @Query("""
        SELECT e
        FROM EventReview e
        JOIN e.user u
        WHERE e.id.eventId = :eventId
            AND u.active = true
        """)
    List<EventReview> findReviewsOfActiveUsersByEventId(
            @Param("eventId") Integer eventId
    );
}
