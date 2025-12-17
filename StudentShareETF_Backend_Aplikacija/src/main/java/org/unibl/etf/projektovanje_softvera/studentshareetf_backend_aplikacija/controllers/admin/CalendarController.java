package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AcademicCalendarResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.ExamSchedule;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.AcademicCalendarService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.ExamScheduleService;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class CalendarController {

    private final AcademicCalendarService academicCalendarService;
    private final ExamScheduleService examScheduleService;

    @PostMapping(value = "/academic-calendar/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAcademicCalendar(@RequestParam("file") MultipartFile file){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try{
            AcademicCalendarResponse academicCalendarResponse = academicCalendarService.uploadCalendar(username, file);
            return ResponseEntity.ok(academicCalendarResponse);
        } catch (IOException ex){
            return ResponseEntity.badRequest().body("Greška pri upload-u akademskog kalendara!");
        } catch (UserNotFoundException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(value = "/exam-schedule/set", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addFaculcyTasks(@RequestParam("file") MultipartFile file)
    {
        return examScheduleService.createExamsFromPdf(file);
    }
}
