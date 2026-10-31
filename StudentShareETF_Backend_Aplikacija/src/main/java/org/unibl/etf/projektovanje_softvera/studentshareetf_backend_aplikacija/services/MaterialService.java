package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.AverageReview;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialListItemResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialResponseForModerator;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.PagedResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialReviewRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.SubjectRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;


import java.io.IOException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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
    private final MaterialReviewRepository materialReviewRepository;

    private static final int MAX_PAGE_SIZE = 50;

    @Transactional(readOnly = true)
    public PagedResponse<MaterialListItemResponse> getMaterialsPage(String subjectName, String category, int page, int size) throws EntityNotFoundException {
        Subject subject = subjectService.getSubjectByName(subjectName);
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        PageRequest pageRequest = PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "materialId"));

        Page<Material> materialsPage = materialRepository.findBySubjectAndApprovedTrueAndCategory(subject, category, pageRequest);

        List<Integer> ids = materialsPage.getContent().stream().map(Material::getMaterialId).toList();
        Map<Integer, Double> averages = ids.isEmpty()
                ? Map.of()
                : materialReviewRepository.findAvgRatingsByMaterialIds(ids)
                    .stream()
                    .collect(Collectors.toMap(AverageReview::getMaterialId, AverageReview::getAverageRating));

        List<MaterialListItemResponse> content = materialsPage.getContent()
                .stream()
                .map(m -> new MaterialListItemResponse(m.getMaterialId(), m.getName(), m.getCategory(),
                        subject.getName(), m.getDescription(), averages.get(m.getMaterialId())))
                .toList();

        return new PagedResponse<>(content, materialsPage.getNumber(), materialsPage.getSize(),
                materialsPage.getTotalElements(), materialsPage.getTotalPages(), materialsPage.hasNext());
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getApprovedMaterialCountsByCategory(String subjectName) throws EntityNotFoundException {
        Subject subject = subjectService.getSubjectByName(subjectName);
        Map<String, Long> counts = new LinkedHashMap<>();
        for (Object[] row : materialRepository.countApprovedBySubjectGroupByCategory(subject)) {
            counts.put((String) row[0], (Long) row[1]);
        }
        return counts;
    }

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

            String description = "Moderator: " + moderator.getName() + " je odobrio materijal \"" + material.getName() + "\".";
            moderatorAuditService.logAction(moderator,description);

            String title = "Zahtjev postavljanja materijala";
            String message = "Vaš zahtjev za postavljanje materijala \"" +  material.getName() + "\" je odobren!";
            notificationsService.createNotification(title, message,material.getStudent(),LocalDateTime.now(),LocalDateTime.now());
        }
        else
        {
            materialRepository.delete(material);

            String description = "Moderator: " + moderator.getName() + " je dobio materijal \"" + material.getName() + "\".";
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
        String description = "Moderator: " + moderator.getUsername() + " je obrisao materijal \"" + material.getName() + "\".";

        moderatorAuditService.logAction(moderator, description);
    }
}
