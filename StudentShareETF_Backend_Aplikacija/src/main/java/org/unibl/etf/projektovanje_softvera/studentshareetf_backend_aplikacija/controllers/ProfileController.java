package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.generics.UserHolder;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.ProfileService;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfileInformations(@RequestParam String username){
        try{
            UserHolder<?> userHolder = profileService.getProfile(username);

            return ResponseEntity.ok(userHolder.getUser());
        }
        catch(UserNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

}
