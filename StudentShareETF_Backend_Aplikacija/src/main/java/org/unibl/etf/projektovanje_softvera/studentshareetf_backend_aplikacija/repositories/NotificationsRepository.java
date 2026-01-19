package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Notification;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationsRepository extends JpaRepository<Notification, Integer> {

    @Query("""
        SELECT n FROM Notification n
        WHERE n.student = :student
        AND n.read = false
        AND n.activeFrom <= :now
        ORDER BY n.activeFrom ASC
    """)
    List<Notification> findActiveUnreadNotifications(@Param("student") Student student,  @Param("now") LocalDateTime now);

    @Query("""
        SELECT n FROM Notification n
        WHERE n.student = :student
        AND n.activeFrom <= :now
        ORDER BY n.activeFrom ASC
    """)
    List<Notification> findActiveNotifications(@Param("student") Student student,  @Param("now") LocalDateTime now);

    @Query("""
        SELECT n FROM Notification n
        WHERE n.student = :student
        AND n.title LIKE %:title%
    """)
    List<Notification> findTaskNotifications(@Param("title") String title, @Param("student") Student student);
}
