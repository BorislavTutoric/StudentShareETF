package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.StudyProgram;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.StudyProgramRepository;

@Service
@RequiredArgsConstructor
public class StudyProgramService {

    private final StudyProgramRepository studyProgramRepository;

    public StudyProgram getStudyProgramByName(String name) {
        return studyProgramRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Study program with name '" + name + "' not found."));
    }

}
