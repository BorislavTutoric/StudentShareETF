package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventRequest {
    private String naziv;
    private String mjesto;
    private LocalDateTime datumVrijeme;
    private String opis;
    private Integer studentId;
    private String fileKey;
}
