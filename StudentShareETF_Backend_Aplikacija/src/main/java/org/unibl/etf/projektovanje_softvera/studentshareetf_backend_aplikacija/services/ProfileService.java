package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.StudentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.UserResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.generics.UserHolder;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.StudentRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.UpdateProfileInfoRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.EmailService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public UserHolder<?> getProfile(String username) throws UserNotFoundException{
        Optional<User> u = userRepository.findByUsername(username);

        if(u.isPresent()){
            User user = u.get();
            Optional<Student> s = studentRepository.findByUser(user);
            if(s.isPresent()){
                Student student = s.get();
                StudentResponse studentResponse = new StudentResponse(user.getName(), user.getSurname(), user.getUsername(),
                        user.getRole(), student.getEmail(), student.getStudyProgram(), student.getMajor());
                UserHolder<StudentResponse> userHolder = new UserHolder<>(studentResponse);
                return userHolder;
            }
            else {
                UserResponse  userResponse = new UserResponse(user.getName(), user.getSurname(), user.getUsername(),
                        user.getRole());
                UserHolder<UserResponse> userHolder = new UserHolder<>(userResponse);
                return userHolder;
            }
        }
        else {
            throw new UserNotFoundException(username);
        }
    }

    @Transactional
    public void updatePersonalInfo(String username, UpdateProfileInfoRequest request) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        Student student = studentRepository.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        user.setName(request.getName());
        user.setSurname(request.getSurname());

        student.setStudyProgram(request.getStudyProgram());
        student.setMajor(request.getMajor());

        userRepository.save(user);
        studentRepository.save(student);
    }

    @Transactional
    public String requestEmailChange(String username, String newEmail) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen."));

        studentRepository.findByEmail(newEmail).ifPresent(s -> {
            throw new RuntimeException("Email je već zauzet!");
        });

        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student nije pronađen."));

        student.setPendingEmail(newEmail);
        String token = UUID.randomUUID().toString();
        student.setVerificationToken(token);
        studentRepository.save(student);
        emailService.sendChangeEmail(newEmail, token);

        return token;
    }

    @Transactional
    public void changePassword(String username, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

}
