package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.NotificationsResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.NotificationsService;

import java.time.LocalDateTime;
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

    @GetMapping("/paged")
    public ResponseEntity<?> getNotificationsPage(@RequestParam(defaultValue = "10") int size,
                                                  @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime beforeActiveFrom,
                                                  @RequestParam(required = false) Integer beforeId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            return ResponseEntity.ok(notificationsService.getNotificationsPage(username, size, beforeActiveFrom, beforeId));
        } catch (UserNotFoundException ex){
            return ResponseEntity.badRequest().body("Greška pri učitavanju obavještenja!");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Integer id) {
        try{
            notificationsService.notificationDelete(id);
            return ResponseEntity.ok("Obavještenje uspješno obrisano!");
        } catch (EntityNotFoundException ex){
            return ResponseEntity.badRequest().body("Greška pri učitavanju obavještenja!");
        }
    }

    @PostMapping("/read/{id}")
    public ResponseEntity<?> setNotificationRead(@PathVariable Integer id){
        try{
            notificationsService.setReadNotification(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/check-unread")
    public ResponseEntity<?> checkUnreadNotifications(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try{
            Integer numOfUnreadNotifications = notificationsService.checkUnreadNotifications(username);
            return ResponseEntity.ok(numOfUnreadNotifications);
        } catch (UserNotFoundException ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
