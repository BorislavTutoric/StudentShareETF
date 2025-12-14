package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.AlreadySavedException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Material;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.SavedMaterial;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.compositeKeys.SavedMaterialId;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.SavedMaterialRepository;

@Service
@RequiredArgsConstructor
public class SavedMaterialService {
    private final SavedMaterialRepository savedMaterialRepository;
    private final UserService userService;
    private final MaterialService materialService;
    private final StudentService studentService;

    public void materialSave(String username, Integer materialId)throws UserNotFoundException, EntityNotFoundException, AlreadySavedException {
        User user = userService.getUserByUsername(username);
        Material material = materialService.getMaterialById(materialId);
        Student student = studentService.getStudentByUser(user);
        if(savedMaterialRepository.existsByMaterialAndStudent(material, student)){
            throw new AlreadySavedException();
        }
        else {
            SavedMaterial savedMaterial = new SavedMaterial(material, student);
            savedMaterialRepository.save(savedMaterial);
        }

    }
}
