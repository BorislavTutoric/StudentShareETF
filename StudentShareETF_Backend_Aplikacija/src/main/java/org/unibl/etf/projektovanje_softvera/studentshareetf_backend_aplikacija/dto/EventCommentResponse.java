package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventCommentResponse {
    private Integer id;
    private String content;
    private String dateTime;
    private String name;
    private String surname;
    private boolean isMyComment;
}
