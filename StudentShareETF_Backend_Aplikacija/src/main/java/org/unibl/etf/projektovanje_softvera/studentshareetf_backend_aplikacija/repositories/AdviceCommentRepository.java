package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Advice;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.AdviceComment;

import java.util.List;

@Repository
public interface AdviceCommentRepository extends JpaRepository<AdviceComment, Integer> {

    List<AdviceComment> findByAdviceAndParentCommentIsNullOrderByDateTimeAsc(Advice advice);
    @Query("SELECT c.advice.id, COUNT(c) FROM AdviceComment c WHERE c.advice IN :advices AND c.parentComment IS NULL GROUP BY c.advice.id")
    List<Object[]> countTopLevelByAdviceIn(@Param("advices") List<Advice> advices);

    @Query("SELECT ac FROM AdviceComment ac JOIN FETCH ac.student s JOIN FETCH s.user u WHERE ac.advice = :advice ORDER BY ac.dateTime ASC")
    List<AdviceComment> findAllByAdviceWithDetails(@Param("advice") Advice advice);
    long countByAdvice(Advice advice);

    List<AdviceComment> findByAdvice(Advice advice);

    void deleteByAdvice(Advice advice);
}