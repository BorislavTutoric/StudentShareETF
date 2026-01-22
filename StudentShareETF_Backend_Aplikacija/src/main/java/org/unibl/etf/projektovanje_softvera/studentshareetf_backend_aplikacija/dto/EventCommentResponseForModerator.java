package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventCommentResponseForModerator extends EventCommentResponse {
    private Integer studentId;
    private String studentName;
    private String date;
}
