package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventCreateRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventResponseForModerator;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Event;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.EventRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.StudentRepository;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final StorageService storageService;
    private final UserService  userService;
    private final StudentService  studentService;
    private final ModeratorAuditService moderatorAuditService;
    private final NotificationsService notificationsService;

    public List<EventResponse> getAllAktivniDogadjaji() {
        return eventRepository.findByAktivan(true)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public EventResponse getDogadjajById(Integer id) {
        return eventRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Dogadjaj ne postoji"));
    }

    private EventResponse mapToResponse(Event d) {
        String url = d.getFileKey() != null ? storageService.generatePresignedUrl(d.getFileKey()) : null;
        Student student = d.getStudent();
        User user = student.getUser();

        return new EventResponse(
                user.getUsername(),
                d.getId(),
                d.getNaziv(),
                d.getMjesto(),
                d.getDatumVrijeme(),
                d.getOpis(),
                url
        );
    }

    public Event createEvent(EventCreateRequest request,String username) throws IOException {
        Event event = new Event();

        event.setNaziv(request.getTitle());
        event.setMjesto(request.getLocation());
        event.setOpis(request.getDescription());
        event.setAktivan(false);

        String time = request.getTime();
        if (time == null || time.isEmpty() || "null".equalsIgnoreCase(time)) {
            time = "00:00:00";
        }

        LocalDateTime dateTime = LocalDateTime.parse(request.getDate() + "T" + time);
        event.setDatumVrijeme(dateTime);

        if (request.getImage() != null && !request.getImage().isEmpty()) {
                String fileKey = storageService.uploadFile(request.getImage(), "dogadjaji");
                event.setFileKey(fileKey);
        }

        event.setAktivan(false);

        User user = userService.getUserByUsername(username);

        Student currentStudent = studentService.getStudentByUser(user);

        event.setStudent(currentStudent);

        eventRepository.save(event);

        return event;
    }


    @Transactional(readOnly = true)
    public List<EventResponseForModerator> getPendingEventsForModerator() {
        List<Event> pendingEvents = eventRepository.findByAktivanFalseAndModeratorIsNull();

        return pendingEvents.stream().map(event -> {
            EventResponseForModerator response = new EventResponseForModerator();
            response.setDogadjajId(event.getId());
            response.setNaziv(event.getNaziv());
            response.setOpis(event.getOpis());
            response.setMjesto(event.getMjesto());
            response.setStudentId(event.getStudent().getUserId());
            response.setDatumVrijeme(event.getDatumVrijeme());
            response.setStudentName(event.getStudent().getUser().getName() + " " + event.getStudent().getUser().getSurname() + " (" + event.getStudent().getUser().getUsername() + ")");
            String url = event.getFileKey() != null ? storageService.generatePresignedUrl(event.getFileKey()) : null;
            response.setSlikaUrl(url);
            return response;
        }).collect(Collectors.toList());
    }


    @Transactional
    public void reviewEvent(Integer dogadjajId, boolean approved, String username) throws EntityNotFoundException {

        User moderator = userService.getUserByUsername(username);

        Event event = eventRepository.findById(dogadjajId)
                .orElseThrow(() -> new EntityNotFoundException("Dogadjaj ne postoji"));

        if (event.getAktivan() && approved) {
            throw new RuntimeException("Dogadjaj je već odobren");
        }

        if(approved) {
            event.setAktivan(true);
            event.setModerator(moderator);
            eventRepository.save(event);

            String description = "Moderator " + moderator.getName() + " je odobrio dogadjaj " + event.getNaziv() + ".";
            moderatorAuditService.logAction(moderator,description);

            String title = "Zahtjev postavljanja dogadjaja";
            String message = "Vaš zahtjev za postavljanje dogadjaja " +  event.getNaziv() + " je odobren!";
            notificationsService.createNotification(title, message,event.getStudent(),LocalDateTime.now(),LocalDateTime.now());
        }
        else
        {
            event.setAktivan(false);
            event.setModerator(moderator);
            eventRepository.save(event);

            String description = "Moderator " + moderator.getName() + " je odbio postavljanje dogadjaja " + event.getNaziv() + ".";
            moderatorAuditService.logAction(moderator,description);

            String title = "Zahtjev postavljanja dogadjaja";
            String message = "Vaš zahtjev za postavljanje dogadjaja " +  event.getNaziv() + " je odbijen.";
            notificationsService.createNotification(title, message,event.getStudent(),LocalDateTime.now(),LocalDateTime.now());
        }
    }

    @Transactional
    public void deleteEventByModerator(Integer eventId, String username) throws EntityNotFoundException {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Događaj ne postoji"));

        eventRepository.delete(event);

        User moderator = userService.getUserByUsername(username);
        String description = "Moderator " + moderator.getUsername() + " je obrisao događaj sa ID = " + eventId;

        moderatorAuditService.logAction(moderator, description);
    }
}
