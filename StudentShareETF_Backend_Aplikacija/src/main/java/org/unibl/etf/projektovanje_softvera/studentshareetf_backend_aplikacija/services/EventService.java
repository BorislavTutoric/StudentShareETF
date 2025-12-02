package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Event;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.EventRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.StudentRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository dogadjajRepository;
    private final StorageService storageService;
    private final StudentRepository studentRepository;

    public EventResponse createDogadjaj(EventRequest req) {

        Student student = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student ne postoji"));

        Event event = new Event();
        event.setNaziv(req.getNaziv());
        event.setMjesto(req.getMjesto());
        event.setDatumVrijeme(req.getDatumVrijeme());
        event.setOpis(req.getOpis());
        event.setStudent(student);
        event.setFileKey(req.getFileKey());
        event.setAktivan(false); // po defaultu neaktivan

        Event saved = dogadjajRepository.save(event);

        String url = saved.getFileKey() != null ?
                storageService.generatePresignedUrl(saved.getFileKey()) : null;

        return new EventResponse(
                student.getUser().getUsername(),
                saved.getId(),
                saved.getNaziv(),
                saved.getMjesto(),
                saved.getDatumVrijeme(),
                saved.getOpis(),
                url
        );
    }

    public List<EventResponse> getAllAktivniDogadjaji() {
        return dogadjajRepository.findByAktivan(true)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public EventResponse getDogadjajById(Integer id) {
        return dogadjajRepository.findById(id)
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
}
