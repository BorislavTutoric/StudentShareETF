package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Advice;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.LikePost;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.compositeKeys.LikePostId;

import java.util.Optional;
import java.util.List;

@Repository
public interface LikePostRepository extends JpaRepository<LikePost, LikePostId> {

    Optional<LikePost> findByAdviceAndStudent(Advice advice, Student student);

    long countByAdvice(Advice advice);

    List<LikePost> findByAdviceIn(List<Advice> advices);
    List<LikePost> findByStudent(Student student);
}