package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentAccountResponse {
    private Integer id;
    private String name;
    private String surname;
    private String username;
    private String role;
    private boolean active;
    private String email;
    private String studyProgram;
    private String major;
}
