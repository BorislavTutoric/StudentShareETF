package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.MaterialService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/all/subject")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;

    @GetMapping("/materials")
    public List<MaterialResponse> getMaterials(@RequestParam String name) {
        return materialService.getMaterials(name);
    }

    @GetMapping("/{id}/url")
    public ResponseEntity<String> getMaterijalUrl(@PathVariable Integer id) {
        Optional<String> url = materialService.getMaterialUrl(id);
        return url.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


}