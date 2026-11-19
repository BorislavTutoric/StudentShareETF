package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.enums.Modul;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.enums.TipAkcije;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.AuditLogService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class LogoutController {

    private final AuditLogService auditLogService;

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a != null && a.isAuthenticated() && !(a instanceof AnonymousAuthenticationToken)) {
            String opis = "Korisnik \"" + a.getName() + "\" se odjavio.";
            if (a.getPrincipal() instanceof User korisnik) {
                auditLogService.log(korisnik, TipAkcije.ODJAVA, Modul.AUTENTIFIKACIJA,
                        "KORISNIK", korisnik.getUserId(), opis);
            } else {
                auditLogService.log(a.getName(), TipAkcije.ODJAVA, Modul.AUTENTIFIKACIJA,
                        "KORISNIK", null, opis);
            }
        }
        return ResponseEntity.ok(Map.of("message", "Odjava uspješna."));
    }
}
