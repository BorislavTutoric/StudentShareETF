package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AuditLogResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.PagedResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.enums.Modul;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.enums.TipAkcije;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.AuditLogService;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/audit-log")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public PagedResponse<AuditLogResponse> pretraga(
            @RequestParam(required = false) String korisnik,
            @RequestParam(required = false) String uloga,
            @RequestParam(required = false) TipAkcije tip,
            @RequestParam(required = false) Modul modul,
            @RequestParam(name = "od", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate od,
            @RequestParam(name = "do", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate datumDo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return auditLogService.pretraga(korisnik, uloga, tip, modul, od, datumDo, page, size);
    }
}
