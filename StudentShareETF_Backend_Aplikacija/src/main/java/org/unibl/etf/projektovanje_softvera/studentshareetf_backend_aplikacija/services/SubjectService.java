package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.SubjectSimple;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MajorRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MajorSubjectRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.SubjectRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.SubjectAdvice;
import java.util.stream.Collectors;

import java.util.*;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final UserService userService;
    private final StudentService studentService;
    private final MajorService majorService;

    public List<SubjectSimple> getSubjects(Integer year){

        if(year == 1){
            return subjectRepository.findBySemesterIn(Arrays.asList(1,2))
                    .stream()
                    .map(s -> new SubjectSimple(s.getName(), calculateSemester(s.getSemester())))
                    .toList();
        } else if (year == 2) {
            return subjectRepository.findBySemesterIn(Arrays.asList(3,4))
                    .stream()
                    .map(s -> new SubjectSimple(s.getName(), calculateSemester(s.getSemester())))
                    .toList();
        }else if (year == 3) {
            return subjectRepository.findBySemesterIn(Arrays.asList(5,6))
                    .stream()
                    .map(s -> new SubjectSimple(s.getName(), calculateSemester(s.getSemester())))
                    .toList();
        } else{
            return subjectRepository.findBySemesterIn(Arrays.asList(7,8))
                    .stream()
                    .map(s -> new SubjectSimple(s.getName(), calculateSemester(s.getSemester())))
                    .toList();
        }
    }

    public Integer calculateSemester(Integer semester)
    {
        if(semester % 2 == 0){
            return 2;
        }
        else{
            return 1;
        }
    }

    public List<SubjectSimple> getSearchedSubjects(String search){
        return subjectRepository.findByNameContainingIgnoreCase(search)
                .stream()
                .map(s -> new SubjectSimple(s.getName(), s.getSemester()))
                .toList();
    }

    public Subject getSubjectByName(String name) throws EntityNotFoundException {
        Optional<Subject> subject = subjectRepository.findByName(name);
        if(subject.isPresent()){
            return subject.get();
        }else{
            throw new EntityNotFoundException("Predmet nije pronadjen!");
        }
    }

    public List<SubjectAdvice> getSubjectsForAdvice(Integer year){
        List<Subject> subjects;

        if(year == 1){
            subjects = subjectRepository.findBySemesterIn(Arrays.asList(1,2));
        } else if (year == 2) {
            subjects = subjectRepository.findBySemesterIn(Arrays.asList(3,4));
        }else if (year == 3) {
            subjects = subjectRepository.findBySemesterIn(Arrays.asList(5,6));
        } else{
            subjects = subjectRepository.findBySemesterIn(Arrays.asList(7,8));
        }

        return subjects.stream()
                .map(s -> new SubjectAdvice(
                        s.getSubjectId(),
                        s.getName(),
                        calculateSemester(s.getSemester())))
                .collect(Collectors.toList());
    public List<SubjectSimple> getSubjectsWithSavedMaterials(Integer year, String username) throws UserNotFoundException {
        User user = userService.getUserByUsername(username);
        Student student = studentService.getStudentByUser(user);

        List<Subject> subjects = subjectRepository.findSubjectsByStudentSavedMaterials(student);

        if(year == 1){
            return subjects.stream()
                    .filter(s -> s.getSemester() == 1 || s.getSemester() == 2)
                    .map(s -> new SubjectSimple(s.getName(), calculateSemester(s.getSemester())))
                    .toList();
        } else if (year == 2) {
            return subjects.stream()
                    .filter(s -> s.getSemester() == 3 || s.getSemester() == 4)
                    .map(s -> new SubjectSimple(s.getName(), calculateSemester(s.getSemester())))
                    .toList();
        }else if (year == 3) {
            return subjects.stream()
                    .filter(s -> s.getSemester() == 5 || s.getSemester() == 6)
                    .map(s -> new SubjectSimple(s.getName(), calculateSemester(s.getSemester())))
                    .toList();
        } else{
            return subjects.stream()
                    .filter(s -> s.getSemester() == 7 || s.getSemester() == 8)
                    .map(s -> new SubjectSimple(s.getName(), calculateSemester(s.getSemester())))
                    .toList();
        }
    }

    public List<SubjectSimple> getFilteredSubjectsWithSavedMaterials(Integer year, String username) throws UserNotFoundException, EntityNotFoundException {
        User user = userService.getUserByUsername(username);
        Student student = studentService.getStudentByUser(user);
        Major major = majorService.getMajorByName(student.getMajor());
        if (year == 1) {
            return subjectRepository.findFilteredSubjectsWithSavedMaterialsForStudent(student, major, Arrays.asList(1, 2))
                    .stream()
                    .map(subject -> new SubjectSimple(subject.getName(), calculateSemester(subject.getSemester())))
                    .toList();
        } else if (year == 2) {
            return subjectRepository.findFilteredSubjectsWithSavedMaterialsForStudent(student, major, Arrays.asList(3, 4))
                    .stream()
                    .map(subject -> new SubjectSimple(subject.getName(), calculateSemester(subject.getSemester())))
                    .toList();
        } else if (year == 3) {
            return subjectRepository.findFilteredSubjectsWithSavedMaterialsForStudent(student, major, Arrays.asList(5, 6))
                    .stream()
                    .map(subject -> new SubjectSimple(subject.getName(), calculateSemester(subject.getSemester())))
                    .toList();
        } else {
            return subjectRepository.findFilteredSubjectsWithSavedMaterialsForStudent(student, major, Arrays.asList(7, 8))
                    .stream()
                    .map(subject -> new SubjectSimple(subject.getName(), calculateSemester(subject.getSemester())))
                    .toList();
        }
    }

    public Map<String, Integer> getSubjectNameToIdMap() {
        List<Subject> subjects = subjectRepository.findAll();

        return subjects.stream()
                .collect(Collectors.toMap(
                        Subject::getName,
                        Subject::getSubjectId
                ));
    }
}