package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AdviceCommentRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AdviceCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AdviceResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Advice;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.AdviceComment;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User; // Dodano
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.AdviceCommentRepository;
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
    public List<AdviceResponse> getPendingAdvicesForModerator() {

        List<AdviceComment> pendingAdvices = adviceCommentRepository.findByReportedTrue();

        return pendingAdvices.stream().map(advice -> {
            AdviceResponse response = new AdviceResponse();
            response.setId(advice.getId());
            response.setContent(advice.getContent());
            response.setDateTime(advice.getDateTime());
            response.setUsername(advice.getStudent().getUser().getUsername());
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

            String description = "Moderator " + moderator.getName() + " je odbio zahtjev za uklanjanje komentara na post " + adviceComment.getContent() + ".";
            moderatorAuditService.logAction(moderator,description);
        }
        else
        {
            adviceCommentRepository.delete(adviceComment);

            String description = "Moderator " + moderator.getName() + " je obrisao komentar na post korisnika " + adviceComment.getStudent().getUser().getUsername() + " čiji je sadržaj " + adviceComment.getContent();
            moderatorAuditService.logAction(moderator,description);

            String title = "Obavještenje o uklanjanju komentara na savjet";
            String message = "Vaš komentar na savjet " +  adviceComment.getContent() + " je uklonjen.";
            notificationsService.createNotification(title, message,adviceComment.getStudent());
        }
    }
}