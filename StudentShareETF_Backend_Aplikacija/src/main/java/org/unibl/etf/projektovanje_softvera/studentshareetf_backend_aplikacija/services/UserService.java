package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    //public UserService(UserRepository userRepository) {
        //this.userRepository = userRepository;
    //}

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

    public List<User> getUsersByRole(String role){
        return userRepository.findByRoleContaining(role);
    }

    public List<UserResponse> getModeratorAccounts(){
        return userRepository.findByRoleContaining("MODERATOR")
                .stream()
                .map(user -> new UserResponse(user.getUserId(), user.getName(), user.getSurname(), user.getUsername(),  user.getRole(), user.isActive()))
                .toList();
    }

    public Integer createModeratorAccount(CreateModeratorAccountRequest request){
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Korisničko ime već postoji!");
        }

        User user = new User();
        user.setName(request.getFirstName());
        user.setSurname(request.getLastName());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setActive(true);
        userRepository.save(user);
        return user.getUserId();
    }

    public User getUserById(Integer id) throws UserNotFoundException{
        Optional<User> user = userRepository.findById(id);
        if(user.isPresent()){
            return user.get();
        }else {
            throw new UserNotFoundException();
        }
    }

    public void deleteAccount(User user){
        userRepository.delete(user);
    }

    public void deactivateAccount(Integer id) throws UserNotFoundException {
        User user = getUserById(id);
        user.setActive(false);
        userRepository.save(user);
    }

    public void activateAccount(Integer id) throws UserNotFoundException {
        User user = getUserById(id);
        user.setActive(true);
        userRepository.save(user);
    }

    public void changeModeratorPassword(UpdateModeratorPasswordRequest request) throws UserNotFoundException {
        User user = getUserByUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public boolean checkPassword(String username, CheckPasswordRequest request) throws UserNotFoundException {
        User user = getUserByUsername(username);
        return passwordEncoder.matches(request.getPassword(), user.getPassword());
    }

    public ReloginResponse getCurrentLoginUserInfo(String username) throws UserNotFoundException {
        User user = getUserByUsername(username);
        return new ReloginResponse(user.getUsername(), user.getRole());
    }
}
