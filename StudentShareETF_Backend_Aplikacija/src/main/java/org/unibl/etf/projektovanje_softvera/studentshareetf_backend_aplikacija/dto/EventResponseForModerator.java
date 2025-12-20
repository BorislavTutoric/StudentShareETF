package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventResponseForModerator extends EventResponse{
    private Integer studentId;
}
