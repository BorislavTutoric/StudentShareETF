package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.SubjectSimple;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Subject;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.SubjectRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public Map<String, Integer> getSubjectNameToIdMap() {
        List<Subject> subjects = subjectRepository.findAll();

        return subjects.stream()
                .collect(Collectors.toMap(
                        Subject::getName,
                        Subject::getSubjectId
                ));
    }
}