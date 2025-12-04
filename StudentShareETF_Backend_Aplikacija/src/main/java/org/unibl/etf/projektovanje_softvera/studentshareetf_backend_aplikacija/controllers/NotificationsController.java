package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.NotificationsResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.NotificationsService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor

public class NotificationsController {
    private final NotificationsService notificationsService;

    @GetMapping
    public ResponseEntity<?> getAllNotificationsByUsername() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            List<NotificationsResponse> notificationsResponses = notificationsService.getNotificationsByUsername(username);
            return ResponseEntity.ok(notificationsResponses);
        }catch (UserNotFoundException | EntityNotFoundException ex){
            return ResponseEntity.badRequest().body("Greška pri učitavanju obavještenja!");
        }
    }
}
