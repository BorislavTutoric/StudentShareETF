package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.enums.Modul;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.enums.TipAkcije;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.LikePostResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Advice;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.LikePost;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.LikePostRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikePostService {

    private final LikePostRepository likePostRepository;
    private final StudentService studentService;
    private final AdviceService adviceService;
    private final UserService userService;
    private final AuditLogService auditLogService;

    private Student getStudentByUsername(String username) throws UserNotFoundException, EntityNotFoundException {

        User user = userService.getUserByUsername(username);
        return studentService.getStudentByUser(user);
    }

    @Transactional(readOnly = true)
    public LikePostResponse getLikeStatus(Integer adviceId, String currentUsername) throws EntityNotFoundException {
        Advice advice = adviceService.getAdviceById(adviceId);

        long totalLikes = likePostRepository.countByAdvice(advice);
        boolean isLikedByMe = false;

        try {
            Student student = getStudentByUsername(currentUsername);
            Optional<LikePost> existingLike = likePostRepository.findByAdviceAndStudent(advice, student);
            isLikedByMe = existingLike.isPresent();
        } catch (UserNotFoundException | EntityNotFoundException e) {

        }

        return new LikePostResponse(totalLikes, isLikedByMe);
    }


    @Transactional
    public LikePostResponse toggleLike(Integer adviceId, String currentUsername) throws EntityNotFoundException, UserNotFoundException {
        Student student = getStudentByUsername(currentUsername);
        Advice advice = adviceService.getAdviceById(adviceId);

        Optional<LikePost> existingLike = likePostRepository.findByAdviceAndStudent(advice, student);
        boolean currentlyLiked = existingLike.isPresent();

        if (currentlyLiked) {
            likePostRepository.delete(existingLike.get());
            currentlyLiked = false;
        } else {
            LikePost newLike = new LikePost(advice, student);
            likePostRepository.save(newLike);
            currentlyLiked = true;
        }

        long totalLikes = likePostRepository.countByAdvice(advice);

        User korisnik = student.getUser();
        auditLogService.log(korisnik,
                currentlyLiked ? TipAkcije.SVIDJANJE : TipAkcije.UKLANJANJE_SVIDJANJA,
                Modul.SAVJETI, "SAVJET", advice.getId(),
                "Korisnik \"" + korisnik.getUsername() + "\" je " + (currentlyLiked ? "označio da mu se sviđa" : "uklonio sviđanje sa")
                        + " savjet: " + AuditLogService.isjecak(advice.getContent()));

        return new LikePostResponse(totalLikes, currentlyLiked);
    }

}