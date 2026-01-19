package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers.moderator_events;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.OptimisticLockException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.EventCommentService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/moderator/events/comments")
@RequiredArgsConstructor
public class EventComments {

    private final EventCommentService eventCommentService;

    @GetMapping
    public ResponseEntity<?> getEventCommentRequests()
    {
        List<EventCommentResponseForModerator> materials = eventCommentService.getPendingEventCommentForModerator();

        if (materials.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "Trenutno nema materijala na odobravanje"));
        }

        return ResponseEntity.ok(materials);
    }

    @PostMapping("/review")
    public ResponseEntity<?> reviewEventComment(@RequestBody EventCommentApprovalRequest request) {

        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            eventCommentService.reviewEventComment(request.getCommentId(), request.isApproved(), username);

            return ResponseEntity.ok(Map.of("message", "Komentar je obrađen"));
        } catch (OptimisticLockException ex) {
            return ResponseEntity.status(409)
                    .body(Map.of("error", "Komentar je već obrađen od strane drugog moderatora"));
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteEventComment(@PathVariable Integer commentId) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            eventCommentService.deleteById(commentId,username);
        }
        catch (EntityNotFoundException ex) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

}

