package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.ReviewRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.ReviewResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Event;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Review;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.ReviewKey;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.EventRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.ReviewRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.StudentRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;

    public ReviewResponse addReview(ReviewRequest request) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Dogadjaj ne postoji"));

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student ne postoji"));

        ReviewKey key = new ReviewKey(event.getId(), student.getUserId());

        if (reviewRepository.existsById(key)) {
            throw new RuntimeException("Student je već ostavio recenziju za ovaj dogadjaj");
        }

        Review review = new Review();
        review.setId(key);
        review.setRating(request.getRating());
        review.setCreatedAt(LocalDateTime.now());

        reviewRepository.save(review);

        return new ReviewResponse(
                key.getEventId(),
                key.getStudentId(),
                review.getRating(),
                review.getCreatedAt().toString()
        );
    }

    public List<ReviewResponse> getReviewsForEvent(Integer eventId) {
        return reviewRepository.findByIdEventId(eventId)
                .stream()
                .map(r -> new ReviewResponse(
                        r.getId().getEventId(),
                        r.getId().getStudentId(),
                        r.getRating(),
                        r.getCreatedAt().toString()
                ))
                .collect(Collectors.toList());
    }
}
