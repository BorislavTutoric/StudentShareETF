package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class StudentAccountResponse extends AccountResponse {
    private String email;
    private String studyProgram;
    private String major;

    public StudentAccountResponse(String username, String name, String surname,
                                  String Role, boolean active, String email,
                                  String studyProgram, String major) {
        super(username, name, surname, Role, active);
        this.email = email;
        this.studyProgram = studyProgram;
        this.major = major;
    }
}
