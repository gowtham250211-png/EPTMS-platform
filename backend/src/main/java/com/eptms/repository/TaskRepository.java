package com.eptms.repository;

import com.eptms.model.Task;
import com.eptms.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToId(Long userId);
    List<Task> findByCreatedById(Long userId);
    long countByStatus(TaskStatus status);
}