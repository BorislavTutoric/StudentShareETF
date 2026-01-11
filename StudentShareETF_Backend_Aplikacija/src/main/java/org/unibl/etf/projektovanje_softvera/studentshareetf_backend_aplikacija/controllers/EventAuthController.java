package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventReview;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.generics.UserHolder;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.EventCommentService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.EventService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.EventReviewService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Event;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.StorageService;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventAuthController {
    private final EventService eventService;
    private final EventReviewService reviewService;
    private final EventCommentService commentService;
    private final StorageService storageService;

    @GetMapping
    public ResponseEntity<?> getAllActiveEvents() {
        try {
            List<EventResponse> events = eventService.getAllAktivniDogadjaji();
            return ResponseEntity.ok(events);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Integer id) {
        try {
            EventResponse event = eventService.getDogadjajById(id);
            return ResponseEntity.ok(event);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{eventId}/reviews")
    public ResponseEntity<?> getReviewsForEvent(@PathVariable Integer eventId) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            List<ReviewResponse> reviews = reviewService.getReviewsForEvent(eventId, username);
            return ResponseEntity.ok(reviews);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/{eventId}/reviews")
    public ResponseEntity<?> addReview(@PathVariable Integer eventId, @RequestBody ReviewRequest request) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            ReviewResponse response = reviewService.addReview(request, eventId, username);
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }


    @DeleteMapping("/{eventId}/reviews")
    public ResponseEntity<?> deleteReview(@PathVariable Integer eventId) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            reviewService.deleteReview(eventId, username);
            return ResponseEntity.ok(Map.of("message", "Recenzija uspješno obrisana"));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }


    @GetMapping("/{eventId}/comments")
    public ResponseEntity<?> getCommentsForEvent(@PathVariable Integer eventId) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            List<EventCommentResponse> comments = commentService.getCommentsForEvent(eventId, username);
            return ResponseEntity.ok(comments);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/{eventId}/comments/moderator")
    public ResponseEntity<?> getComments(@PathVariable Integer eventId) {
        try {
            List<EventCommentResponse> comments = commentService.getComments(eventId);
            return ResponseEntity.ok(comments);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/{eventId}/comments")
    public ResponseEntity<?> createCommentForEvent(@PathVariable Integer eventId, @RequestBody EventCommentRequest request) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            EventCommentResponse response = commentService.createComment(request, eventId, username);
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Event> createEvent(@ModelAttribute EventCreateRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            Event event = eventService.createEvent(request, username);
            return ResponseEntity.ok(event);
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Greška prilikom kreiranja dogadjaja", e);
        }
    }

    @DeleteMapping("/{commentId}/comments")
    public ResponseEntity<?> deleteComment(@PathVariable Integer commentId) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            commentService.deleteComment(commentId, username);
            return ResponseEntity.ok(Map.of("message", "Komentar obrisan"));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/{commentId}/report-comment")
    public ResponseEntity<?> reportComment(@PathVariable Integer commentId) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            commentService.reportComment(commentId, username);
            return ResponseEntity.ok(Map.of("message", "Komentar prijavljen"));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }


}


