package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialReviewResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Material;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.MaterialComments;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.MaterialReview;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialCommentRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialReviewRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialReviewService {

    private final MaterialReviewRepository materialReviewRepository;
    private final UserService userService;
    private final MaterialService materialService;


    public List<MaterialReviewResponse> getReviewsByMaterialId(Integer materialId, String username) {

        List<MaterialReview> reviews = materialReviewRepository.findByMaterijal_MaterialId(materialId);
        List<MaterialReviewResponse> reviewResponses = new ArrayList<>();
        for (MaterialReview review : reviews) {
            User user = review.getUser();
            if (username.equals(user.getUsername())) {
                reviewResponses.add(new MaterialReviewResponse(review.getOcjena(), review.getDatumVrijeme(), user.getName(), user.getSurname(), true));
            } else {
                reviewResponses.add(new MaterialReviewResponse(review.getOcjena(), review.getDatumVrijeme(), user.getName(), user.getSurname(), false));
            }
        }
        return reviewResponses;
    }

    public void postReview(String username, Integer review, Integer materialId) throws UserNotFoundException, EntityNotFoundException {
        User user = userService.getUserByUsername(username);
        Material material = materialService.getMaterialById(materialId);
        LocalDateTime dateTime = LocalDateTime.now();
        MaterialReview materialReview = new MaterialReview(review, dateTime, material, user);
        materialReviewRepository.save(materialReview);
    }

}
