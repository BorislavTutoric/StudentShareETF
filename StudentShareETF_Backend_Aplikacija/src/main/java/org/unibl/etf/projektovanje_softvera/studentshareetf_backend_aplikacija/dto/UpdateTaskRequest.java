package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateTaskRequest {
    private String naslov;
    private String opis;
    private String datum;   // YYYY-MM-DD
    private String vrijeme; // HH:mm, prazno = bez vremena
}
