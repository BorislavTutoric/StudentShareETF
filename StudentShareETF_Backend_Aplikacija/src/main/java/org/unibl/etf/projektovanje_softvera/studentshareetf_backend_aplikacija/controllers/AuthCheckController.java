package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.ReloginResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.UserService;

@RestController
@RequestMapping("/api/auth-check")
@RequiredArgsConstructor
public class AuthCheckController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> reloginCheck(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try{
            ReloginResponse reloginResponse = userService.getCurrentLoginUserInfo(username);
            return ResponseEntity.ok(reloginResponse);
        } catch(UserNotFoundException e){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}
