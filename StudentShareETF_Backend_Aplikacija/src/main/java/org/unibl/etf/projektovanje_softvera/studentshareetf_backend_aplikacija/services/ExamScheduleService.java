package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.ExamResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.PdfReadException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.ExamSchedule;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.ExamScheduleRepository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ExamScheduleService {

    private final ExamScheduleRepository examScheduleRepository;
    private final StorageService storageService;
    private final StudentService studentService;
    private final UserService userService;


    public List<ExamResponse> getExamsFromPdfByDate(String date, String username) {
        List<ExamResponse> responses = new ArrayList<>();
        List<ExamSchedule> examSchedules = examScheduleRepository.findByActiveTrue();

        User user = userService.getUserByUsername(username);
        Student student = studentService.getStudentByUser(user);

        Pattern pattern = Pattern.compile("^(\\S+)\\s+(.+?)\\s+(\\d{3,4})\\s+(\\d{2}\\.\\d{2}\\.\\d{4}\\.)\\s+(\\d{2}:\\d{2})(?:\\s+(.*))?$");
        String currentProgramRaw = null;

        for (ExamSchedule examSchedule : examSchedules) {
            try {
                String text = storageService.readPdfFromBucket(examSchedule.getFileKey());
                String[] lines = text.split("\n");

                for (String rawLine : lines) {
                    String line = rawLine.trim();

                    if (line.matches("^(РИ|ЕТ|ЕИС|ЕЕА)$")) {
                        currentProgramRaw = line;
                        continue;
                    }

                    if (line.isEmpty()) continue;

                    if (!line.contains(date)) continue;

                    Matcher matcher = pattern.matcher(line);

                    if (!matcher.find()) continue;

                    String programRaw = matcher.group(1);
                    String subject = matcher.group(2);
                    String datepdf = matcher.group(4);
                    String time = matcher.group(5);
                    String room = matcher.group(6);

                    if (!(currentProgramRaw == null)) {
                        programRaw += currentProgramRaw;
                        currentProgramRaw = null;
                    }

                    String program = null;
                    if ("РИ".equals(programRaw)) program = "Računarstvo i informatika";
                    else if ("ЕТ".equals(programRaw)) program = "Elektronika i telekomunikacije";
                    else if ("ЕИС".equals(programRaw) || "ЕЕА".equals(programRaw) || "ЕЕАЕИС".equals(programRaw)) program = "Elektroenergetika i automatika";

                    if (student.getStudyProgram().equals(program)) {
                        responses.add(new ExamResponse(subject, datepdf, time, room));
                    }
                }
            } catch (IOException e) {
                throw new PdfReadException("Neuspjesno citanje pdfa.");
            }
        }
        return responses;
    }

}
