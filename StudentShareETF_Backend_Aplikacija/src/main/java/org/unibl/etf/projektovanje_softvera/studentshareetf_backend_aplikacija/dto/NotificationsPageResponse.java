package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationsPageResponse {
    private List<NotificationsResponse> content;
    private boolean hasNext;
    private long totalElements;
    private long unreadCount;
}
