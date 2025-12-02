package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class EventCommentResponse {

    private Integer id;
    private String content;
    private LocalDateTime dateTime;
    private String username;

}
