package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdviceResponse {

    protected Integer id;
    protected String content;
    protected LocalDateTime dateTime;
    protected boolean reported;

    protected String username;
    protected String name;
    protected String surname;

    protected Integer likesCount;
    protected Integer commentsCount;
    protected boolean likedByMe;
    protected boolean myAdvice;
}