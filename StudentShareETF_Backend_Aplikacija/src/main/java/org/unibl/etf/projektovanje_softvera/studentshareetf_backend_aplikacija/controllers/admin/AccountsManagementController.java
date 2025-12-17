package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.StudentService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AccountsManagementController {

    private final UserService userService;
    private final StudentService studentService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfileInformations(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            AccountResponse account = userService.getAdminProfileInformations(username);
            return ResponseEntity.ok(account);
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/accounts/moderator")
    public ResponseEntity<?> getModeratorAccounts(){
        return ResponseEntity.ok(userService.getModeratorAccounts());
    }

    @GetMapping("/accounts/student")
    public ResponseEntity<?> getStudentAccounts(){
        try {
            List<StudentAccountResponse> accounts = studentService.getStudentAccounts();
            return ResponseEntity.ok(accounts);
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/accounts/moderator/create")
    public ResponseEntity<?> createModeratorAccount (@RequestBody CreateModeratorAccountRequest request){
        try{
            Integer userId = userService.createModeratorAccount(request);
            return ResponseEntity.ok(userId);
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/accounts/moderator/delete")
    public ResponseEntity<?> deleteModeratorAccount (@RequestParam String username){
        try{
            userService.deleteModeratorAccount(username);
            return ResponseEntity.ok("Nalog uspješno obrisan!");
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/accounts/student/delete")
    public ResponseEntity<?> deleteStudentAccount (@RequestParam String username){
        try{
            studentService.deleteStudentAccount(username);
            return ResponseEntity.ok("Nalog uspješno obrisan!");
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/accounts/moderator/password-change")
    public ResponseEntity<?> changeModeratorPassword (@RequestBody UpdateModeratorPasswordRequest request){
        try{
            userService.changeModeratorPassword(request);
            return ResponseEntity.ok("Lozinka je uspješno promijenjena!");
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/check-password")
    public ResponseEntity<?> checkAdminPassword (@RequestParam String password){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try{
            boolean check = userService.checkPassword(password, username);
            return ResponseEntity.ok(check);
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changeAdminPassword (@RequestBody UpdateAdminPasswordRequest request){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try{
            userService.changeAdminPassword(username, request);
            return ResponseEntity.ok("Lozinka je uspješno promijenjena!");
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
