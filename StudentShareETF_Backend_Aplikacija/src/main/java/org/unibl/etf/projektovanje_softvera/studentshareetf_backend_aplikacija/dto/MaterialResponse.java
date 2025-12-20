package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Material;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialResponse {
    protected Integer materialId;
    protected String name;
    protected String category;
    protected String subjectName;
}
