package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.ExamResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.PdfReadException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.ExamScheduleRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.utils.CyrillicToLatinConverter;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;


import java.io.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ExamScheduleService {

    private final ExamScheduleRepository examScheduleRepository;
    private final StorageService storageService;
    private final StudentService studentService;
    private final UserService userService;
    private final MajorService majorService;
    private final StudyProgramService studyProgramService;
    private final MajorSubjectService majorSubjectService;
    private final SubjectService subjectService;
    private final ExamService examService;


    private static final List<String> HEADER_KEYWORDS = List.of(
            "GODINA", "ISPITNI ROK", "NAZIV PREDMETA", "TERMIN", "VRIJEME", "SALA"
    );

    private boolean isHeaderLine(String line) {
        for (String k : HEADER_KEYWORDS) {
            if (line.toUpperCase().contains(k)) return true;
        }
        return false;
    }

    /*public List<ExamResponse> getExamsFromPdfByDate(Integer mon, Integer yr, String username) {
        List<ExamResponse> responses = new ArrayList<>();
        List<ExamSchedule> examSchedules = examScheduleRepository.findByActiveTrue();

        User user = userService.getUserByUsername(username);
        Student student = studentService.getStudentByUser(user);
        Major major = majorService.getMajorByName(student.getMajor());
        StudyProgram studentProgram = studyProgramService.getStudyProgramByName(student.getStudyProgram());
        Integer studentMajorId = major.getMajorId();

        List<MajorSubject> majorSubjects = majorSubjectService.getMajorSubjectList();
        Map<String,Integer> subjects = subjectService.getSubjectNameToIdMap();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy.");
        Pattern pattern = Pattern.compile("(.+?)\\s+(\\d{3,4})\\s+(\\d{2}\\.\\d{2}\\.\\d{4}\\.)\\s+(\\d{2}:\\d{2})(?:\\s+(.*))?");

        for (ExamSchedule examSchedule : examSchedules) {
            try {
                String text = storageService.readPdfFromBucket(examSchedule.getFileKey());
                String[] lines = text.split("\n");

                for (String raw : lines) {
                    String line = raw.trim();
                    if (line.isEmpty()) continue;
                    if (!line.matches(".*\\d{2}\\.\\d{2}\\.\\d{4}\\..*")) continue;

                    Matcher matcher = pattern.matcher(line);
                    if (!matcher.find()) continue;

                    String subjectName = matcher.group(1).trim();

                    if (studentProgram.getName().equalsIgnoreCase("Računarstvo i informatika") && !subjectName.startsWith("РИ")) {
                        continue;
                    }
                    else if(studentProgram.getName().equalsIgnoreCase("Elektronika i telekomunikacije") && !subjectName.startsWith("ЕТ"))
                    {
                        continue;
                    }

                    subjectName = subjectName.replaceFirst("^(ЕЕА|ЕИС|РИ|ЕТ)\\s+", "");
                    subjectName = CyrillicToLatinConverter.toLatinUpper(subjectName);

                    String dateStr = matcher.group(3);
                    String time = matcher.group(4);
                    String room = matcher.group(5);

                    LocalDate date = LocalDate.parse(dateStr, formatter);
                    if (date.getMonthValue() != mon || date.getYear() != yr) continue;

                    Integer subjectId = subjects.getOrDefault(subjectName, 0);
                    for(MajorSubject majorSubject : majorSubjects) {
                        if(Objects.equals(majorSubject.getMajor().getMajorId(), studentMajorId) && Objects.equals(majorSubject.getSubject().getSubjectId(), subjectId)) {
                            responses.add(new ExamResponse(subjectName, dateStr, time, room));
                        }
                    }

                }
            } catch (IOException e) {
                throw new PdfReadException("Neuspjesno citanje pdfa.");
            }
        }
        return responses;
    }

     */

    public ResponseEntity<?> createExamsFromPdf(MultipartFile file) {
        Set<Exam> exams = new HashSet<>();
        List<MajorSubject> majorSubjects = majorSubjectService.getMajorSubjectList();
        Map<String, Integer> subjects = subjectService.getSubjectNameToIdMap();

        Pattern pattern = Pattern.compile(
                "(.+?)\\s+(\\d{3,4})\\s+(\\d{2}\\.\\d{2}\\.\\d{4}\\.)\\s+(\\d{2}:\\d{2})(?:\\s+(\\S+))?"
        );

        String text;
        try {
            text = readPdfFromMultipartFile(file);
        } catch (IOException e) {
            throw new PdfReadException("Greška pri čitanju PDF fajla.");
        }

        String[] lines = text.split("\n");

        // --- NOVO: PAMETNO MERGE-OVANJE LINIJA ---
        String dateRegex = ".*\\d{2}\\.\\d{2}\\.\\d{4}\\..*";
        String codeOnlyRegex = "^\\d{3,4}$";
        String roomLikeRegex = ".*(\\d{3,4}|,|Bravo).*";

        List<String> mergedLines = new ArrayList<>();
        int n = lines.length;

        for (int i = 0; i < n; i++) {
            String current = lines[i].trim();
            if (current.isEmpty()) continue;

            if (current.matches(dateRegex)) {

                StringBuilder sb = new StringBuilder();

                // --- 1) UZMI LINIJE IZNAD (naziv + šifra) ---
                int back = i - 1;
                int takenBack = 0;
                Deque<String> backLines = new ArrayDeque<>();

                while (back >= 0 && takenBack < 3) {
                    String b = lines[back].trim();
                    if (b.isEmpty()) {
                        back--;
                        continue;
                    }

                    if (b.matches(dateRegex)) break;

                    if (b.matches(".*\\p{L}.*") || b.matches(codeOnlyRegex)) {
                        backLines.addFirst(b);
                        takenBack++;
                        back--;
                        continue;
                    }

                    break;
                }

                for (String s : backLines) {
                    if (sb.length() > 0) sb.append(" ");
                    sb.append(s);
                }

                // --- 2) DODAJ LINIJU SA DATUMOM ---
                if (sb.length() > 0) sb.append(" ");
                sb.append(current);

                // --- 3) UZMI LINIJE ISPOD (sale) ---
                int j = i + 1;
                while (j < n) {
                    String next = lines[j].trim();
                    if (next.isEmpty()) {
                        j++;
                        continue;
                    }

                    if (next.matches(dateRegex)) break;

                    if (next.matches(roomLikeRegex) || next.matches(codeOnlyRegex) || next.matches(".*\\d{2}:\\d{2}.*")) {
                        sb.append(" ").append(next);
                        j++;
                        continue;
                    }

                    if (next.matches(".*\\p{L}.*")) {
                        break;
                    }

                    sb.append(" ").append(next);
                    j++;
                }

                mergedLines.add(sb.toString());

                i = Math.max(i, j - 1);
            }
        }

        StringBuilder res = new StringBuilder();

        for (String line : mergedLines) {

            Matcher matcher = pattern.matcher(line);
            if (!matcher.find()) continue;

            String subjectName = matcher.group(1).trim();
            subjectName = CyrillicToLatinConverter.toLatinUpper(subjectName);

            subjectName = subjectName.replaceFirst("^[0-9]{3,4}\\s+", "");

            subjectName = subjectName.replaceFirst("^(ЕЕА|EEA|ЕИС|EIS|РИ|RI|ЕТ|ET)\\s*,?\\s*", "");

            subjectName = subjectName.trim();

            String dateStr = matcher.group(3);
            String timeStr = matcher.group(4);

            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy.");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

            LocalDate date = LocalDate.parse(dateStr, dateFormatter);
            LocalTime time = LocalTime.parse(timeStr, timeFormatter);
            LocalDateTime dateTime = LocalDateTime.of(date, time);

            String room = matcher.group(5);
            if (room != null && room.contains(",")) {
                room = room.split(",")[0].trim();
            }

            if (room == null || room.isBlank()) {
                room = "NEPOZNATO";
            }

            String[] parts = subjectName.split(" ");
            Integer subjectId = 0;
            if(parts.length >1){
                res.setLength(0);
                res.append(parts[parts.length - 1]);
                for(int i = parts.length-1; i >=0; i--){
                    System.out.println(res.toString());
                    if(subjects.containsKey(res.toString())){
                        subjectId = subjects.get(res.toString());
                        System.out.println(res.toString());
                        break;
                    }
                    else {
                        res.insert(0, parts[i - 1] + " ");
                    }
                }
            }
            else {
                subjectId = subjects.get(subjectName);
                res.setLength(0);
                res.append(subjectName);
                System.out.println(subjectName);
            }



            for (MajorSubject majorSubject : majorSubjects) {
                if (Objects.equals(subjectId, majorSubject.getSubject().getSubjectId())) {
                    Exam exam = new Exam();
                    exam.setDateTime(dateTime);
                    exam.setRoom(room);
                    exam.setTitle(res.toString());
                    exam.setMajor(majorSubject.getMajor());
                    exams.add(exam);
                }
            }
        }

        if (exams.isEmpty()) return ResponseEntity.notFound().build();
        else {
            List<Exam> result = exams.stream().toList();
            examService.addExams(result);
            return ResponseEntity.ok().build();
        }
    }



    public static String readPdfFromMultipartFile(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream();
             PDDocument document = PDDocument.load(is)) {

            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }


}
