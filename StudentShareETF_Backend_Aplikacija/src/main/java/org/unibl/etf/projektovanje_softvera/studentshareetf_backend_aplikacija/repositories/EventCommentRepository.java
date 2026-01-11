package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.EventComment;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.MaterialComments;

import java.util.List;

public interface EventCommentRepository extends JpaRepository<EventComment, Integer> {

    List<EventComment> findByEvent_Id(Integer eventId);

    @Query("""
        SELECT e
        FROM EventComment e
        JOIN e.user u
        WHERE e.event.id = :eventId
            AND u.active = true
        """)
    List<EventComment> findCommentsOfActiveUsersByEvent_Id(
            @Param("eventId") Integer eventId
    );
}
