package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.Data;

@Data
public class EventCommentRequest {
    private String content;
    private Integer eventId;
    private Integer userId;
}
