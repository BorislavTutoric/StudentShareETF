package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialCommentResponse {
    private Integer commentId;
    private String sadrzaj;
    private LocalDateTime datum;
    private String name;
    private String surname;
    private boolean isMyComment;
}
