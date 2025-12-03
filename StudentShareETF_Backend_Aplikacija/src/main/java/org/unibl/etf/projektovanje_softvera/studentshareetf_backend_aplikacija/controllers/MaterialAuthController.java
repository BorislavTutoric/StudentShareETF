package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialCommentRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialReviewRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialReviewResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.generics.UserHolder;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.MaterialCommentService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.MaterialReviewService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.MaterialService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.SavedMaterialService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/materials")
@RequiredArgsConstructor
public class MaterialAuthController {

    private final MaterialCommentService materialCommentService;
    private final MaterialReviewService materialReviewService;
    private final SavedMaterialService savedMaterialService;
    private final MaterialService materialService;

    @GetMapping("/{materialId}/comments")
    public List<MaterialCommentResponse> getKomentariPoMaterijalId(@PathVariable Integer materialId){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return materialCommentService.getCommentsByMaterialId(materialId, username);
    }

    @GetMapping("/{materialId}/review")
    public List<MaterialReviewResponse> getRecenzijePoMaterijalId(@PathVariable Integer materialId){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return materialReviewService.getReviewsByMaterialId(materialId, username);
    }

    @PostMapping("/{materialId}/add-comment")
    public ResponseEntity<?> addComment(@PathVariable Integer materialId, String content){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            materialCommentService.postComment(username, content, materialId);
            return ResponseEntity.ok().build();
        } catch (UserNotFoundException | EntityNotFoundException ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/{materialId}/add-review")
    public ResponseEntity<?> addReview(@PathVariable Integer materialId, Integer review){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try{
            materialReviewService.postReview(username, review, materialId);
            return ResponseEntity.ok().build();
        } catch (UserNotFoundException | EntityNotFoundException ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/{materialId}/save-material")
    public ResponseEntity<?> saveMaterial(@PathVariable Integer materialId){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            savedMaterialService.materialSave(username, materialId);
            return ResponseEntity.ok().build();
        } catch (UserNotFoundException | EntityNotFoundException ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/{commentId}/report-comment")
    public ResponseEntity<?> reportComment(@PathVariable Integer commentId){
        try {
            materialCommentService.commentReport(commentId);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadMaterial(
            @RequestParam("file") MultipartFile file,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("subject") String subjectName) {

        String username =  SecurityContextHolder.getContext().getAuthentication().getName();

        try{
            materialService.uploadMaterial(subjectName, username, file, description, category);
            return ResponseEntity.ok().build();
        }catch (IOException ex){
            return ResponseEntity.badRequest().body("Greška pri upload fajla!");
        }catch (EntityNotFoundException | UserNotFoundException ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
