package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdviceCommentResponse {

    private Integer id;
    private String content;
    private LocalDateTime dateTime;
    private boolean reported;

    private String username;
    private String name;
    private String surname;

    private boolean isMine;
    private Integer parentId;

    private List<AdviceCommentResponse> replies;
}