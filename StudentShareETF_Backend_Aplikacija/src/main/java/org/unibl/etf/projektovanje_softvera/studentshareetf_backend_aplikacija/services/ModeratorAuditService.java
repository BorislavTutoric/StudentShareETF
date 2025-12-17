package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.ModeratorAudit;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.ModeratorAuditRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ModeratorAuditService {

    private final ModeratorAuditRepository auditRepository;

    public void logAction(User moderator, String description) {
        ModeratorAudit audit = new ModeratorAudit();
        audit.setModerator(moderator);
        audit.setOpis(description);
        audit.setDatumVrijeme(LocalDateTime.now());

        auditRepository.save(audit);
    }
}
