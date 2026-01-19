package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.PdfReadException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.*;
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

    private final MajorSubjectService majorSubjectService;
    private final SubjectService subjectService;
    private final ExamService examService;


    public ResponseEntity<?> createExamsFromPdf(MultipartFile file) {
        Set<Exam> exams = new HashSet<>();
        List<MajorSubject> majorSubjects = majorSubjectService.getMajorSubjectList();
        Map<String, Integer> subjects = subjectService.getSubjectNameToIdMap();

        boolean doubleDate = false;
        if (file.getOriginalFilename() != null &&
                (file.getOriginalFilename().toLowerCase().contains("januar") ||
                        file.getOriginalFilename().toLowerCase().contains("jun") ||
                        file.getOriginalFilename().toLowerCase().contains("septembar"))) {
            doubleDate = true;
        }

        Pattern pattern = Pattern.compile(
                "(.+?)\\s+(\\d{3,4})\\s+(\\d{2}\\.\\d{2}\\.\\d{4}\\.)\\s+(\\d{1,2}:\\d{2})(?:\\s+(.*))?"
        );

        Pattern patternDoubleDate = Pattern.compile(
                "^(.+?)\\s+(\\d{3,4})\\s+" +
                        "(\\d{2}\\.\\d{2}\\.\\d{4}\\.)\\s+(\\d{1,2}:\\d{2})\\s+" +
                        "(\\d{2}\\.\\d{2}\\.\\d{4}\\.)\\s+(\\d{1,2}:\\d{2})" +
                        "(?:\\s+(.*))?"
        );

        String text;
        try {
            text = readPdfFromMultipartFile(file);
        } catch (IOException e) {
            throw new PdfReadException("Greška pri čitanju PDF fajla.");
        }

        String[] lines = text.split("\n");
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
                int back = i - 1;
                int takenBack = 0;
                Deque<String> backLines = new ArrayDeque<>();
                while (back >= 0 && takenBack < 3) {
                    String b = lines[back].trim();
                    if (b.isEmpty()) { back--; continue; }
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
                if (sb.length() > 0) sb.append(" ");
                sb.append(current);
                int j = i + 1;
                while (j < n) {
                    String next = lines[j].trim();
                    if (next.isEmpty()) { j++; continue; }
                    if (next.matches(dateRegex)) break;
                    if (next.matches(roomLikeRegex) || next.matches(codeOnlyRegex) || next.matches(".*\\d{1,2}:\\d{2}.*")) {
                        sb.append(" ").append(next);
                        j++;
                        continue;
                    }
                    if (next.matches(".*\\p{L}.*") && !next.matches(".*Bravo.*")) break;
                    sb.append(" ").append(next);
                    j++;
                }
                mergedLines.add(sb.toString());
                i = Math.max(i, j - 1);
            }
        }

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy.");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("H:mm");

        for (String line : mergedLines) {
            Matcher matcher;
            if (!doubleDate) matcher = pattern.matcher(line);
            else matcher = patternDoubleDate.matcher(line);

            if (!matcher.find()) continue;

            String subjectNameRaw = matcher.group(1).trim();
            String subjectNameClean = CyrillicToLatinConverter.toLatinUpper(subjectNameRaw)
                    .replaceFirst("^[0-9]{3,4}\\s+", "")
                    .replaceFirst("^(ЕЕА|EEA|ЕИС|EIS|РИ|RI|ЕТ|ET)\\s*,?\\s*", "")
                    .trim();

            String roomRaw = doubleDate ? matcher.group(7) : matcher.group(5);
            String room = (roomRaw == null || roomRaw.isBlank()) ? "NEPOZNATO" : roomRaw.split(",")[0].trim();

            List<TerminData> terminiZaObradu = new ArrayList<>();

            terminiZaObradu.add(new TerminData(matcher.group(3), matcher.group(4)));

            if (doubleDate) {
                terminiZaObradu.add(new TerminData(matcher.group(5), matcher.group(6)));
            }

            String[] parts = subjectNameClean.split(" ");
            Integer subjectId = 0;
            String finalTitle = subjectNameClean;

            if (parts.length > 1) {
                StringBuilder tempTitle = new StringBuilder(parts[parts.length - 1]);
                for (int k = parts.length - 1; k >= 0; k--) {
                    if (subjects.containsKey(tempTitle.toString())) {
                        subjectId = subjects.get(tempTitle.toString());
                        finalTitle = tempTitle.toString();
                        break;
                    } else if (k > 0) {
                        tempTitle.insert(0, parts[k - 1] + " ");
                    }
                }
            } else {
                subjectId = subjects.get(subjectNameClean);
            }

            for (TerminData t : terminiZaObradu) {
                try {
                    LocalDateTime dateTime = LocalDateTime.of(
                            LocalDate.parse(t.datum, dateFormatter),
                            LocalTime.parse(t.vrijeme, timeFormatter)
                    );

                    for (MajorSubject majorSubject : majorSubjects) {
                        if (Objects.equals(subjectId, majorSubject.getSubject().getSubjectId())) {
                            Exam exam = new Exam();
                            exam.setDateTime(dateTime);
                            exam.setRoom(room);
                            exam.setTitle(finalTitle);
                            exam.setMajor(majorSubject.getMajor());
                            exams.add(exam);
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Greška pri obradi termina za: " + finalTitle);
                }
            }
        }

        if (exams.isEmpty()) return ResponseEntity.notFound().build();
        examService.addExams(exams.stream().toList());
        return ResponseEntity.ok().build();
    }

    private static class TerminData {
        String datum;
        String vrijeme;
        TerminData(String d, String v) { this.datum = d; this.vrijeme = v; }
    }

    public static String readPdfFromMultipartFile(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream();
             PDDocument document = PDDocument.load(is)) {

            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }


}
