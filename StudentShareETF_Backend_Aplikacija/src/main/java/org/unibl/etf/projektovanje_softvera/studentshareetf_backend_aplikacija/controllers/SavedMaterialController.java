package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.SavedMaterialService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;

import java.util.List;

@RestController
@RequestMapping("/api/saved-materials")
@RequiredArgsConstructor
public class SavedMaterialController {

    private final SavedMaterialService savedMaterialService;

    @GetMapping
    public ResponseEntity<List<MaterialResponse>> getSavedMaterials() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            List<MaterialResponse> materials = savedMaterialService.getSavedMaterials(username)
                    .stream()
                    .map(MaterialResponse::fromMaterial)
                    .toList();

            return ResponseEntity.ok(materials);
        } catch (UserNotFoundException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{materialId}")
    public ResponseEntity<Void> saveMaterial(@PathVariable Integer materialId) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            savedMaterialService.materialSave(username, materialId);
            return ResponseEntity.ok().build();
        } catch (UserNotFoundException | EntityNotFoundException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{materialId}")
    public ResponseEntity<Void> removeSavedMaterial(@PathVariable Integer materialId) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            savedMaterialService.removeSavedMaterial(username, materialId);
            return ResponseEntity.noContent().build();
        } catch (UserNotFoundException ex) {
            return ResponseEntity.badRequest().build();
        }
    }
}
