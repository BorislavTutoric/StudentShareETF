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

    @GetMapping("/accounts/moderator")
    public ResponseEntity<?> getModeratorAccounts(){
        return ResponseEntity.ok(userService.getModeratorAccounts());
    }

    @GetMapping("/accounts/student")
    public ResponseEntity<?> getStudentAccounts(){
        try {
            List<StudentResponse> accounts = studentService.getStudentAccounts();
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

    @DeleteMapping("/accounts/moderator/{id}/delete")
    public ResponseEntity<?> deleteModeratorAccount (@PathVariable Integer id){
        userService.deleteModeratorAccount(id);
        return ResponseEntity.ok("Nalog uspješno obrisan!");
    }

    @DeleteMapping("/accounts/student/{id}/delete")
    public ResponseEntity<?> deleteStudentAccount (@PathVariable Integer id){
        try{
            studentService.deleteStudentAccount(id);
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
}
