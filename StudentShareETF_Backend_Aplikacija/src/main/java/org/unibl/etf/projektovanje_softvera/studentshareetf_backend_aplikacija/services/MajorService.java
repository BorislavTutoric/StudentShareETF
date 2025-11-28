package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Major;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MajorRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MajorService {

    private final MajorRepository majorRepository;

    public Major getMajorByName(String name) throws EntityNotFoundException {
        Optional<Major> major = majorRepository.findByName(name);
        if(major.isPresent()) {
            return major.get();
        }else{
            throw new EntityNotFoundException("Smjer nije pronadjen");
        }
    }
}
