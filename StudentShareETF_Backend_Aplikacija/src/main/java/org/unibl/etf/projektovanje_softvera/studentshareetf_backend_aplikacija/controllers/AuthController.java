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
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.LoginRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.LoginResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UnverifiedException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.StudentRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.security.JwtService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.RegistrationRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.CheckUsernameRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.CheckUsernameResponse;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


import java.util.Map;

@RestController
@RequestMapping("/all/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final RegistrationService RegistrationService;
    private final StudentRepository StudentRepository;
    private final StudentService studentService;

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

            studentService.verificationCheck(user);

            String token = jwtService.generateToken(user);

            return ResponseEntity.ok(new LoginResponse(token, user.getAuthorities().iterator().next().getAuthority()));
        }
        catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Neispravno korisničko ime ili lozinka"));
        }
        catch (UnverifiedException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", ex.getMessage()));
        }
    }
    @PostMapping("/registration")
    public ResponseEntity<?> register(@RequestBody RegistrationRequest request) {

        try {
            RegistrationService.register(request);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of("message", "Registracija uspješna."));
        }
        catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/check-username")
    public ResponseEntity<CheckUsernameResponse> checkUsername(@RequestParam String username) {
        try {
            UserDetails existingUser = userDetailsService.loadUserByUsername(username);
            CheckUsernameResponse response = new CheckUsernameResponse(false, "Username already taken");
            return ResponseEntity.ok(response);
        } catch (UsernameNotFoundException ex) {
            CheckUsernameResponse response = new CheckUsernameResponse(true, "Username is available");
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        try
        {
            Student student = StudentRepository.findByVerificationToken(token)
                    .orElseThrow(() -> new RuntimeException("Nevažeći token"));

            student.setVerified(true);
            student.setVerificationToken(null);
            StudentRepository.save(student);

            return ResponseEntity.ok(Map.of("message", "Email potvrđen."));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(400).body(Map.of("error", ex.getMessage()));
        }
    }
}

