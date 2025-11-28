package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ReviewKey implements Serializable {

    @Column(name = "DogadjajId")
    private Integer eventId;

    @Column(name = "KorisnikId")
    private Integer studentId;

    public ReviewKey() {}

    public ReviewKey(Integer eventId, Integer studentId) {
        this.eventId = eventId;
        this.studentId = studentId;
    }

    public Integer getEventId() { return eventId; }
    public void setEventId(Integer eventId) { this.eventId = eventId; }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ReviewKey)) return false;
        ReviewKey that = (ReviewKey) o;
        return Objects.equals(eventId, that.eventId) &&
                Objects.equals(studentId, that.studentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(eventId, studentId);
    }
}
