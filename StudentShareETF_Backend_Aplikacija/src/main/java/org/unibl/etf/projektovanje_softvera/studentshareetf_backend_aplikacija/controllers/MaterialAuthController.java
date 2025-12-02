package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
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

    @GetMapping("/comments")
    public List<MaterialCommentResponse> getKomentariPoMaterijalId(@RequestParam Integer materijalId){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return materialCommentService.getCommentsByMaterialId(materijalId, username);
    }

    @GetMapping("/review")
    public List<MaterialReviewResponse> getRecenzijePoMaterijalId(@RequestParam Integer materijalId){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return materialReviewService.getReviewsByMaterialId(materijalId, username);
    }

    @PostMapping("/add-comment")
    public ResponseEntity<?> addComment(@RequestBody MaterialCommentRequest materialComment){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            materialCommentService.postComment(username, materialComment.getContent(), materialComment.getMaterialId());
            return ResponseEntity.ok().build();
        } catch (UserNotFoundException | EntityNotFoundException ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/add-review")
    public ResponseEntity<?> addReview(@RequestBody MaterialReviewRequest materialReview){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try{
            materialReviewService.postReview(username, materialReview.getReview(), materialReview.getMaterialId());
            return ResponseEntity.ok().build();
        } catch (UserNotFoundException | EntityNotFoundException ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/save-material")
    public ResponseEntity<?> saveMaterial(@RequestBody Integer materialId){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            savedMaterialService.materialSave(username, materialId);
            return ResponseEntity.ok().build();
        } catch (UserNotFoundException | EntityNotFoundException ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    /*@PostMapping("/upload")
    public ResponseEntity<?> uploadMaterial(
            @RequestParam("file") MultipartFile file,
            @RequestParam("naziv") String naziv,
            @RequestParam("opis") String opis) throws IOException {

        Materijal materijal = materijalService.uploadMaterijal(file, naziv, opis);
        return ResponseEntity.ok(materijal);
    }*/
    
}
