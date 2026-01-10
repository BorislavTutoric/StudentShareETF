package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Material;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialResponseForModerator extends MaterialResponse {
    private Integer studentId;
    private String studentName;
    private String uploadDate;
}
