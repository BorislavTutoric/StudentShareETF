package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.ModeratorAuditService;


@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class ModeratorActionsController {

    private final ModeratorAuditService moderatorAuditService;

    @GetMapping("/moderator-actions")
    public ResponseEntity<?> getModeratorActions() {
        return ResponseEntity.ok(moderatorAuditService.getAllModeratorAudits());
    }

    @DeleteMapping("/moderator-actions/delete/{id}")
    public ResponseEntity<?> deleteModeratorAction(@PathVariable Integer id) {
        moderatorAuditService.deleteModeratorAudit(id);
        return ResponseEntity.ok("Uspješno obrisan moderator audit!");
    }
}
