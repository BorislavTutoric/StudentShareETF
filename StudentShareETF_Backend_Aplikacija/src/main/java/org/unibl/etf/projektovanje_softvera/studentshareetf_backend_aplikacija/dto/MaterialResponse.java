package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Material;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialResponse {
    private Integer materialId;
    private String name;
    private String category;
    private String subjectName;

    public static MaterialResponse fromMaterial(Material material) {
        return new MaterialResponse(material.getMaterialId(), material.getName(), material.getCategory(), material.getSubject().getName());
    }
}
