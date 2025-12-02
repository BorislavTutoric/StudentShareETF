package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialCommentRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Material;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.MaterialComments;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialCommentRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MaterialCommentService {

    private final MaterialCommentRepository materialCommentRepository;
    private final UserService userService;
    private final MaterialService materialService;

    public List<MaterialCommentResponse> getCommentsByMaterialId(Integer materialId, String username) {

        List<MaterialComments> comments = materialCommentRepository.findByMaterijal_MaterialId(materialId);
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

    public void postComment(String username, String content, Integer materialId) throws UserNotFoundException, EntityNotFoundException {
        User user = userService.getUserByUsername(username);
        Material material = materialService.getMaterialById(materialId);
        LocalDateTime  dateTime = LocalDateTime.now();
        MaterialComments materialComment = new MaterialComments(content, dateTime, material, user);
        materialCommentRepository.save(materialComment);
    }

    public void commentReport(Integer commentId) throws EntityNotFoundException {
        Optional<MaterialComments> materialComment = materialCommentRepository.findById(commentId);
        if (materialComment.isPresent()){
            MaterialComments matComment = materialComment.get();
            matComment.setPrijavljen(true);
            materialCommentRepository.save(matComment);
        }else{
            throw new EntityNotFoundException("Komentar nije pronadjen!");
        }
    }
}
