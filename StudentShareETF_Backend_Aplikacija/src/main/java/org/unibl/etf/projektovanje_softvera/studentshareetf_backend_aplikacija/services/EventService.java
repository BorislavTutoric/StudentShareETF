package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventCreateRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventResponse;
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
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

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

        String time = request.getTime() != null && !request.getTime().isEmpty() ? request.getTime() : "00:00";
        LocalDateTime dateTime = LocalDateTime.parse(request.getDate() + "T" + time);
        event.setDatumVrijeme(dateTime);

        if (request.getImage() != null && !request.getImage().isEmpty()) {
                String fileKey = storageService.uploadFile(request.getImage(), "dogadjaji");
                event.setFileKey(fileKey);
        }

        event.setAktivan(false);

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException(username));

        Student currentStudent = studentRepository.findByUser(user).orElseThrow(() -> new UserNotFoundException(username));

        event.setStudent(currentStudent);

        eventRepository.save(event);

        return event;
    }
}
