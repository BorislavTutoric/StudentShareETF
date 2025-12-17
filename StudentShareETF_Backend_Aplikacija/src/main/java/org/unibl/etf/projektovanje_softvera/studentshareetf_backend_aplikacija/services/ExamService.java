package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.ExamResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Exam;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Major;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.ExamRepository;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final UserService userService;
    private final StudentService studentService;
    private final MajorService majorService;

    public Exam addExam(Exam exam) {
        return examRepository.save(exam);
    }

    public List<Exam> addExams(List<Exam> exams) {
        return examRepository.saveAll(exams);
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public List<ExamResponse> getExamsForMajor(String username, Integer month, Integer year) {
        User user = userService.getUserByUsername(username);
        Student student = studentService.getStudentByUser(user);
        List<Exam> exams = examRepository.findByMajor(majorService.getMajorByName(student.getMajor()));

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy.");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        return exams.stream()
                .filter(exam -> exam.getDateTime().getMonthValue() == month
                        && exam.getDateTime().getYear() == year)
                .map(exam -> new ExamResponse(
                        exam.getTitle(),
                        exam.getDateTime().toLocalDate().format(dateFormatter),
                        exam.getDateTime().toLocalTime().format(timeFormatter),
                        exam.getRoom()
                ))
                .collect(Collectors.toList());
    }
}
