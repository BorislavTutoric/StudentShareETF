package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileInfoRequest {
    private String username;
    private String firstName;
    private String lastName;
}
