package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.compositeKeys.EventReviewKey;

import java.time.LocalDateTime;

@Entity
@Table(name = "RECENZIJA_DOGADJAJA")
public class EventReview {

    @EmbeddedId
    private EventReviewKey id;

    @Column(name = "Ocjena", nullable = false)
    private Integer rating;

    @Column(name = "DatumVrijeme", nullable = false)
    private LocalDateTime createdAt;

    public EventReview() {}

    public EventReview(EventReviewKey id, Integer rating, LocalDateTime createdAt) {
        this.id = id;
        this.rating = rating;
        this.createdAt = createdAt;
    }

    public EventReviewKey getId() { return id; }
    public void setId(EventReviewKey id) { this.id = id; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
