/*package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.SubjectRepository;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MaterialService {
    private final MaterialRepository materialRepository;
    private final SubjectService subjectService;
    private final StorageService storageService;

    public List<MaterialResponse> getMaterials(String name) {
        Integer subjectId = subjectService.getSubjectid(name);
        List<MaterialResponse> materials =  materialRepository.findBySubjectIdAndApproved(subjectId, true)
                .stream()
                .map(m -> new MaterialResponse(m.getMaterialId(), m.getName(), m.getCategory()))
                .toList();
        if(materials.isEmpty()){
            throw new RuntimeException("Materials not found");
        }else{
            return materials;
        }
    }

    public Optional<String> getMaterialUrl(Integer materialId) {
        return materialRepository.findById(materialId)
                .map(m -> storageService.generatePresignedUrl(m.getFileKey()));
    }
}
**/