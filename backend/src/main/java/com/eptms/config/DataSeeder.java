package com.eptms.config;

import com.eptms.model.*;
import com.eptms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import java.util.Arrays;
import java.util.List;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final TeamRepository teamRepository;
    private final TaskRepository taskRepository;
    private final LeaveRepository leaveRepository;
    private final PasswordEncoder passwordEncoder;
    private final Environment environment;

    @Value("${EPTMS_DEMO_SEED_ENABLED:true}")
    private boolean demoSeedEnabled;

    @Value("${EPTMS_DEMO_PASSWORD:}")
    private String deployedDemoPassword;

    // Explicit one-time migration for a dedicated, disposable PUBLIC DEMO database.
    // NEVER enable on a database that contains real employee accounts or data.
    @Value("${EPTMS_RESET_DEMO_PASSWORDS:false}")
    private boolean resetDemoPasswords;

    @Override
    public void run(String... args) {
        if (!demoSeedEnabled) return;

        boolean production = Arrays.asList(environment.getActiveProfiles()).contains("prod");
        long userCount = userRepository.count();
        if (production && (userCount == 0 || resetDemoPasswords)
                && (deployedDemoPassword == null || deployedDemoPassword.length() < 16)) {
            throw new IllegalStateException("Set EPTMS_DEMO_PASSWORD to a unique password of at least 16 characters");
        }

        // Explicit opt-in: update ONLY the 4 known disposable demo accounts.
        // Turn EPTMS_RESET_DEMO_PASSWORDS off after the first successful reset.
        if (userCount > 0) {
            if (production && resetDemoPasswords) {
                int changed = 0;
                for (String email : List.of("admin@eptms.io", "manager@eptms.io",
                        "tl@eptms.io", "employee@eptms.io")) {
                    var user = userRepository.findByEmail(email);
                    if (user.isPresent()) {
                        User existing = user.get();
                        existing.setPassword(passwordEncoder.encode(deployedDemoPassword));
                        userRepository.save(existing);
                        changed++;
                    }
                }
                log.info("Demo password reset completed for {} existing sample accounts", changed);
            }
            return;
        }

        Department eng = departmentRepository.save(Department.builder()
                .name("Engineering")
                .description("Core Platform Architecture & Engineering")
                .build());

        User admin = userRepository.save(User.builder()
                .fullName("System Administrator")
                .email("admin@eptms.io")
                .password(passwordEncoder.encode(production ? deployedDemoPassword : "admin123"))
                .role(Role.ROLE_ADMIN)
                .performanceScore(98.0)
                .xpPoints(2500)
                .build());

        User manager = userRepository.save(User.builder()
                .fullName("Priya Sharma")
                .email("manager@eptms.io")
                .password(passwordEncoder.encode(production ? deployedDemoPassword : "manager123"))
                .role(Role.ROLE_MANAGER)
                .performanceScore(94.0)
                .xpPoints(1800)
                .build());

        User tl = userRepository.save(User.builder()
                .fullName("Karthik Raman")
                .email("tl@eptms.io")
                .password(passwordEncoder.encode(production ? deployedDemoPassword : "tl123"))
                .role(Role.ROLE_TL)
                .manager(manager)
                .performanceScore(89.0)
                .xpPoints(1350)
                .build());

        Team teamAlpha = teamRepository.save(Team.builder()
                .name("Team Alpha - Backend")
                .department(eng)
                .manager(manager)
                .teamLeader(tl)
                .build());

        tl.setTeam(teamAlpha);
        userRepository.save(tl);

        User employee = userRepository.save(User.builder()
                .fullName("Arun Kumar")
                .email("employee@eptms.io")
                .password(passwordEncoder.encode(production ? deployedDemoPassword : "emp123"))
                .role(Role.ROLE_EMPLOYEE)
                .manager(manager)
                .teamLeader(tl)
                .team(teamAlpha)
                .performanceScore(87.0)
                .xpPoints(950)
                .build());

        taskRepository.save(Task.builder()
                .title("Implement Payment API Gateway")
                .description("Integrate webhook handlers with idempotency keys.")
                .priority(TaskPriority.HIGH)
                .status(TaskStatus.IN_PROGRESS)
                .progress(65)
                .estimatedHours(12)
                .actualHours(8)
                .dueDate(LocalDate.now().plusDays(2))
                .assignedTo(employee)
                .createdBy(tl)
                .build());

        leaveRepository.save(LeaveRequest.builder()
                .employee(employee)
                .leaveType(LeaveType.CASUAL)
                .startDate(LocalDate.now().plusDays(5))
                .endDate(LocalDate.now().plusDays(6))
                .numberOfDays(2)
                .reason("Attending family event")
                .status(LeaveStatus.PENDING)
                .build());

        log.info("EPTMS Seeding complete. All 4 tiers created.");
    }
}