package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventReview;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.generics.UserHolder;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.EventCommentService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.EventService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.EventReviewService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventCommentResponse;

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


    @GetMapping("/{eventId}/comments")
    public ResponseEntity<?> getCommentsForEvent(@PathVariable Integer eventId) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            List<EventCommentResponse> comments = commentService.getCommentsForEvent(eventId,username);
            return ResponseEntity.ok(comments);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/{eventId}/comments")
    public ResponseEntity<?> createCommentForEvent(@PathVariable Integer eventId,@RequestBody EventCommentRequest request) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            EventCommentResponse response= commentService.createComment(request, eventId, username);
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }




}


