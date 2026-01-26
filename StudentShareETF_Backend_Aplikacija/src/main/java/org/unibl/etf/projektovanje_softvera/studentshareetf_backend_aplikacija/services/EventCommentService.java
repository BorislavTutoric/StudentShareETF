package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventCommentRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventCommentResponseForModerator;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.*;
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
    private final UserService userService;
    private final ModeratorAuditService  moderatorAuditService;
    private final NotificationsService notificationsService;
    private final StudentService  studentService;

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
            boolean isMy = c.getUser().getUserId().equals(currentStudent.getUserId());

            return new EventCommentResponse(
                    c.getId(),
                    c.getContent(),
                    c.getDateTime().toString(),
                    c.getUser().getName(),
                    c.getUser().getSurname(),
                    isMy
            );
        }).collect(Collectors.toList());
    }

    public List<EventCommentResponse> getComments(Integer eventId) {

        List<EventComment> comments = commentRepo.findCommentsOfActiveUsersByEvent_Id(eventId);

        return comments.stream().map(c ->
                new EventCommentResponse(
                        c.getId(),
                        c.getContent(),
                        c.getDateTime().toString(),
                        c.getUser().getName(),
                        c.getUser().getSurname(),
                        false
                )
        ).collect(Collectors.toList());
    }


    public void deleteById(Integer commentId, String username) throws EntityNotFoundException {
        EventComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Komentar ne postoji"));
        User moderator = userService.getUserByUsername(username);
        commentRepo.delete(comment);
        String description = "Moderator :" + moderator.getName() + " je obrisao komentar korisnika :" + comment.getUser().getUsername() + " čiji je sadržaj \"" + comment.getContent() + "\".";
        moderatorAuditService.logAction(moderator,description);
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

    @Transactional(readOnly = true)
    public List<EventCommentResponseForModerator> getPendingEventCommentForModerator() {

        List<EventComment> pendingComments = commentRepo.findByReportedTrue();

        return pendingComments.stream().map(comment -> {
            EventCommentResponseForModerator response = new EventCommentResponseForModerator();
            response.setId(comment.getId());
            response.setContent(comment.getContent());
            response.setDate(comment.getDateTime().toString());
            response.setName(comment.getUser().getName());
            response.setSurname(comment.getUser().getSurname());
            response.setMyComment(false);
            response.setStudentId(comment.getUser().getUserId());
            response.setStudentName(comment.getUser().getName() + " "  + comment.getUser().getSurname() + " (" +  comment.getUser().getUsername() + ")");
            return response;
        }).collect(Collectors.toList());
    }


    @Transactional
    public void reviewEventComment(Integer commentId, boolean approved, String username) throws EntityNotFoundException {

        User moderator = userService.getUserByUsername(username);

        EventComment eventComment = commentRepo.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Komentar ne postoji"));

        if(approved) {
            eventComment.setReported(false);
            commentRepo.save(eventComment);

            String description = "Moderator: " + moderator.getUsername() + " je odbio zahtjev za uklanjanje komentara korisnika :" + eventComment.getUser().getUsername() + " čiji je sadržaj \"" + eventComment.getContent() + "\".";
            moderatorAuditService.logAction(moderator,description);
        }
        else
        {
            commentRepo.deleteById(commentId);

            String description = "Moderator: " + moderator.getUsername() + " je obrisao komentar korisnika :" + eventComment.getUser().getUsername() + " čiji je sadržaj \"" + eventComment.getContent() + "\".";
            moderatorAuditService.logAction(moderator,description);

            String title = "Obavještenje o uklanjanju komentara";
            String message = "Vaš komentar \"" +  eventComment.getContent() + "\" je uklonjen.";
            notificationsService.createNotification(title, message,studentService.getStudentByUser(eventComment.getUser()),LocalDateTime.now(),LocalDateTime.now());
        }
    }
}
