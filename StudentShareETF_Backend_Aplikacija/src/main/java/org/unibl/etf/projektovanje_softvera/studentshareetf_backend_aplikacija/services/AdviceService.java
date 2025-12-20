package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AdviceResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.AdviceCommentRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.AdviceRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.LikePostRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.SubjectRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdviceService {

    private final AdviceRepository adviceRepository;
    private final LikePostRepository likePostRepository;
    private final SubjectRepository subjectRepository;
    private final AdviceCommentRepository adviceCommentRepository;
    private final UserService userService;
    private final StudentService studentService;
    private final AdviceCommentService adviceCommentService;
    private final ModeratorAuditService moderatorAuditService;
    private final NotificationsService notificationsService;

    private Student getStudentByUsername(String username) throws UserNotFoundException, EntityNotFoundException {
        User user = userService.getUserByUsername(username);
        return studentService.getStudentByUser(user);
    }

    private Subject getSubjectById(Integer subjectId) throws EntityNotFoundException {
        return subjectRepository.findById(subjectId)
                .orElseThrow(() -> new EntityNotFoundException("Predmet s ID-om: " + subjectId + " nije pronađen."));
    }


    public Advice getAdviceById(Integer adviceId) throws EntityNotFoundException {
        return adviceRepository.findById(adviceId)
                .orElseThrow(() -> new EntityNotFoundException("Savjet (Post) s ID-om: " + adviceId + " nije pronađen."));
    }

    private AdviceResponse mapToAdviceResponse(Advice advice, Map<Integer, Long> likesCountMap, Map<Integer, Long> commentsCountMap, Set<Integer> likedByCurrentStudent, String currentUsername) {
        Long likes = likesCountMap.getOrDefault(advice.getId(), 0L);
        boolean isLiked = likedByCurrentStudent.contains(advice.getId());

        Student student = advice.getStudent();
        boolean isMine = student.getUser().getUsername().equals(currentUsername);

        Integer numOfComments = adviceCommentService.getNumberOfComments(advice);


        return new AdviceResponse(
                advice.getId(),
                advice.getContent(),
                advice.getDateTime(),
                advice.isReported(),
                student.getUser().getUsername(),
                student.getUser().getName(),
                student.getUser().getSurname(),
                likes.intValue(),
                numOfComments,
                isLiked,
                isMine
        );
    }


    public List<AdviceResponse> getAdvicesBySubject(Integer subjectId, String currentUsername) throws UserNotFoundException, EntityNotFoundException {
        Student currentStudent = getStudentByUsername(currentUsername);
        Subject subject = getSubjectById(subjectId);
        List<Advice> allAdvices = adviceRepository.findBySubject(subject, Sort.by(Sort.Direction.DESC, "dateTime"));

        Map<Integer, Long> commentsCountMap = adviceCommentRepository.countTopLevelByAdviceIn(allAdvices).stream()
                .collect(Collectors.toMap(
                        tuple -> (Integer) tuple[0],
                        tuple -> (Long) tuple[1]
                ));

        List<LikePost> allLikes = likePostRepository.findByAdviceIn(allAdvices);
        Map<Integer, Long> likesCountMap = allLikes.stream()
                .collect(Collectors.groupingBy(like -> like.getAdvice().getId(), Collectors.counting()));

        Set<Integer> likedByCurrentStudent = likePostRepository.findByStudent(currentStudent).stream()
                .map(like -> like.getAdvice().getId())
                .collect(Collectors.toSet());

        List<AdviceResponse> adviceResponses = allAdvices.stream()
                .map(advice -> mapToAdviceResponse(advice, likesCountMap, commentsCountMap, likedByCurrentStudent, currentUsername))
                .collect(Collectors.toList());
        adviceResponses.sort((a, b) -> {
            if (a.isMyAdvice() && !b.isMyAdvice()) return -1;
            if (!a.isMyAdvice() && b.isMyAdvice()) return 1;

            int likesComparison = b.getLikesCount().compareTo(a.getLikesCount());
            if (likesComparison != 0) return likesComparison;
            return b.getDateTime().compareTo(a.getDateTime());
        });

        return adviceResponses;
    }

    @Transactional
    public void createAdvice(Integer subjectId, String currentUsername, String content) throws UserNotFoundException, EntityNotFoundException {
        Student student = getStudentByUsername(currentUsername);
        Subject subject = getSubjectById(subjectId);

        Advice advice = new Advice(content, subject, student);
        adviceRepository.save(advice);
    }

    @Transactional
    public boolean toggleLike(Integer adviceId, String currentUsername) throws UserNotFoundException, EntityNotFoundException {
        Student currentStudent = getStudentByUsername(currentUsername);
        Advice advice = getAdviceById(adviceId);

        Optional<LikePost> existingLike = likePostRepository.findByAdviceAndStudent(advice, currentStudent);

        if (existingLike.isPresent()) {
            likePostRepository.delete(existingLike.get());
            return false;
        }
        else {
            LikePost newLike = new LikePost(advice, currentStudent);
            likePostRepository.save(newLike);
            return true;
        }
    }

    @Transactional
    public void reportAdvice(Integer adviceId) throws EntityNotFoundException {
        Advice advice = adviceRepository.findById(adviceId)
                .orElseThrow(() -> new EntityNotFoundException("Post nije pronađen."));
        advice.setReported(true);
        adviceRepository.save(advice);
    }

    @Transactional
    public void deleteAdvice(Integer adviceId, String currentUsername)
            throws EntityNotFoundException {

        Advice advice = adviceRepository.findById(adviceId)
                .orElseThrow(() -> new EntityNotFoundException("Post (Savjet) nije pronađen."));

        if (!advice.getStudent().getUser().getUsername().equals(currentUsername)) {
            throw new RuntimeException("ZABRANJENO: Korisnik " + currentUsername + " nije autor posta i ne može ga obrisati.");
        }
        adviceCommentService.deleteComments(advice);
        adviceRepository.delete(advice);
    }

    @Transactional(readOnly = true)
    public List<AdviceResponse> getPendingAdvicesForModerator() {

        List<Advice> pendingAdvices = adviceRepository.findByReportedTrue();

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

        Advice advice = adviceRepository.findById(adviceId)
                .orElseThrow(() -> new EntityNotFoundException("Post ne postoji"));

        if(approved) {
            advice.setReported(false);
            adviceRepository.save(advice);

            String description = "Moderator " + moderator.getName() + " je odbio zahtjev za uklanjanje posta " + advice.getContent() + ".";
            moderatorAuditService.logAction(moderator,description);
        }
        else
        {
            adviceRepository.delete(advice);

            String description = "Moderator " + moderator.getName() + " je obrisao post korisnika " + advice.getStudent().getUser().getUsername() + " čiji je sadržaj " + advice.getContent();
            moderatorAuditService.logAction(moderator,description);

            String title = "Obavještenje o uklanjanju savjeta";
            String message = "Vaš savjet " +  advice.getContent() + " je uklonjen.";
            notificationsService.createNotification(title, message,advice.getStudent());
        }
    }



}