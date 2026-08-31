package com.eptms.controller;

import com.eptms.dto.OrgDTOs.CreateUserRequest;
import com.eptms.model.Role;
import com.eptms.model.User;
import com.eptms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER')")
public class ManagerController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/my-team-leads")
    public ResponseEntity<List<User>> getMyTeamLeads(Authentication auth) {
        User manager = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(userRepository.findByManagerId(manager.getId()).stream()
                .filter(u -> u.getRole() == Role.ROLE_TL)
                .toList());
    }

    @GetMapping("/my-staff")
    public ResponseEntity<List<User>> getMyStaff(Authentication auth) {
        User manager = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(userRepository.findByManagerId(manager.getId()));
    }

    @PostMapping("/create-worker")
    public ResponseEntity<User> createWorkerOrTL(@RequestBody CreateUserRequest req, Authentication auth) {
        User manager = userRepository.findByEmail(auth.getName()).orElseThrow();

        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword() != null ? req.getPassword() : "eptms123"))
                .role(req.getRole() == Role.ROLE_TL ? Role.ROLE_TL : Role.ROLE_EMPLOYEE)
                .manager(manager)
                .teamLeader(req.getTlId() != null ? userRepository.findById(req.getTlId()).orElse(null) : null)
                .active(true)
                .build();

        return ResponseEntity.ok(userRepository.save(user));
    }
}