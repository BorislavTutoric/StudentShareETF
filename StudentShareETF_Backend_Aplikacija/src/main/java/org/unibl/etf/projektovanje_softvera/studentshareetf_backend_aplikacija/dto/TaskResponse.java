package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponse {
    private Integer id;
    private String title;
    private String description;
    private String date;
    private String time;
    private boolean isFaculcy;      // u JSON-u "faculcy"
    private boolean obavljena;
    private String datumObavljanja; // ISO datum i vrijeme ili null
}
