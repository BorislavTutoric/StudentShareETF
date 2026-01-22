package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers.moderator_materials;

import jakarta.persistence.OptimisticLockException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.MaterialCommentService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/moderator/materials/comments")
@RequiredArgsConstructor
public class Comments {

    private final MaterialCommentService materialCommentService;

    @GetMapping
    public ResponseEntity<?> getCommentRequests()
    {
        List<MaterialCommentResponseForModerator> comments = materialCommentService.getPendingMaterialCommentForModerator();

        if (comments.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "Trenutno nema materijala na odobravanje"));
        }

        return ResponseEntity.ok(comments);
    }

    @PostMapping("/review")
    public ResponseEntity<?> reviewMaterialComment(@RequestBody MaterialCommentApprovalRequest request) {

        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            materialCommentService.reviewMaterialComment(request.getCommentId(), request.isApproved(), username);

            return ResponseEntity.ok(Map.of("message", "Komentar je obrađen"));
        } catch (OptimisticLockException ex) {
            return ResponseEntity.status(409)
                    .body(Map.of("error", "Komentar je već obrađen od strane drugog moderatora"));
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

}
