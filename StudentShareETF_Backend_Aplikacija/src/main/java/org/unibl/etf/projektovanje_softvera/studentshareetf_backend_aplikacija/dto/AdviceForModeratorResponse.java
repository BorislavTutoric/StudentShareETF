package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import java.time.LocalDateTime;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdviceForModeratorResponse {
    private Integer id;
    private String content;
    private LocalDateTime dateTime;
    private String username;
}
