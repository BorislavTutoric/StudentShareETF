package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewResponse {
    private Integer eventId;
    private Integer studentId;
    private Integer rating;
    private String dateTime;
    private String name;
    private String surname;
    @JsonProperty("isMyRating")
    private boolean isMyRating;
}
