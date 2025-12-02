package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventCommentRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.EventCommentResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Event;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.EventComment;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.EventCommentRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.EventRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventCommentService {

    private final EventCommentRepository eventCommentRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventCommentResponse createComment(EventCommentRequest request) {

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        EventComment comment = new EventComment();

        comment.setContent(request.getContent());
        comment.setEvent(event);
        comment.setUser(user);
        comment.setDateTime(LocalDateTime.now());
        comment.setReported(false);

        eventCommentRepository.save(comment);

        return new EventCommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getDateTime(),
                user.getUsername()
        );
    }

    public List<EventCommentResponse> getCommentsForEvent(Integer eventId) {
        return eventCommentRepository.findByEvent_Id(eventId)
                .stream()
                .map(c -> new EventCommentResponse(
                        c.getId(),
                        c.getContent(),
                        c.getDateTime(),
                        c.getUser().getUsername()
                ))
                .collect(Collectors.toList());
    }
}
