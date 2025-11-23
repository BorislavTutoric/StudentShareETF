package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;


import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.NewPasswordRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.PasswordChangeRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.generics.UserHolder;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.ProfileService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.UpdateProfileInfoRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EmailChangeRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final UserRepository userRepository;

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

    @PutMapping("/update")
    public ResponseEntity<?> updateProfileInformation(@RequestBody UpdateProfileInfoRequest request){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        profileService.updatePersonalInfo(username,request);
        return ResponseEntity.ok("Profil uspješno izmjenjen!");
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

    @PutMapping("/password-change")
    public ResponseEntity<?> changePassword(@RequestBody NewPasswordRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            profileService.changePassword(username, request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Lozinka je uspješno promijenjena"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
