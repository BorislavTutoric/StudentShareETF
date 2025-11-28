package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.StudentRepository;

import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;

import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.RegistrationRequest;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public User register(RegistrationRequest req) {

        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setName(req.getName());
        user.setSurname(req.getSurname());
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole("STUDENT");
        user.setActive(true);

        user = userRepository.save(user);

        String token = java.util.UUID.randomUUID().toString();

        Student student = new Student(
                user,
                req.getEmail(),
                req.getStudyProgram(),
                req.getMajor()
        );
        student.setVerificationToken(token);
        student.setVerified(false);

        studentRepository.save(student);

        emailService.sendVerificationEmail(student.getEmail(), token);

        return user;
    }
}
