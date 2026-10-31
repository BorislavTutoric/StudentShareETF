package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialListItemResponse {
    private Integer materialId;
    private String name;
    private String category;
    private String subjectName;
    private String description;
    private Double averageRating;
}
