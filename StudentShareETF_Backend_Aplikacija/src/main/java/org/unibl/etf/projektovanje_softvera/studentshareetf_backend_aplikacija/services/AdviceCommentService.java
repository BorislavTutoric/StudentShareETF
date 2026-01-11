package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AdviceCommentRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AdviceCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AdviceForModeratorResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AdviceResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.AdviceCommentRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdviceCommentService {

    private final AdviceCommentRepository adviceCommentRepository;
    private final StudentService studentService;
    private final UserService userService;
    private final ModeratorAuditService moderatorAuditService;
    private final NotificationsService notificationsService;

    private Student getStudentByUsername(String username) throws UserNotFoundException, EntityNotFoundException {
        User user = userService.getUserByUsername(username);
        return studentService.getStudentByUser(user);
    }

    private AdviceCommentResponse mapToResponse(AdviceComment comment, String currentUsername) {
        Student author = comment.getStudent();

        return new AdviceCommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getDateTime(),
                comment.isReported(),
                author.getUser().getUsername(),
                author.getUser().getName(),
                author.getUser().getSurname(),
                author.getUser().getUsername().equals(currentUsername),
                comment.getParentComment() != null ? comment.getParentComment().getId() : null,
                new ArrayList<>()
        );
    }

    private List<AdviceCommentResponse> buildCommentTree(List<AdviceComment> flatComments, String currentUsername) {

        Map<Integer, AdviceCommentResponse> commentMap = flatComments.stream()
                .collect(Collectors.toMap(
                        AdviceComment::getId,
                        comment -> mapToResponse(comment, currentUsername)
                ));

        List<AdviceCommentResponse> rootComments = new ArrayList<>();

        for (AdviceComment comment : flatComments) {
            AdviceCommentResponse response = commentMap.get(comment.getId());

            if (comment.getParentComment() == null) {
                rootComments.add(response);
            } else {
                AdviceCommentResponse parentResponse = commentMap.get(comment.getParentComment().getId());
                if (parentResponse != null) {
                    parentResponse.getReplies().add(response);
                }
            }
        }
        return rootComments;
    }

    @Transactional(readOnly = true)
    public List<AdviceCommentResponse> getCommentsByAdviceId(Advice advice, String currentUsername) throws EntityNotFoundException {

        List<AdviceComment> flatComments = adviceCommentRepository.findAllByAdviceWithDetails(advice);
        return buildCommentTree(flatComments, currentUsername);
    }

    @Transactional
    public void postComment(String currentUsername, AdviceCommentRequest request, Advice advice) throws UserNotFoundException, EntityNotFoundException {

        Student student = getStudentByUsername(currentUsername);

        AdviceComment parentComment = null;

        if (request.getParentCommentId() != null) {
            parentComment = adviceCommentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new EntityNotFoundException("Roditeljski komentar nije pronađen."));
        }

        AdviceComment newComment = new AdviceComment(request.getContent(), advice, student, parentComment);
        adviceCommentRepository.save(newComment);
    }

    @Transactional
    public void reportComment(Integer commentId) throws EntityNotFoundException {
        AdviceComment comment = adviceCommentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Komentar nije pronađen."));

        comment.setReported(true);
        adviceCommentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Integer commentId, String currentUsername)
            throws EntityNotFoundException {

        AdviceComment comment = adviceCommentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Komentar nije pronađen."));

        if (!comment.getStudent().getUser().getUsername().equals(currentUsername)) {
            throw new RuntimeException("ZABRANJENO: Korisnik " + currentUsername + " nije autor komentara i ne može ga obrisati.");
        }

        adviceCommentRepository.delete(comment);
    }

    public Integer getNumberOfComments(Advice advice) {
        return adviceCommentRepository.findByAdvice(advice).size();
    }

    @Transactional
    public void deleteComments(Advice advice) {
        adviceCommentRepository.deleteByAdvice(advice);
    }

    @Transactional(readOnly = true)
    public List<AdviceForModeratorResponse> getPendingAdvicesForModerator() {

        List<AdviceComment> pendingAdviceComments = adviceCommentRepository.findByReportedTrue();

        return pendingAdviceComments.stream().map(advice -> {
            AdviceForModeratorResponse response = new AdviceForModeratorResponse();
            response.setAdviceId(advice.getId());
            response.setStudentId(advice.getStudent().getUserId());
            response.setContent(advice.getContent());
            response.setDate(advice.getDateTime().toString());
            String name = advice.getStudent().getUser().getName() + " " + advice.getStudent().getUser().getSurname() + " (" + advice.getStudent().getUser().getUsername() + ")";
            response.setStudentName(name);
            Subject subject = advice.getAdvice().getSubject();
            response.setSubject(subject.getName());
            return response;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void reviewAdvice(Integer adviceId, boolean approved, String username) throws EntityNotFoundException {

        User moderator = userService.getUserByUsername(username);

        AdviceComment adviceComment = adviceCommentRepository.findById(adviceId)
                .orElseThrow(() -> new EntityNotFoundException("Post ne postoji"));

        if(approved) {
            adviceComment.setReported(false);
            adviceCommentRepository.save(adviceComment);

            String description = "Moderator :" + moderator.getUsername() + " je odbio zahtjev za uklanjanje komentara na post \"" + adviceComment.getContent() + "\".";
            moderatorAuditService.logAction(moderator,description);
        }
        else
        {
            adviceCommentRepository.delete(adviceComment);

            String description = "Moderator :" + moderator.getUsername() + " je obrisao komentar na post korisnika :" + adviceComment.getStudent().getUser().getUsername() + " čiji je sadržaj \"" + adviceComment.getContent() + "\".";
            moderatorAuditService.logAction(moderator,description);

            String title = "Obavještenje o uklanjanju komentara na savjet";
            String message = "Vaš komentar na savjet \"" +  adviceComment.getContent() + "\" je uklonjen.";
            notificationsService.createNotification(title, message,adviceComment.getStudent(), LocalDateTime.now(),LocalDateTime.now());
        }
    }
}