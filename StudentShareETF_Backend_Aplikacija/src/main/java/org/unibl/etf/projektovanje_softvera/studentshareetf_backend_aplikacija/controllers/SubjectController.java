package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.SubjectSimple;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.SubjectService;

import java.util.List;

@RestController
@RequestMapping("/all")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping("/subjects")
    public List<SubjectSimple> getSubjects(@RequestParam Integer year){
        return subjectService.getSubjects(year);
    }
}