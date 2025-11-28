package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Integer eventId;
    private Integer studentId;
    private Integer rating;
}
