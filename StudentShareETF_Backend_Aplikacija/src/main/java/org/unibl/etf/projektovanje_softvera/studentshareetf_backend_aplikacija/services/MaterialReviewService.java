package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AverageReview;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialReviewResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialCommentRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialReviewRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MaterialReviewService {

    private final MaterialReviewRepository materialReviewRepository;
    private final UserService userService;
    private final MaterialService materialService;


    public List<MaterialReviewResponse> getReviewsByMaterialId(Integer materialId, String username) {

        List<MaterialReview> reviews = materialReviewRepository.findReviewsOfActiveUsersByMaterialId(materialId);
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

    public MaterialReviewResponse postReview(String username, Integer review, Integer materialId) throws UserNotFoundException, EntityNotFoundException {
        User user = userService.getUserByUsername(username);
        Material material = materialService.getMaterialById(materialId);
        LocalDateTime dateTime = LocalDateTime.now();
        MaterialReview materialReview = new MaterialReview(review, dateTime, material, user);
        MaterialReviewResponse materialReviewResponse = new MaterialReviewResponse(review, dateTime, user.getName(), user.getSurname(), true);
        materialReviewRepository.save(materialReview);
        return materialReviewResponse;
    }

    @Transactional
    public void reviewDelete(String username, Integer materialId) throws EntityNotFoundException, UserNotFoundException {
        Material material = materialService.getMaterialById(materialId);
        User student  = userService.getUserByUsername(username);
        materialReviewRepository.deleteByMaterijalIdAndStudentId(material.getMaterialId(), student.getUserId());
    }

    public List<AverageReview> getAverageRatings(String subjectName) {
        return materialReviewRepository.findAvgRatingsBySubjectName(subjectName);
    }

}
