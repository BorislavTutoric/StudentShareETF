package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {
    private Integer id;
    private String tipAkcije;
    private String modul;
    private String opis;
    private LocalDateTime datumVrijeme;

    private Integer korisnikId;
    private String korisnickoIme;
    private String imePrezime;
    private String uloga;
    private String entitetTip;
    private Integer entitetId;
}
