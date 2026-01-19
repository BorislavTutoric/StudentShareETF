package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.NotificationsResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.EntityNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Notification;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.NotificationsRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationsService {
    private final NotificationsRepository notificationsRepository;
    private final UserService userService;
    private final StudentService studentService;

    public List<NotificationsResponse> getNotificationsByUsername(String username) throws UserNotFoundException, EntityNotFoundException {
        User user = userService.getUserByUsername(username);
        Student student = studentService.getStudentByUser(user);
        List<Notification> notifications = notificationsRepository.findActiveNotifications(student, LocalDateTime.now());
        List<NotificationsResponse> notificationsResponses = new ArrayList<>();
        for (Notification notification1 : notifications) {
                notificationsResponses.add(new NotificationsResponse(notification1.getId(), notification1.getTitle(), notification1.getMessage(), notification1.getRead(), notification1.getDateTime(), notification1.getActiveFrom()));
        }
        return  notificationsResponses;
    }

    public void notificationDelete(Integer id) throws EntityNotFoundException {
        Optional<Notification> notification = notificationsRepository.findById(id);
        if (notification.isPresent()) {
            notificationsRepository.delete(notification.get());
        }else{
            throw new EntityNotFoundException("Nepostojeće obavještenje!");
        }
    }

    public void setReadNotification(Integer id) throws EntityNotFoundException {
        Optional<Notification> notification = notificationsRepository.findById(id);
        if (notification.isPresent()) {
            Notification notification1 = notification.get();
            notification1.setRead(true);
            notificationsRepository.save(notification1);
        } else{
            throw new EntityNotFoundException("Obavještenje nije pronadjeno!");
        }
    }

    public Integer checkUnreadNotifications(String username) throws UserNotFoundException{
        User user = userService.getUserByUsername(username);
        Student student = studentService.getStudentByUser(user);
        List<Notification> notifications = notificationsRepository.findActiveUnreadNotifications(student, LocalDateTime.now());
        return notifications.size();
    }

    public void createNotification(String title, String message, Student student, LocalDateTime dateTime, LocalDateTime activeFrom){
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setDateTime(dateTime);
        notification.setActiveFrom(activeFrom);
        notification.setStudent(student);

        notificationsRepository.save(notification);
    }

    public void deleteTaskNotification(Integer taskId, Student student){
        List<Notification> taskNotifications = notificationsRepository.findTaskNotifications("Podsjetnik za obavezu!", student);
        for (Notification notification : taskNotifications) {
            if(notification.getTitle().contains("(id: " + taskId + ")")){
                notificationsRepository.delete(notification);
            }
        }
    }
}
