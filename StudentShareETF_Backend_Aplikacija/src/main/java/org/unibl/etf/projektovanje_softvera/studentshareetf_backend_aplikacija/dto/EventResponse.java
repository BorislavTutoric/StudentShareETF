package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {
    private String username;
    private Integer dogadjajId;
    private String naziv;
    private String mjesto;
    private LocalDateTime datumVrijeme;
    private String opis;
    private String slikaUrl;
}
