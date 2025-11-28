package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentResponse extends UserResponse{
    private String email;
    private String studyProgram;
    private String major;

    public StudentResponse(String name, String surname, String username, String role,
                           String email, String studyProgram, String major) {
        super(name, surname, username, role);
        this.email = email;
        this.studyProgram = studyProgram;
        this.major = major;
    }
}
