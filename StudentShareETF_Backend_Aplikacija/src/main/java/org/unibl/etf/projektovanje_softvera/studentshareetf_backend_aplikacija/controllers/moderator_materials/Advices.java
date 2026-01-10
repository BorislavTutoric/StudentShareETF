package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers.moderator_materials;

import jakarta.persistence.OptimisticLockException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.AdviceService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/moderator/materials/posts")
@RequiredArgsConstructor
public class Advices {

    private final AdviceService adviceService;

    @GetMapping
    public ResponseEntity<?> getMaterialRequests()
    {
        List<AdviceForModeratorResponse> advices = adviceService.getPendingAdvicesForModerator();

        if (advices.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "Trenutno nema postova na odobravanje"));
        }

        return ResponseEntity.ok(advices);
    }

    @PostMapping("/review")
    public ResponseEntity<?> reviewAdvices(@RequestBody AdviceApprovalRequest request) {

        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            adviceService.reviewAdvice(request.getAdviceId(), request.isApproved(), username);

            return ResponseEntity.ok(Map.of("message", "Post je obrađen"));
        } catch (OptimisticLockException ex) {
            return ResponseEntity.status(409)
                    .body(Map.of("error", "Post je već obrađen od strane drugog moderatora"));
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
