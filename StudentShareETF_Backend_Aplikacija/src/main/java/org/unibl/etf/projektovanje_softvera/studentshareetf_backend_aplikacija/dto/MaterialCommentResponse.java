package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Material;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.MaterialComments;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialCommentResponse {
    protected Integer commentId;
    protected String sadrzaj;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    protected LocalDateTime datum;
    
    protected String name;
    protected String surname;
    protected boolean isMyComment;
}
