package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers.moderator_events;

import jakarta.persistence.OptimisticLockException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventApprovalRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventResponseForModerator;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialApprovalRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.EventService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.UserService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/moderator/events")
@RequiredArgsConstructor
public class Events {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<?> getMaterialRequests() {
        List<EventResponseForModerator> events = eventService.getPendingEventsForModerator();

        if (events.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "Trenutno nema materijala na odobravanje"));
        }

        return ResponseEntity.ok(events);
    }


    @PostMapping("/review")
    public ResponseEntity<?> reviewMaterial(@RequestBody EventApprovalRequest request) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            eventService.reviewEvent(request.getDogadjajId(), request.isApproved(), username);
            return ResponseEntity.ok(Map.of("message", "Dogadjaj je obrađen"));
        } catch (OptimisticLockException ex) {
            return ResponseEntity.status(409)
                    .body(Map.of("error", "Dogadjaj je već obrađen od strane drugog moderatora"));
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
