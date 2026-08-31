package com.eptms.controller;

import com.eptms.dto.TaskDTOs.*;
import com.eptms.model.*;
import com.eptms.repository.TaskRepository;
import com.eptms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Task>> getTasks(Authentication auth) {
        User current = userRepository.findByEmail(auth.getName()).orElseThrow();
        if (current.getRole() == Role.ROLE_EMPLOYEE) {
            return ResponseEntity.ok(taskRepository.findByAssignedToId(current.getId()));
        } else if (current.getRole() == Role.ROLE_TL) {
            // TL sees tasks assigned to them + tasks created by them
            List<Task> assignedToMe = taskRepository.findByAssignedToId(current.getId());
            List<Task> createdByMe = taskRepository.findByCreatedById(current.getId());
            assignedToMe.addAll(createdByMe);
            return ResponseEntity.ok(assignedToMe.stream().distinct().toList());
        }
        return ResponseEntity.ok(taskRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_TL')")
    public ResponseEntity<Task> createTask(@RequestBody CreateTaskRequest req, Authentication auth) {
        User creator = userRepository.findByEmail(auth.getName()).orElseThrow();
        User assignee = userRepository.findById(req.getAssignedToId()).orElseThrow();

        Task task = Task.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .sector(req.getSector() != null ? req.getSector() : "Core Architecture")
                .priority(req.getPriority())
                .estimatedHours(req.getEstimatedHours())
                .dueDate(req.getDueDate())
                .assignedTo(assignee)
                .createdBy(creator)
                .status(TaskStatus.ASSIGNED)
                .progress(0)
                .build();

        return ResponseEntity.ok(taskRepository.save(task));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> updateStatus(@PathVariable Long id, @RequestBody UpdateTaskStatusRequest req) {
        Task task = taskRepository.findById(id).orElseThrow();
        task.setStatus(req.getStatus());
        task.setProgress(req.getProgress());

        if (req.getStatus() == TaskStatus.COMPLETED) {
            task.setCompletedAt(LocalDateTime.now());
            User employee = task.getAssignedTo();
            if (employee != null) {
                employee.setXpPoints(employee.getXpPoints() + 15);
                userRepository.save(employee);
            }
        }

        return ResponseEntity.ok(taskRepository.save(task));
    }
}