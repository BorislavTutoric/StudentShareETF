package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.SubjectSimple;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Major;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.MajorSubject;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MajorSubjectRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Subject;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MajorSubjectService {

    private final MajorSubjectRepository majorSubjectRepository;
    private final UserService userService;
    private final StudentService studentService;
    private final SubjectService subjectService;

    public List<SubjectSimple> getFilteredSubjects(String username, Integer year) throws UserNotFoundException, EntityNotFoundException
    {
        User user = userService.getUserByUsername(username);
        Major major = studentService.getStudentMajor(user);
        if(year == 1){
            return majorSubjectRepository.findByMajorAndSemesterIn(major, Arrays.asList(1,2))
                    .stream()
                    .map(MajorSubject::getSubject)
                    .map(s -> new SubjectSimple(s.getName(), subjectService.calculateSemester(s.getSemester())))
                    .toList();
        } else if (year == 2) {
            return majorSubjectRepository.findByMajorAndSemesterIn(major, Arrays.asList(3,4))
                    .stream()
                    .map(MajorSubject::getSubject)
                    .map(s -> new SubjectSimple(s.getName(), subjectService.calculateSemester(s.getSemester())))
                    .toList();
        }else if (year == 3) {
            return majorSubjectRepository.findByMajorAndSemesterIn(major, Arrays.asList(5,6))
                    .stream()
                    .map(MajorSubject::getSubject)
                    .map(s -> new SubjectSimple(s.getName(), subjectService.calculateSemester(s.getSemester())))
                    .toList();
        } else{
            return majorSubjectRepository.findByMajorAndSemesterIn(major, Arrays.asList(7,8))
                    .stream()
                    .map(MajorSubject::getSubject)
                    .map(s -> new SubjectSimple(s.getName(), subjectService.calculateSemester(s.getSemester())))
                    .toList();
        }
    }


    public List<MajorSubject> getMajorSubjectList() {
        return majorSubjectRepository.findAllWithSubjectAndMajor();
    }
}
