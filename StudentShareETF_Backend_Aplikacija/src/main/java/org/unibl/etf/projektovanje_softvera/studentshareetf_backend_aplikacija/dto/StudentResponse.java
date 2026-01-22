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

    public StudentResponse(Integer id, String name, String surname, String username, String role, boolean active,
                           String email, String studyProgram, String major) {
        super(id, name, surname, username, role, active);
        this.email = email;
        this.studyProgram = studyProgram;
        this.major = major;
    }
}
