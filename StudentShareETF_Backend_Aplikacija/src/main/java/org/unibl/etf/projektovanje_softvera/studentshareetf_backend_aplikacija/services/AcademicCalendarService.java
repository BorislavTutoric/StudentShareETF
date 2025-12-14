package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AcademicCalendarResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.AcademicCalendar;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.AcademicCalendarRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AcademicCalendarService {

    private final AcademicCalendarRepository academicCalendarRepository;
    private final StorageService storageService;

    public AcademicCalendarResponse getActiveCalendar() throws EntityNotFoundException {
        AcademicCalendarResponse response = new AcademicCalendarResponse();
        AcademicCalendar calendar = academicCalendarRepository.findByAktivan(true).orElse(null);
        if(calendar!=null){
            response.setId(calendar.getId());
            response.setTitle(calendar.getNaziv());
            return response;
        }
        else {
            throw new EntityNotFoundException("Akademski kalendar nije pronadjen.");
        }
    }

    public Optional<String> getCalendarUrl(Integer calendarId) {
        return academicCalendarRepository.findById(calendarId)
                .map(m -> storageService.generatePresignedUrl(m.getFileKey()));
    }
}
