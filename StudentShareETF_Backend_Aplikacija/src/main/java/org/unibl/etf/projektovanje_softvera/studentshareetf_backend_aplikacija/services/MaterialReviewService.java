package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialReviewResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.MaterialComments;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.MaterialReview;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialCommentRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialReviewRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialReviewService {

    private final MaterialReviewRepository materialReviewRepository;


    public List<MaterialReviewResponse> getReviewsByMaterialId(Integer materialId) {

        List<MaterialReview> reviews = materialReviewRepository.findByMaterijal_MaterialId(materialId);
        List<MaterialReviewResponse> reviewResponses = new ArrayList<>();
        for (MaterialReview review : reviews) {
            User user = review.getUser();
            reviewResponses.add(new MaterialReviewResponse(review.getOcjena(),review.getDatumVrijeme(),user.getName(),user.getSurname()));
        }
        return reviewResponses;
    }
}
