package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.StudentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.UserResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.generics.UserHolder;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.StudentRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;

    private final StudentRepository studentRepository;

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

}
