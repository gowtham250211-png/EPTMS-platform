package com.eptms.dto;

import com.eptms.model.TaskPriority;
import com.eptms.model.TaskStatus;
import lombok.Data;
import java.time.LocalDate;

public class TaskDTOs {
    @Data
    public static class CreateTaskRequest {
        private String title;
        private String description;
        private String sector;
        private TaskPriority priority;
        private int estimatedHours;
        private LocalDate dueDate;
        private Long assignedToId;
    }

    @Data
    public static class UpdateTaskStatusRequest {
        private TaskStatus status;
        private int progress;
    }
}