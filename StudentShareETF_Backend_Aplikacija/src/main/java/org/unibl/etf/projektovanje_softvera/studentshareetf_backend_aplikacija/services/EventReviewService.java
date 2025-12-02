package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.ReviewRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.ReviewResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.compositeKeys.EventReviewKey;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.EventRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.EventReviewRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.StudentRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventReviewService {

    private final EventReviewRepository reviewRepository;
    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public ReviewResponse addReview(ReviewRequest request,Integer id,String username) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dogadjaj ne postoji"));

        Optional<User> u = userRepository.findByUsername(username);

        if(u.isPresent()) {
            User user = u.get();
            Student student = studentRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Student ne postoji"));

            EventReviewKey key = new EventReviewKey(event.getId(), student.getUserId());

            if (reviewRepository.existsById(key)) {
                throw new RuntimeException("Student je već ostavio recenziju za ovaj dogadjaj");
            }

            EventReview review = new EventReview();
            review.setId(key);
            review.setRating(request.getRating());
            review.setCreatedAt(LocalDateTime.now());

            reviewRepository.save(review);

            return new ReviewResponse(
                    key.getEventId(),
                    key.getStudentId(),
                    review.getRating(),
                    review.getCreatedAt().toString(),
                    user.getName(),
                    user.getSurname(),
                    true
            );
        }
        else
        {
            throw new UserNotFoundException(username);
        }
    }

    public List<ReviewResponse> getReviewsForEvent(Integer eventId, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        Student currentStudent = studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student ne postoji"));

        List<EventReview> reviews = reviewRepository.findById_EventId(eventId);

        return reviews.stream()
                .map(review -> {
                    Student reviewStudent = studentRepository.findById(review.getId().getStudentId())
                            .orElseThrow(() -> new RuntimeException("Student ne postoji"));

                    User reviewUser = userRepository.findById(reviewStudent.getUserId())
                            .orElseThrow();

                    boolean isMy = reviewStudent.getUserId().equals(currentStudent.getUserId());

                    return new ReviewResponse(
                            review.getId().getEventId(),
                            review.getId().getStudentId(),
                            review.getRating(),
                            review.getCreatedAt().toString(),
                            reviewUser.getName(),
                            reviewUser.getSurname(),
                            isMy
                    );
                })
                .collect(Collectors.toList());
    }
}
