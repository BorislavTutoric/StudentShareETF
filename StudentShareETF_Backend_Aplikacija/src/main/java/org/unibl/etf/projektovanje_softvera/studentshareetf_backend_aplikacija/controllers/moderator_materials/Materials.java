package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers.moderator_materials;

import jakarta.persistence.OptimisticLockException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialApprovalRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialResponseForModerator;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.MaterialService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.StudentService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.UserService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/moderator/materials")
@RequiredArgsConstructor
public class Materials {

    private final MaterialService materialService;
    private final UserService userService;
    private final StudentService studentService;

    @GetMapping("/students")
    public ResponseEntity<List<User>> getAllStudents() {
        return ResponseEntity.ok(userService.getAllStudents());
    }


    @PutMapping("/students/{id}/status")
    public ResponseEntity<?> toggleStudentStatus(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        try {

            Object val = body.get("aktivan");
            Boolean noviStatus = false;
            if (val instanceof Integer) {
                noviStatus = ((Integer) val) == 1;
            } else if (val instanceof Boolean) {
                noviStatus = (Boolean) val;
            }

            userService.updateUserStatus(id, noviStatus);
            return ResponseEntity.ok(Map.of("message", "Status uspješno ažuriran"));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Korisnik nije pronađen"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Greška pri obradi zahtjeva"));
        }
    }

    @GetMapping("/students/{id}/suspension-status")
    public ResponseEntity<Boolean> isStudentSuspended(@PathVariable Integer id) {
        return ResponseEntity.ok(studentService.getStudentSuspensionStatus(id));
    }


    @GetMapping
    public ResponseEntity<?> getMaterialRequests() {
        List<MaterialResponseForModerator> materials = materialService.getPendingMaterialsForModerator();

        if (materials.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "Trenutno nema materijala na odobravanje"));
        }

        return ResponseEntity.ok(materials);
    }

    @GetMapping("/{id}/url")
    public ResponseEntity<String> getMaterialUrl(@PathVariable Integer id) {
        Optional<String> url = materialService.getMaterialUrl(id);
        return url.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/review")
    public ResponseEntity<?> reviewMaterial(@RequestBody MaterialApprovalRequest request) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            materialService.reviewMaterial(request.getMaterialId(), request.isApproved(), username);
            return ResponseEntity.ok(Map.of("message", "Materijal je obrađen"));
        } catch (OptimisticLockException ex) {
            return ResponseEntity.status(409)
                    .body(Map.of("error", "Materijal je već obrađen od strane drugog moderatora"));
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @DeleteMapping("/{materialId}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Integer materialId) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            materialService.deleteMaterialByModerator(materialId, username);
            return ResponseEntity.noContent().build();
        }
        catch (EntityNotFoundException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}