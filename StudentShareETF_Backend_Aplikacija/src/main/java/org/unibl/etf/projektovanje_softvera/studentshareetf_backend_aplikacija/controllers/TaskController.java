package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.CreateTaskRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.DateTaskRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.ExamResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.ExamScheduleService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.TaskService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.TaskResponse;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final ExamScheduleService examScheduleService;

    @GetMapping("/my-tasks")
    public List<TaskResponse> getMyTasksByDate(@RequestParam("date") String date) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return taskService.getTasksForDate(date,username);
    }

    @PostMapping("/add")
    public ResponseEntity<?> createTask(@RequestBody CreateTaskRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        taskService.createTask(
                request.getNaslov(),
                request.getOpis(),
                request.getDatum(),
                request.getVrijeme(),
                username
        );
        return ResponseEntity.ok("Obaveza uspješno dodana.");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Integer id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        taskService.deleteTask(id, username);

        return ResponseEntity.ok("Obaveza uspješno obrisana.");
    }

    @GetMapping("/faculty-tasks")
    public List<ExamResponse> getFacultyTasksByDate(@RequestParam("date") String date) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return examScheduleService.getExamsFromPdfByDate(date,username);
    }
}
