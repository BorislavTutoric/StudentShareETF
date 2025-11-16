package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Event;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.EventRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository dogadjajRepository;
    private final StorageService storageService;

    public List<EventResponse> getAllAktivniDogadjaji() {
        return dogadjajRepository.findByAktivan("AKTIVAN")
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

        return new EventResponse(
                d.getId(),
                d.getNaziv(),
                d.getMjesto(),
                d.getDatumVrijeme(),
                d.getOpis(),
                url
        );
    }
}
