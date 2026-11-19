package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModuleStatResponse {
    private String module;
    private long totalSeconds;
    private double percentage;
    private long studentCount;
    private long averageSeconds;
}