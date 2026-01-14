package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialCommentRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialCommentResponseForModerator;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Material;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.MaterialComments;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialCommentRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialCommentService {

    private final MaterialCommentRepository materialCommentRepository;
    private final UserService userService;
    private final StudentService studentService;
    private final MaterialService materialService;
    private final ModeratorAuditService moderatorAuditService;
    private final NotificationsService  notificationsService;

    public List<MaterialCommentResponse> getCommentsByMaterialId(Integer materialId, String username) {

        List<MaterialComments> comments = materialCommentRepository.findCommentsOfActiveUsersByMaterial(materialId);
        List<MaterialCommentResponse> commentResponses = new ArrayList<>();
        for (MaterialComments comment : comments) {
            User user = comment.getKorisnik();
            if (username.equals(user.getUsername())) {
                commentResponses.add(new MaterialCommentResponse(comment.getId(), comment.getSadrzaj(), comment.getDatumVrijeme(), user.getName(), user.getSurname(), true));
            } else {
                commentResponses.add(new MaterialCommentResponse(comment.getId(), comment.getSadrzaj(), comment.getDatumVrijeme(), user.getName(), user.getSurname(), false));
            }
        }
        return commentResponses;
    }

    @Transactional
    public MaterialCommentResponse postComment(String username, String content, Integer materialId) throws UserNotFoundException, EntityNotFoundException {
        User user = userService.getUserByUsername(username);
        Material material = materialService.getMaterialById(materialId);
        LocalDateTime  dateTime = LocalDateTime.now();
        MaterialComments materialComment = new MaterialComments(content, dateTime, material, user);
        materialCommentRepository.saveAndFlush(materialComment);
        System.out.println(materialComment.getId());
        return new MaterialCommentResponse(materialComment.getId(), materialComment.getSadrzaj(), dateTime, user.getName(), user.getSurname(), true);
    }

    public void commentReport(Integer commentId) throws EntityNotFoundException {
        Optional<MaterialComments> materialComment = materialCommentRepository.findById(commentId);
        if (materialComment.isPresent()){
            MaterialComments matComment = materialComment.get();
            if(!matComment.getPrijavljen()){
                matComment.setPrijavljen(true);
                materialCommentRepository.save(matComment);
            }
        }else{
            throw new EntityNotFoundException("Komentar nije pronadjen!");
        }
    }

    @Transactional
    public void commentDelete(Integer commentId) throws EntityNotFoundException {
        if (!materialCommentRepository.existsById(commentId)) {
            throw new EntityNotFoundException("Komentar nije pronađen!");
        }
        materialCommentRepository.deleteById(commentId);
    }

    @Transactional(readOnly = true)
    public List<MaterialCommentResponseForModerator> getPendingMaterialCommentForModerator() {

        List<MaterialComments> pendingMaterials = materialCommentRepository.findByPrijavljenTrue();

        return pendingMaterials.stream().map(comment -> {
            MaterialCommentResponseForModerator response = new MaterialCommentResponseForModerator();
            response.setCommentId(comment.getId());
            response.setContent(comment.getSadrzaj());
            response.setDate(comment.getDatumVrijeme().toString());
            response.setMyComment(false);
            response.setStudentId(comment.getKorisnik().getUserId());
            String name = comment.getKorisnik().getName() + " " + comment.getKorisnik().getSurname() + " (" + comment.getKorisnik().getUsername() + ")";
            response.setStudentName(name);
            return response;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void reviewMaterialComment(Integer commentId, boolean approved, String username) throws EntityNotFoundException {

        User moderator = userService.getUserByUsername(username);

        MaterialComments materialComments = materialCommentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Komentar ne postoji"));

        if(approved) {
            materialComments.setPrijavljen(false);
            materialCommentRepository.save(materialComments);

            String description = "Moderator :" + moderator.getUsername() + " je odbio zahtjev za uklanjanje komentara korisnika :" + materialComments.getKorisnik().getUsername() + " sadržaja \"" + materialComments.getSadrzaj() + "\".";
            moderatorAuditService.logAction(moderator,description);

        }
        else
        {
            materialCommentRepository.delete(materialComments);

            String description = "Moderator " + moderator.getUsername() + " je obrisao komentar korisnika :" + materialComments.getKorisnik().getUsername() + " čiji je sadržaj \"" + materialComments.getSadrzaj() + "\".";
            moderatorAuditService.logAction(moderator,description);

            String title = "Obavještenje o uklanjanju komentara";
            String message = "Vaš komentar \"" +  materialComments.getSadrzaj() + "\" je uklonjen.";
            notificationsService.createNotification(title, message,studentService.getStudentByUser(materialComments.getKorisnik()),LocalDateTime.now(),LocalDateTime.now());
        }
    }
}
