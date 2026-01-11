package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Dobavljanje svih korisnika koji su studenti
    public List<User> getAllStudents() {
        return userRepository.findAll()
                .stream()
                .filter(u -> "STUDENT".equalsIgnoreCase(u.getRole()))
                .collect(Collectors.toList());
    }

    // Promjena statusa korisnika
    public void updateUserStatus(Integer userId, Boolean aktivan) throws UserNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException());
        user.setActive(aktivan);
        userRepository.save(user);
    }

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return  userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
    }

    public User getUserByUsername(String username) throws UserNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        if(user.isPresent()){
            return user.get();
        }else{
            throw new UserNotFoundException();
        }
    }

    public String getNameByUsername(String username) throws UserNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        if(user.isPresent()){
            return user.get().getName();
        }
        else {
            throw new UserNotFoundException();
        }
    }

}
