package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.TaskResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.exceptions.UserNotFoundException;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Student;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.Task;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.User;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.TaskRepository;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.repositories.StudentRepository;

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
    }


}
