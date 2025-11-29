package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Material;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Subject;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.SubjectRepository;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MaterialService {
    private final MaterialRepository materialRepository;
    private final SubjectRepository subjectRepository;
    private final StorageService storageService;

    public List<MaterialResponse> getMaterials(String name) {
        Optional<Subject> subject = subjectRepository.findByName(name);
        List<MaterialResponse> materials =  materialRepository.findBySubjectAndApproved(subject.get(), true)
                .stream()
                .filter(Material::isApproved)
                .map(m -> new MaterialResponse(m.getMaterialId(), m.getName(), m.getCategory()))
                .toList();
        return materials;
    }

    public Optional<String> getMaterialUrl(Integer materialId) {
        return materialRepository.findById(materialId)
                .map(m -> storageService.generatePresignedUrl(m.getFileKey()));
    }

    public Material getMaterialById(Integer materialId) throws EntityNotFoundException {
        Optional<Material> material = materialRepository.findByMaterialId(materialId);
        if (material.isPresent()) {
            return material.get();
        } else  {
            throw new EntityNotFoundException("Materijal nije pronadjen!");
        }
    }
}