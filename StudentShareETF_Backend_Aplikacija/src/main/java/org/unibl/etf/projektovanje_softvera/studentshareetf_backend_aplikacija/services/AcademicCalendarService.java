package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import jakarta.transaction.Transactional;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AcademicCalendarResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.AcademicCalendar;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.AcademicCalendarRepository;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AcademicCalendarService {

    private final AcademicCalendarRepository academicCalendarRepository;
    private final StorageService storageService;
    private final UserService userService;

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

    public void deactiveCalendars(){
        List<AcademicCalendar> academicCalendars = academicCalendarRepository.findAll();
        for(AcademicCalendar academicCalendar : academicCalendars){
            academicCalendar.setAktivan(false);
            academicCalendarRepository.save(academicCalendar);
        }
    }

    public AcademicCalendarResponse uploadCalendar(String username, MultipartFile file) throws IOException, UserNotFoundException {
        String key = storageService.uploadFile(file, "akademskiKalendar");
        User user = userService.getUserByUsername(username);

        deactiveCalendars();

        AcademicCalendar academicCalendar = new AcademicCalendar();
        academicCalendar.setFileKey(key);
        academicCalendar.setNaziv(file.getOriginalFilename());
        academicCalendar.setDatumPostavljanja(LocalDateTime.now());
        academicCalendar.setAktivan(true);
        academicCalendar.setUser(user);
        academicCalendarRepository.save(academicCalendar);

        return new AcademicCalendarResponse(academicCalendar.getNaziv(), academicCalendar.getId());
    }


    public void deleteCalendars() {
        academicCalendarRepository.deleteAllInactive();
    }
}
