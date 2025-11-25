package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventReview;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.EventService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Event;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.EventRepository;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventAuthController {
    private final EventService eventService;

    @GetMapping
    public ResponseEntity<?> getAllAktivniEvents() {
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

    @GetMapping("/review")
    public ResponseEntity<?> getReviewByEventId(@PathVariable Integer id) {
        try {

        }
    }

    @GetMapping("/comments")
    public ResponseEntity<?> getReviewByEventId(@PathVariable Integer id) {
        try {

        }
    }
}
