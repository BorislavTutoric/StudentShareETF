package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.TaskResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Task;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.TaskRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserService userService;
    private final StudentService studentService;
    private final NotificationsService notificationsService;

    public List<TaskResponse> getTasksForDate(String month, String year, String username) {

        User user = userService.getUserByUsername(username);
        Student student = studentService.getStudentByUser(user);

        int m = Integer.parseInt(month);
        int y = Integer.parseInt(year);

        LocalDate startDate = LocalDate.of(y, m, 1);

        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        LocalDateTime startOfMonth = startDate.atStartOfDay();
        LocalDateTime endOfMonth = endDate.atTime(LocalTime.MAX);

        List<Task> tasks = taskRepository.findByStudentAndDatumVrijemeBetween(
                student, startOfMonth, endOfMonth
        );

        return tasks.stream()
                .map(t -> {
                    LocalDateTime dt = t.getDatumVrijeme();
                    String date = dt.toLocalDate().toString();
                    String time = dt.toLocalTime().toString();
                    return new TaskResponse(
                            t.getId(),
                            t.getNaslov(),
                            t.getOpis(),
                            date,
                            time,
                            t.isFakultetska()
                    );
                })
                .collect(Collectors.toList());
    }

    public Integer createTask(String title, String description, String date, String time, String username,String way) {
        User user = userService.getUserByUsername(username);

        Student student = studentService.getStudentByUser(user);

        LocalDate localDate = LocalDate.parse(date);

        LocalTime localTime = (time != null && !time.isBlank()) ? LocalTime.parse(time) : LocalTime.of(0, 0);

        LocalDateTime dateTime = LocalDateTime.of(localDate, localTime);

        Task task = new Task();
        task.setNaslov(title);
        task.setOpis(description);
        task.setDatumVrijeme(dateTime);
        task.setStudent(student);
        task.setFakultetska(!"personal".equals(way));

        taskRepository.save(task);

        LocalDateTime now = LocalDateTime.now();

        LocalDateTime sevenDaysBefore = dateTime.minusDays(7);
        if (sevenDaysBefore.isAfter(now) || sevenDaysBefore.isEqual(now)) {
            notificationsService.createNotification(
                    "Podsjetnik za obavezu! (id: " + task.getId() + ")" ,
                    "Vaša obaveza: " + title + " je za 7 dana",
                    student,
                    now,
                    sevenDaysBefore
            );
        }

        LocalDateTime threeDaysBefore = dateTime.minusDays(3);
        if (threeDaysBefore.isAfter(now) || threeDaysBefore.isEqual(now)) {
            String message = "Vaša obaveza: " + title + " je za 3 dana.";
            if (!way.equals("personal")) {
                message += "\nPrijavite ispit ako već niste!";
            }
            notificationsService.createNotification(
                    "Podsjetnik za obavezu! (id: " + task.getId() + ")" ,
                    message,
                    student,
                    now,
                    threeDaysBefore
            );
        }

        LocalDateTime oneDayBefore = dateTime.minusDays(1);
        if (oneDayBefore.isAfter(now) || oneDayBefore.isEqual(now)) {
            notificationsService.createNotification(
                    "Podsjetnik za obavezu! (id: " + task.getId() + ")" ,
                    "Vaša obaveza: " + title + " je za 1 dan",
                    student,
                    now,
                    oneDayBefore
            );
        }


        return task.getId();
    }

    public void deleteTask(Integer taskId, String username) {
        User user = userService.getUserByUsername(username);

        Student student = studentService.getStudentByUser(user);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Obaveza ne postoji!"));

        if (!task.getStudent().getUserId().equals(student.getUserId())) {
            throw new RuntimeException("Nemate pravo brisati ovu obavezu!");
        }

        taskRepository.delete(task);

        notificationsService.deleteTaskNotification(taskId, student);
    }


}
