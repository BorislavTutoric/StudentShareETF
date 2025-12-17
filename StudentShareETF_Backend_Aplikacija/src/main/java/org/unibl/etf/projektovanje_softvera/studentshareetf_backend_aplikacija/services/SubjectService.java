package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.SubjectSimple;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Subject;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.SubjectRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.SubjectAdvice;
import java.util.stream.Collectors;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;

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
    }
}