package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialResponseForModerator;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.SubjectRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;


import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialService {
    private final MaterialRepository materialRepository;
    private final SubjectRepository subjectRepository;
    private final StorageService storageService;
    private final SubjectService subjectService;
    private final StudentService studentService;
    private final UserService userService;
    private final ModeratorAuditService moderatorAuditService;
    private final NotificationsService notificationsService;

    public List<MaterialResponse> getMaterials(String name) {
        Optional<Subject> subject = subjectRepository.findByName(name);
        List<MaterialResponse> materials =  materialRepository.findBySubjectAndApproved(subject.get(), true)
                .stream()
                .filter(Material::isApproved)
                .map(m -> new MaterialResponse(m.getMaterialId(), m.getName(), m.getCategory(), m.getSubject().getName(), m.getDescription()))
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

        String key = storageService.uploadFile(file, "materijali");

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

    public List<MaterialResponse> getSavedMaterialsForStudentFromSubject(String username, String subjectName) throws EntityNotFoundException, UserNotFoundException {
        User user = userService.getUserByUsername(username);
        Student student = studentService.getStudentByUser(user);
        Subject subject = subjectService.getSubjectByName(subjectName);

        return materialRepository.findSavedMaterialsByStudentAndSubject(student, subject)
                .stream()
                .map(material -> new MaterialResponse(material.getMaterialId(), material.getName(), material.getCategory(), subjectName, material.getDescription()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MaterialResponseForModerator> getPendingMaterialsForModerator() {
        List<Material> pendingMaterials = materialRepository.findByApprovedFalseAndModeratorIsNull();

        return pendingMaterials.stream().map(material -> {
            MaterialResponseForModerator response = new MaterialResponseForModerator();
            response.setMaterialId(material.getMaterialId());
            response.setName(material.getName());
            response.setCategory(material.getCategory());
            response.setSubjectName(material.getSubject().getName());
            response.setStudentId(material.getStudent().getUserId());
            String name = material.getStudent().getUser().getName() + " " + material.getStudent().getUser().getSurname() + " (" + material.getStudent().getUser().getUsername() + ")";
            response.setStudentName(name);
            response.setUploadDate(material.getDate().toString());
            return response;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void reviewMaterial(Integer materialId, boolean approved, String username) throws EntityNotFoundException {

        User moderator = userService.getUserByUsername(username);

        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new EntityNotFoundException("Materijal ne postoji"));

        if (material.isApproved() && approved) {
            throw new RuntimeException("Materijal je već odobren");
        }

        if(approved) {
            material.setApproved(true);
            material.setModerator(moderator);
            materialRepository.save(material);

            String description = "Moderator :" + moderator.getName() + " je odobrio materijal \"" + material.getName() + "\".";
            moderatorAuditService.logAction(moderator,description);

            String title = "Zahtjev postavljanja materijala";
            String message = "Vaš zahtjev za postavljanje materijala \"" +  material.getName() + "\" je odobren!";
            notificationsService.createNotification(title, message,material.getStudent(),LocalDateTime.now(),LocalDateTime.now());
        }
        else
        {
            materialRepository.delete(material);

            String description = "Moderator :" + moderator.getName() + " je dobio materijal \"" + material.getName() + "\".";
            moderatorAuditService.logAction(moderator,description);

            String title = "Zahtjev postavljanja materijala";
            String message = "Vaš zahtjev za postavljanje materijala \"" +  material.getName() + "\" je odbijen.";
            notificationsService.createNotification(title, message,material.getStudent(),LocalDateTime.now(),LocalDateTime.now());
        }
    }

    @Transactional
    public void deleteMaterialByModerator(Integer materialId, String username) throws EntityNotFoundException {

        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new EntityNotFoundException("Materijal ne postoji"));

        materialRepository.delete(material);

        User moderator = userService.getUserByUsername(username);
        String description = "Moderator :" + moderator.getUsername() + " je obrisao materijal \"" + material.getName() + "\".";

        moderatorAuditService.logAction(moderator, description);
    }
}
