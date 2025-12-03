package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventCreateRequest {

    private String title;
    private String location;
    private String date;
    private String time;
    private String description;
    private MultipartFile image;
}
