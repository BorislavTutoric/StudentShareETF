package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AcademicCalendarResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.DeleteExamsRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.enums.Modul;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.enums.TipAkcije;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.AcademicCalendarService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.AuditLogService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.ExamScheduleService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.ExamService;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class CalendarController {

    private final AcademicCalendarService academicCalendarService;
    private final ExamScheduleService examScheduleService;
    private final ExamService examService;
    private final AuditLogService auditLogService;

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
        ResponseEntity<?> odgovor = examScheduleService.createExamsFromPdf(file);

        if (odgovor.getStatusCode().is2xxSuccessful()) {
            User admin = auditLogService.trenutniKorisnik();
            auditLogService.log(admin, TipAkcije.POSTAVLJANJE_RASPOREDA_ISPITA, Modul.ADMINISTRACIJA, "RASPORED_ISPITA", null,
                    "Korisnik \"" + (admin != null ? admin.getUsername() : "nepoznat") + "\" je postavio raspored ispita iz fajla \""
                            + file.getOriginalFilename() + "\".");
        }
        return odgovor;
    }

    @PostMapping("/academic-calendars/delete")
    public ResponseEntity<?> deleteAcademicCalendars(){
        academicCalendarService.deleteCalendars();
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/exams/delete")
    public ResponseEntity<?> deleteExams(@RequestBody DeleteExamsRequest request){
        boolean result = examService.deleteExams(request);
        return ResponseEntity.ok().body(result);
    }
}
