package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Material;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Subject;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.SubjectRepository;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MaterialService {
    private final MaterialRepository materialRepository;
    private final SubjectRepository subjectRepository;
    private final StorageService storageService;
    private final SubjectService subjectService;
    private final StudentService studentService;
    private final UserService userService;

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

    @Transactional
    public void uploadMaterial(String subjectName, String username, MultipartFile file,
                               String description, String category) throws IOException, EntityNotFoundException, UserNotFoundException {

        String key = storageService.uploadFile(file);

        Subject subject = subjectService.getSubjectByName(subjectName);

        User user = userService.getUserByUsername(username);

        Student student = studentService.getStudentByUser(user);

        Material material = new Material();
        material.setSubject(subject);
        material.setStudent(student);
        material.setFileKey(key);
        material.setName(file.getOriginalFilename());
        material.setDescription(description);
        material.setCategory(category);
        material.setDate(LocalDateTime.now());
        material.setApproved(false);

        materialRepository.save(material);
    }
}