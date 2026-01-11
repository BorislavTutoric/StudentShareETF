package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;
// Ažuriran import
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.compositeKeys.LikePostId;

@Entity
@Table(name = "SVIDJANJE_POSTA")
public class LikePost {

    @EmbeddedId
    private LikePostId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("postId")
    @JoinColumn(name = "PostId")
    private Advice advice;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("studentId")
    @JoinColumn(name = "StudentId")
    private Student student;

    public LikePost() {}

    public LikePost(Advice advice, Student student) {
        this.advice = advice;
        this.student = student;
        this.id = new LikePostId(advice.getId(), student.getUserId()); // Koristimo userId iz studenta
    }

    // Getteri i Setteri (ostaju isti)

    public LikePostId getId() {
        return id;
    }

    public void setId(LikePostId id) {
        this.id = id;
    }

    public Advice getAdvice() {
        return advice;
    }

    public void setAdvice(Advice advice) {
        this.advice = advice;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }
}