package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.CreateTaskRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.ExamResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.ExamScheduleService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.ExamService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.TaskService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.TaskResponse;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final ExamService examService;

    @GetMapping("/my-tasks")
    public List<TaskResponse> getMyTasksByDate(@RequestParam("month") String month,@RequestParam("year") String year) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return taskService.getTasksForDate(month, year, username);
    }

    @PostMapping("/add")
    public ResponseEntity<?> createTask(@RequestBody CreateTaskRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        Integer taskId = taskService.createTask(
                request.getNaslov(),
                request.getOpis(),
                request.getDatum(),
                request.getVrijeme(),
                username,
                request.getNacin()
        );
        return ResponseEntity.ok(taskId);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Integer id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        taskService.deleteTask(id, username);

        return ResponseEntity.ok("Obaveza uspješno obrisana.");
    }

   @GetMapping("/faculty-tasks")
    public List<ExamResponse> getFacultyTasksByDate(@RequestParam("month") Integer month, @RequestParam("year") Integer year) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return examService.getExamsForMajor(username,month,year);
    }
}
