package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.compositeKeys;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class LikePostId implements Serializable {

    @Column(name = "PostId")
    private Integer postId;

    @Column(name = "StudentId")
    private Integer studentId;

    public LikePostId() {}

    public LikePostId(Integer postId, Integer studentId) {
        this.postId = postId;
        this.studentId = studentId;
    }

    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId) {
        this.postId = postId;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LikePostId that = (LikePostId) o;
        return Objects.equals(postId, that.postId) &&
                Objects.equals(studentId, that.studentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(postId, studentId);
    }
}