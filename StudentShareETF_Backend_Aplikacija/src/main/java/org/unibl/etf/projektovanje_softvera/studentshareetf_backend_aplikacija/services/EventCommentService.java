package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventCommentRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Event;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.EventComment;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.EventCommentRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.EventRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.StudentRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventCommentService {

    private final EventCommentRepository commentRepo;
    private final EventRepository eventRepo;
    private final UserRepository userRepo;
    private final StudentRepository studentRepo;

    public EventCommentResponse createComment(EventCommentRequest request, Integer eventId, String username) {

        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Dogadjaj ne postoji"));

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        Student student = studentRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student ne postoji"));

        EventComment comment = new EventComment();
        comment.setContent(request.getContent());
        comment.setEvent(event);
        comment.setUser(user);
        comment.setDateTime(LocalDateTime.now());
        comment.setReported(false);

        commentRepo.save(comment);

        return new EventCommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getDateTime().toString(),
                user.getName(),
                user.getSurname(),
                true
        );
    }

    public List<EventCommentResponse> getCommentsForEvent(Integer eventId, String username) {

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        Student currentStudent = studentRepo.findByUser(user)
                .orElseThrow(() -> new UserNotFoundException("Student ne postoji"));


        List<EventComment> comments = commentRepo.findCommentsOfActiveUsersByEvent_Id(eventId);

        return comments.stream().map(c -> {

            User commentUser = c.getUser();
            Student commentStudent = studentRepo.findByUser(commentUser)
                    .orElseThrow(() -> new RuntimeException("Student ne postoji"));

            boolean isMy = commentStudent.getUserId().equals(currentStudent.getUserId());

            return new EventCommentResponse(
                    c.getId(),
                    c.getContent(),
                    c.getDateTime().toString(),
                    commentUser.getName(),
                    commentUser.getSurname(),
                    isMy
            );
        }).collect(Collectors.toList());
    }


    public void deleteComment(Integer commentId, String username) {

        EventComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Komentar ne postoji"));

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        if (!comment.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Ne možete obrisati tuđi komentar");
        }

        commentRepo.delete(comment);
    }

    public void reportComment(Integer commentId, String username) {

        EventComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Komentar ne postoji"));

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        if (comment.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Ne možete prijaviti vlastiti komentar");
        }

        comment.setReported(true);
        commentRepo.save(comment);
    }
}
