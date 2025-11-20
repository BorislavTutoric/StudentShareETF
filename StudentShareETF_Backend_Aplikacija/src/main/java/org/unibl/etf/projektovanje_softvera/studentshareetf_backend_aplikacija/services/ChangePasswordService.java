package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.PasswordChangeRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EmailNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.StudentRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChangePasswordService {

    private final StudentRepository studentRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void passwordChangeMailSender(String email) throws EmailNotFoundException {
        Optional<Student> s = studentRepository.findByEmail(email);
        if(s.isPresent()){
            Student student = s.get();
            String token = UUID.randomUUID().toString();
            student.setVerificationToken(token);
            studentRepository.save(student);
            emailService.sendPasswordChangeEmail(student.getEmail(), token);
        }
        else {
            throw new EmailNotFoundException();
        }
    }

    public void changePassword(PasswordChangeRequest passwordChangeRequest) throws UserNotFoundException {
        Optional<Student> s = studentRepository.findByVerificationToken(passwordChangeRequest.getToken());
        if(s.isPresent()){
            Student student = s.get();
            Optional<User> u = userRepository.findByUserId(student.getUserId());
            if(u.isPresent()){
                User user = u.get();
                user.setPassword(passwordEncoder.encode(passwordChangeRequest.getPassword()));
                userRepository.save(user);
            }
            student.setVerificationToken(null);
            studentRepository.save(student);
        }
        else{
            throw new UserNotFoundException();
        }
    }
}
