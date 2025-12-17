package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers.moderator_materials;

import jakarta.persistence.OptimisticLockException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.AdviceCommentService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.AdviceService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/moderator/materials/posts")
@RequiredArgsConstructor
public class AdviceComments {

    private final AdviceCommentService adviceCommentService;

    @GetMapping
    public ResponseEntity<?> getMaterialRequests()
    {
        List<AdviceResponse> advices = adviceCommentService.getPendingAdvicesForModerator();

        if (advices.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "Trenutno nema postova na odobravanje"));
        }

        return ResponseEntity.ok(advices);
    }

    @PostMapping("/review")
    public ResponseEntity<?> reviewAdvices(@RequestBody AdviceApprovalRequest request) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            adviceCommentService.reviewAdvice(request.getAdviceId(), request.isApproved(), username);

            return ResponseEntity.ok(Map.of("message", "Komentar na post je obrađen"));
        } catch (OptimisticLockException ex) {
            return ResponseEntity.status(409)
                    .body(Map.of("error", "Komentar na post je već obrađen od strane drugog moderatora"));
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
