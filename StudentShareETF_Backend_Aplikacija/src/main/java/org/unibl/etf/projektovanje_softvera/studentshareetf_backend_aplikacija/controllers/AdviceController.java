package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AdviceCommentRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AdviceCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AdviceResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AdviceRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Advice;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.AdviceService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.AdviceCommentService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.SubjectAdvice;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.SubjectService;

import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.LikePostService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.LikePostResponse;

import java.util.List;

@RestController
@RequestMapping("/api/advices")
@RequiredArgsConstructor
public class AdviceController {

    private final AdviceService adviceService;
    private final AdviceCommentService adviceCommentService;
    private final SubjectService subjectService;
    private final LikePostService likePostService;

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/subjects-with-id")
    public ResponseEntity<List<SubjectAdvice>> getSubjectsWithId(@RequestParam Integer year) {
        try {
            List<SubjectAdvice> subjects = subjectService.getSubjectsForAdvice(year);
            return ResponseEntity.ok(subjects);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }

    @GetMapping("/by-id")
    public ResponseEntity<List<AdviceResponse>> getAdvicesBySubjectId(@RequestParam("id") Integer subjectId) {
        String username = getCurrentUsername();
        try {
            List<AdviceResponse> advices = adviceService.getAdvicesBySubject(subjectId, username);
            return ResponseEntity.ok(advices);
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of());
        } catch (UserNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(List.of());
        }
    }

    @PostMapping("/by-id")
    public ResponseEntity<?> createAdviceById(@RequestBody AdviceRequest request) {
        String username = getCurrentUsername();
        try {
            adviceService.createAdvice(request.getSubjectId(), username, request.getContent());
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (UserNotFoundException | EntityNotFoundException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @Transactional
    @PutMapping("/{adviceId}/like")
    public ResponseEntity<LikePostResponse> toggleLike(@PathVariable Integer adviceId) {
        String username = getCurrentUsername();
        try {
            LikePostResponse response = likePostService.toggleLike(adviceId, username);
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException | EntityNotFoundException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{adviceId}/report")
    public ResponseEntity<?> reportAdvice(@PathVariable Integer adviceId) {
        try {
            adviceService.reportAdvice(adviceId);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{adviceId}/comments")
    public ResponseEntity<List<AdviceCommentResponse>> getCommentsByAdviceId(@PathVariable Integer adviceId){
        String username = getCurrentUsername();
        try {
            Advice advice = adviceService.getAdviceById(adviceId);
            List<AdviceCommentResponse> comments = adviceCommentService.getCommentsByAdviceId(advice, username);
            return ResponseEntity.ok(comments);
        } catch (EntityNotFoundException ex){
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/comments")
    public ResponseEntity<?> postComment(@RequestBody AdviceCommentRequest request){
        String username = getCurrentUsername();
        try {
            Advice advice = adviceService.getAdviceById(request.getAdviceId());
            adviceCommentService.postComment(username, request, advice);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (UserNotFoundException | EntityNotFoundException ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/comments/{commentId}/report")
    public ResponseEntity<?> reportComment(@PathVariable Integer commentId){
        try {
            adviceCommentService.reportComment(commentId);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException ex){
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{adviceId}/likes")
    public ResponseEntity<LikePostResponse> getLikeStatus(@PathVariable Integer adviceId) {
        String username = getCurrentUsername();
        try {
            LikePostResponse response = likePostService.getLikeStatus(adviceId, username);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{adviceId}/delete")
    public ResponseEntity<?> deleteAdvice(@PathVariable Integer adviceId) {
        String username = getCurrentUsername();
        try {
            adviceService.deleteAdvice(adviceId, username);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.notFound().build();
        } catch (RuntimeException ex) {
            if (ex.getMessage().startsWith("ZABRANJENO:")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Integer commentId) {
        String username = getCurrentUsername();
        try {
            adviceCommentService.deleteComment(commentId, username);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.notFound().build();
        } catch (RuntimeException ex) {
            if (ex.getMessage().startsWith("ZABRANJENO:")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }
}