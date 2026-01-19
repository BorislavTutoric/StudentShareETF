package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.SubjectSimple;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.MaterialService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.SavedMaterialService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.SubjectService;

import java.util.List;

@RestController
@RequestMapping("/api/saved-materials")
@RequiredArgsConstructor
public class SavedMaterialController {

    private final SavedMaterialService savedMaterialService;
    private final SubjectService subjectService;
    private final MaterialService materialService;

    @GetMapping
    public ResponseEntity<?> getSavedMaterials(@RequestParam String subjectName) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            List<MaterialResponse> materials = materialService.getSavedMaterialsForStudentFromSubject(username, subjectName);
            return ResponseEntity.ok(materials);
        } catch (UserNotFoundException | EntityNotFoundException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/{materialId}/remove")
    public ResponseEntity<?> removeSavedMaterial(@PathVariable Integer materialId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            savedMaterialService.removeSavedMaterial(username, materialId);
            return ResponseEntity.ok().build();
        } catch (UserNotFoundException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/subjects")
    public ResponseEntity<?> getSubjectsWithSavedMaterials(@RequestParam Integer year) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try{
            List<SubjectSimple> subjectsWithSavedMaterial = subjectService.getSubjectsWithSavedMaterials(year, username);
            return ResponseEntity.ok(subjectsWithSavedMaterial);
        }catch (UserNotFoundException ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/filtered-subjects")
    public ResponseEntity<?> getFilteredSubjectsWithSavedMaterials(@RequestParam Integer year) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try{
            List<SubjectSimple> subjectsWithSavedMaterial = subjectService.getFilteredSubjectsWithSavedMaterials(year, username);
            return ResponseEntity.ok(subjectsWithSavedMaterial);
        }catch (UserNotFoundException | EntityNotFoundException ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
