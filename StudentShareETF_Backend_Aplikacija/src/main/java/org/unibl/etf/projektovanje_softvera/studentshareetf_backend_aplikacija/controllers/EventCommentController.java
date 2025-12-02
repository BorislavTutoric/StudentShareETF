package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventCommentRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.EventCommentService;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class EventCommentController {

    private final EventCommentService commentService;

    @PostMapping
    public ResponseEntity<EventCommentResponse> createComment(@RequestBody EventCommentRequest request) {
        return ResponseEntity.ok(commentService.createComment(request));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<EventCommentResponse>> getComments(@PathVariable Integer eventId) {
        return ResponseEntity.ok(commentService.getCommentsForEvent(eventId));
    }
}
