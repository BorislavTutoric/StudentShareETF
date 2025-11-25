package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.MaterialCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.MaterialComments;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MaterialCommentRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialCommentService {

    private final MaterialCommentRepository materialCommentRepository;


    public List<MaterialCommentResponse> getCommentsByMaterialId(Integer materialId) {

        List<MaterialComments> comments = materialCommentRepository.findByMaterijal_MaterialId(materialId);
        List<MaterialCommentResponse> commentResponses = new ArrayList<>();
        for (MaterialComments comment : comments) {
            User user = comment.getKorisnik();
            commentResponses.add(new MaterialCommentResponse(comment.getSadrzaj(),comment.getDatumVrijeme(),user.getName(),user.getSurname()));
        }
        return commentResponses;
    }
}
