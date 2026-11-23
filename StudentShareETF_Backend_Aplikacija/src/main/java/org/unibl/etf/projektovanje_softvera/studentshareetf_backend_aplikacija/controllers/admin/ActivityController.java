package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.HeartbeatRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.ActivityService;
import org.springframework.security.core.Authentication;

import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.Map;


@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
public class ActivityController {
    private final ActivityService activityService;

    @PostMapping("/heartbeat")
    public ResponseEntity<?> heartbeat(@RequestBody HeartbeatRequest req) {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a == null || a instanceof AnonymousAuthenticationToken)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        boolean ok = activityService.heartbeat(a.getName(), req.getModul());
        return ResponseEntity.ok(Map.of("prihvaceno", ok));
    }

    /** Lično vrijeme u aplikaciji (Dio 3). Bez perioda: zadnjih 30 dana. */
    @GetMapping("/me")
    public ResponseEntity<?> moje(
            @RequestParam(name = "od", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate od,
            @RequestParam(name = "do", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate datumDo) {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a == null || a instanceof AnonymousAuthenticationToken)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        LocalDate kraj = datumDo != null ? datumDo : LocalDate.now();
        LocalDate pocetak = od != null ? od : kraj.minusDays(29);
        if (pocetak.isAfter(kraj))
            return ResponseEntity.badRequest().body("Datum \"od\" ne može biti poslije datuma \"do\".");
        return ResponseEntity.ok(activityService.moje(a.getName(), pocetak, kraj));
    }
}