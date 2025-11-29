package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialReviewResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.generics.UserHolder;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.MaterialCommentService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.MaterialReviewService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.MaterialService;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
@RequiredArgsConstructor
public class MaterialAuthController {

    private final MaterialCommentService  materialCommentService;
    private final MaterialReviewService materialReviewService;

    @GetMapping("/comments")
    public List<MaterialCommentResponse> getKomentariPoMaterijalId(@RequestParam Integer materijalId){

        return materialCommentService.getCommentsByMaterialId(materijalId);
    }

    @GetMapping("/review")
    public List<MaterialReviewResponse> getRecenzijePoMaterijalId(@RequestParam Integer materijalId){
        return materialReviewService.getReviewsByMaterialId(materijalId);
    }

    //Ilinois
    @GetMapping("/myReview")
    public
}
