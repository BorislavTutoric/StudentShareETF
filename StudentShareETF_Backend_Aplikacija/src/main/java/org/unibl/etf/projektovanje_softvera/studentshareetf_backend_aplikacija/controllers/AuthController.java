package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.LoginRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.LoginResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.security.JwtService;

import java.util.Map;

@RestController
@RequestMapping("/all/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            UserDetails user = userDetailsService.loadUserByUsername(request.getUsername());

            String token = jwtService.generateToken(user);

            return ResponseEntity.ok(new LoginResponse(token, user.getAuthorities().iterator().next().getAuthority()));
        }
        catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid username or password"));
        }
    }
}

