package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EmailNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UnverifiedException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.StudentRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.security.JwtService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.*;
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
    private final StudentRepository studentRepository;
    private final StudentService studentService;
    private final ChangePasswordService changePasswordService;
    private final UserService userService;

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

            String name = userService.getNameByUsername(user.getUsername());

            return ResponseEntity.ok(new LoginResponse(token, user.getAuthorities().iterator().next().getAuthority(), user.getUsername(), name));
        }
        catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Neispravno korisničko ime ili lozinka!"));
        }
        catch (DisabledException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Vaš nalog je suspendovan!"));
        }
        catch (UnverifiedException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", ex.getMessage()));
        }
        catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Autentifikacija nije uspjela"));
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
    public ResponseEntity<CheckDataResponse> checkUsername(@RequestParam String username) {
        try {
            UserDetails existingUser = userDetailsService.loadUserByUsername(username);
            CheckDataResponse response = new CheckDataResponse(false, "Username already taken");
            return ResponseEntity.ok(response);
        } catch (UsernameNotFoundException ex) {
            CheckDataResponse response = new CheckDataResponse(true, "Username is available");
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/check-email")
    public ResponseEntity<CheckDataResponse> checkEmail(@RequestParam String email) {
        try {
            studentService.emailCheck(email);
            CheckDataResponse response = new CheckDataResponse(false, "Email already taken");
            return ResponseEntity.ok(response);
        } catch (EmailNotFoundException ex) {
            CheckDataResponse response = new CheckDataResponse(true, ex.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> body) {
        String token = body.get("token");

        try {
            Student student = studentRepository.findByVerificationToken(token)
                    .orElseThrow(() -> new RuntimeException("Nevažeći token"));

            if (student.getPendingEmail() != null) {
                student.setEmail(student.getPendingEmail());
                student.setPendingEmail(null);
            }

            if (!student.getVerified()) {
                student.setVerified(true);
            }

            student.setVerificationToken(null);
            studentRepository.save(student);

            return ResponseEntity.ok(Map.of("message", "Email potvrđen."));
        }
        catch (Exception ex) {
            return ResponseEntity.status(400).body(Map.of("error", ex.getMessage()));
        }
    }


    @PostMapping("/forgotten-password-request")
    public ResponseEntity<?> forgottenPasswordRequest(@RequestBody ForgottenPasswordRequest forgottenPasswordRequest) {
        try {
            changePasswordService.passwordChangeMailSender(forgottenPasswordRequest.getEmail());
            return ResponseEntity.ok(Map.of("message", "Email za izmjenu je poslat."));
        }
        catch (EmailNotFoundException ex) {
            return ResponseEntity.status(400).body(ex.getMessage());
        }
    }

    @PostMapping("/forgotten-password-change")
    public ResponseEntity<?> forgottenPasswordChange(@RequestBody PasswordChangeRequest passwordChangeRequest) {
        try {
            changePasswordService.changePassword(passwordChangeRequest);
            return ResponseEntity.ok(Map.of("message", "Lozinka je izmijenjena."));
        }
        catch (UserNotFoundException ex) {
            return ResponseEntity.status(400).body(ex.getMessage());
        }
    }
}

