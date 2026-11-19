package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.ModulesResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MonthlyResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.ActivityStatisticsService;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/statistics")
@RequiredArgsConstructor
public class ActivityStatisticsController {

    private final ActivityStatisticsService statisticsService;

    @GetMapping("/time-per-module")
    public ModulesResponse timePerModule(
            @RequestParam(name = "od", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate od,
            @RequestParam(name = "do", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate datumDo) {
        LocalDate kraj = datumDo != null ? datumDo : LocalDate.now();
        LocalDate pocetak = od != null ? od : LocalDate.of(2000, 1, 1);
        return statisticsService.vrijemePoModulima(pocetak, kraj);
    }

    @GetMapping("/usage")
    public MonthlyResponse usage(@RequestParam(name = "godina", required = false) Integer godina) {
        return statisticsService.koristenjePoMjesecima(godina != null ? godina : LocalDate.now().getYear());
    }
}
