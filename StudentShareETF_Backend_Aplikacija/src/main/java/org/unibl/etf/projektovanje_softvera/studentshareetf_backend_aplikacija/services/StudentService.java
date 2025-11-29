package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.task.DelegatingSecurityContextAsyncTaskExecutor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EmailNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UnverifiedException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Major;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.MajorRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.StudentRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final MajorService majorService;

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

    public void emailCheck(String email) throws EmailNotFoundException {
        Optional<Student>  student = studentRepository.findByEmail(email);
        if(student.isPresent()) {
            return;
        }
        else{
            throw new EmailNotFoundException("Email is available");
        }
    }

    public Major getStudentMajor(User user) throws EntityNotFoundException {
        Optional<Student> s = studentRepository.findByUser(user);
        if(s.isPresent()){
            Student student = s.get();
            String major = student.getMajor();
            return majorService.getMajorByName(major);
        }else {
            throw new EntityNotFoundException("Studentski nalog ne postoji");
        }
    }

    public Student getStudentByUser(User user) throws EntityNotFoundException {
        Optional<Student> s = studentRepository.findByUser(user);
        if(s.isPresent()){
            Student student = s.get();
            return student;
        }else  {
            throw new EntityNotFoundException("Studentski nalog ne postoji");
        }
    }
}
