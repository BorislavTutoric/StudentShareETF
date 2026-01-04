package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventCommentResponseForModerator extends EventCommentResponse {
    private Integer studentId;
}
