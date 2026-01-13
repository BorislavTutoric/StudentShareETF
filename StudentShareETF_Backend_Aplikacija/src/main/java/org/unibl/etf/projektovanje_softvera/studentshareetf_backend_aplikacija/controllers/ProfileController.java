package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.PasswordNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.generics.UserHolder;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.security.JwtService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.ProfileService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.UserService;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfileInformations(){
        try{
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            UserHolder<?> userHolder = profileService.getProfile(username);
            return ResponseEntity.ok(userHolder.getUser());
        }
        catch(UserNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/student-update")
    public ResponseEntity<?> updateStudentProfileInformation(@RequestBody UpdateStudentProfileInfoRequest request){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = profileService.updateStudentPersonalInfo(username,request);
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(token);
    }

    @PutMapping("/email-change")
    public ResponseEntity<?> changeEmail(@RequestBody EmailChangeRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String newEmail = request.getNewEmail();
        try {
            profileService.requestEmailChange(username, newEmail);
            return ResponseEntity.ok(Map.of("message", "Email verifikacioni link je poslat na novu adresu."));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/password-change")
    public ResponseEntity<?> changePassword(@RequestBody NewPasswordRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            profileService.changePassword(username, request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Lozinka je uspješno promijenjena"));
        } catch (UserNotFoundException | PasswordNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/profile/update")
    public ResponseEntity<?> updateProfileInfo(@RequestBody UpdateProfileInfoRequest request){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try{
            User user = profileService.updatePersonalInfo(username,request);
            String token = jwtService.generateToken(user);
            return ResponseEntity.ok(token);
        } catch (UserNotFoundException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/profile/check-password")
    public ResponseEntity<?> checkAdminPassword (@RequestBody CheckPasswordRequest request){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try{
            boolean check = userService.checkPassword(username, request);
            return ResponseEntity.ok(check);
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
