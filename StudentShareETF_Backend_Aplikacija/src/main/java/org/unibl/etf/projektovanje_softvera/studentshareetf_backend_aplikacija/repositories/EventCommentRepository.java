package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.EventComment;

import java.util.List;

public interface EventCommentRepository extends JpaRepository<EventComment, Integer> {

    List<EventComment> findByEvent_Id(Integer eventId);

    List<EventComment> findByReportedTrue();
}
