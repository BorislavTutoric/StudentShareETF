package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialCommentResponseForModerator extends MaterialCommentResponse{
    private Integer studentId;
    private String studentName;
    private String content;
    private String date;
}
