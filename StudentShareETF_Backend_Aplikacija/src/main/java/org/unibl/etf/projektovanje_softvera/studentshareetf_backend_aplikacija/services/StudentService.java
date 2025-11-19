package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UnverifiedException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.StudentRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public void verificationCheck(UserDetails userDetails) throws UnverifiedException {

        Optional<User> user = userRepository.findByUsername(userDetails.getUsername());

        Optional<Student> s = studentRepository.findByUser(user.get());

        if(s.isPresent()){
            Student student = s.get();
            if(student.getVerified()) {
                return;
            }
            else {
                throw new UnverifiedException();
            }
        }
    }
}
