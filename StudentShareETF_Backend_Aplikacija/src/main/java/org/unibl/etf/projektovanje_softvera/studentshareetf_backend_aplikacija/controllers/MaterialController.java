package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Material;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.MaterialService;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/all/subject")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;

    @GetMapping("/materials")
    public ResponseEntity<List<MaterialResponse>> getMaterials(@RequestParam String name) {
        List<MaterialResponse> materials = materialService.getMaterials(name);
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/{id}/url")
    public ResponseEntity<String> getMaterialUrl(@PathVariable Integer id) {
        Optional<String> url = materialService.getMaterialUrl(id);
        return url.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/materials/{id}")
    public ResponseEntity<MaterialResponse> getMaterialById(@PathVariable Integer id) throws EntityNotFoundException {
        Material material = materialService.getMaterialById(id);
        MaterialResponse response = new MaterialResponse(material.getMaterialId(), material.getName(), material.getCategory(), material.getSubject().getName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/materials/upload")
    public ResponseEntity<String> uploadMaterial(
            @RequestParam String subjectName,
            @RequestParam String username,
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String description,
            @RequestParam String category
    ) throws IOException, EntityNotFoundException, UserNotFoundException {
        materialService.uploadMaterial(subjectName, username, file, description, category);
        return ResponseEntity.ok("Materijal uspješno dodat i čeka odobrenje moderatora.");
    }
}
