package com.eptms.controller;

import com.eptms.model.Role;
import com.eptms.model.User;
import com.eptms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tl")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_TL')")
public class TLController {

    private final UserRepository userRepository;

    @GetMapping("/my-team")
    public ResponseEntity<List<User>> getMyTeamMembers(Authentication auth) {
        User tl = userRepository.findByEmail(auth.getName()).orElseThrow();
        List<User> members = userRepository.findByTeamLeaderId(tl.getId());
        if (members.isEmpty()) {
            members = userRepository.findByRole(Role.ROLE_EMPLOYEE);
        }
        return ResponseEntity.ok(members);
    }
}