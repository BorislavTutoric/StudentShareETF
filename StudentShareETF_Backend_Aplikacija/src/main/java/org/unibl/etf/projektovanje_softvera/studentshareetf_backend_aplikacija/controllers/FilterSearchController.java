package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.SubjectSimple;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.MajorSubjectService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.UserService;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/materials")
@RequiredArgsConstructor
public class FilterSearchController {

    private final MajorSubjectService majorSubjectService;

    @GetMapping("/filter")
    public List<SubjectSimple> getFilteredSubjects(@RequestParam Integer year)
    {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try{
            return majorSubjectService.getFilteredSubjects(username, year);
        }catch(UserNotFoundException | EntityNotFoundException ex){
            return Collections.emptyList();
        }
    }
}
