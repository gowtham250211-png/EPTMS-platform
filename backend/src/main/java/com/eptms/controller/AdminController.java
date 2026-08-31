package com.eptms.controller;

import com.eptms.dto.OrgDTOs.*;
import com.eptms.model.*;
import com.eptms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getOrganizationStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEmployees", userRepository.countByRole(Role.ROLE_EMPLOYEE));
        stats.put("totalTLs", userRepository.countByRole(Role.ROLE_TL));
        stats.put("totalManagers", userRepository.countByRole(Role.ROLE_MANAGER));
        stats.put("activeTasks", taskRepository.countByStatus(TaskStatus.IN_PROGRESS));
        stats.put("completedTasks", taskRepository.countByStatus(TaskStatus.COMPLETED));
        stats.put("avgPerformance", 89.2);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest req, Authentication auth) {
        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword() != null ? req.getPassword() : "eptms123"))
                .role(req.getRole())
                .manager(req.getManagerId() != null ? userRepository.findById(req.getManagerId()).orElse(null) : null)
                .teamLeader(req.getTlId() != null ? userRepository.findById(req.getTlId()).orElse(null) : null)
                .active(true)
                .build();

        User saved = userRepository.save(user);

        auditLogRepository.save(AuditLog.builder()
                .performedBy(auth.getName())
                .action("USER_CREATION")
                .entityTarget(saved.getEmail())
                .details("Created new user with role: " + saved.getRole())
                .build());

        return ResponseEntity.ok(saved);
    }

    @PostMapping("/change-role")
    public ResponseEntity<String> changeUserRole(@RequestBody RoleChangeRequest req, Authentication auth) {
        User user = userRepository.findById(req.getUserId()).orElseThrow();
        Role oldRole = user.getRole();
        user.setRole(req.getNewRole());

        if (req.getManagerId() != null) {
            user.setManager(userRepository.findById(req.getManagerId()).orElse(null));
        }
        if (req.getTlId() != null) {
            user.setTeamLeader(userRepository.findById(req.getTlId()).orElse(null));
        }

        userRepository.save(user);

        auditLogRepository.save(AuditLog.builder()
                .performedBy(auth.getName())
                .action("ROLE_CHANGE")
                .entityTarget(user.getEmail())
                .details(String.format("Changed role from %s to %s", oldRole, req.getNewRole()))
                .build());

        return ResponseEntity.ok("User position updated successfully");
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findTop20ByOrderByTimestampDesc());
    }
}