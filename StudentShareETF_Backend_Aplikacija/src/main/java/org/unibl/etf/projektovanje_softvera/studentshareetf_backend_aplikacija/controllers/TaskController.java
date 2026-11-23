package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.CreateTaskRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.ExamResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.ExamScheduleService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.ExamService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.services.TaskService;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.TaskResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.TaskDoneRequest;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.TaskStatsResponse;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.dto.UpdateTaskRequest;

import java.time.LocalDate;
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

    @PutMapping("/{id}")
    public TaskResponse updateTask(@PathVariable Integer id, @RequestBody UpdateTaskRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return taskService.updateTask(id, request, username);
    }

    @PatchMapping("/{id}/done")
    public TaskResponse setTaskDone(@PathVariable Integer id, @RequestBody TaskDoneRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return taskService.setDone(id, Boolean.TRUE.equals(request.getObavljena()), username);
    }

    @GetMapping("/stats")
    public TaskStatsResponse getStats(
            @RequestParam(name = "od", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate od,
            @RequestParam(name = "do", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate datumDo) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return taskService.getStats(username, od, datumDo);
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
