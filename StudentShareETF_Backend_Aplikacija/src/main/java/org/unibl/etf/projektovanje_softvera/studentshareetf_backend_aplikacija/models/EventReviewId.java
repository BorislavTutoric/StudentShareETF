package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import java.io.Serializable;
import java.util.Objects;

public class EventReviewId implements Serializable {

    private Integer event;
    private Integer student;

    public EventReviewId() {}

    public EventReviewId(Integer event, Integer student) {
        this.event = event;
        this.student = student;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EventReviewId)) return false;
        EventReviewId that = (EventReviewId) o;
        return Objects.equals(event, that.event) &&
                Objects.equals(student, that.student);
    }

    @Override
    public int hashCode() {
        return Objects.hash(event, student);
    }
}
