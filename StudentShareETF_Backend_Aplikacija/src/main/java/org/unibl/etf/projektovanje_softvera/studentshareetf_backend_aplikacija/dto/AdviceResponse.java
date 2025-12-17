package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdviceResponse {

    private Integer id;
    private String content;
    private LocalDateTime dateTime;
    private boolean reported;

    private String username;
    private String name;
    private String surname;

    private Integer likesCount;
    private Integer commentsCount;
    private boolean likedByMe;
    private boolean myAdvice;
}