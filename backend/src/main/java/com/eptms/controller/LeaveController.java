package com.eptms.controller;

import com.eptms.dto.LeaveDTOs.*;
import com.eptms.model.*;
import com.eptms.repository.LeaveRepository;
import com.eptms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/leave")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveRepository leaveRepository;
    private final UserRepository userRepository;

    @PostMapping("/apply")
    public ResponseEntity<?> applyLeave(@RequestBody ApplyLeaveRequest req, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        if (user.getRole() == Role.ROLE_ADMIN) {
            return ResponseEntity.badRequest().body("Administrators do not require leave approval.");
        }

        int days = (int) ChronoUnit.DAYS.between(req.getStartDate(), req.getEndDate()) + 1;
        if (days <= 0) days = 1;

        LeaveRequest leave = LeaveRequest.builder()
                .employee(user)
                .leaveType(req.getLeaveType())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .numberOfDays(days)
                .reason(req.getReason())
                .status(LeaveStatus.PENDING)
                .build();

        return ResponseEntity.ok(leaveRepository.save(leave));
    }

    @GetMapping("/my-leaves")
    public ResponseEntity<List<LeaveRequest>> getMyLeaves(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(leaveRepository.findByEmployeeIdOrderByCreatedAtDesc(user.getId()));
    }

    @GetMapping("/pending-approvals")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_TL')")
    public ResponseEntity<List<LeaveRequest>> getPendingApprovals(Authentication auth) {
        User current = userRepository.findByEmail(auth.getName()).orElseThrow();

        if (current.getRole() == Role.ROLE_ADMIN) {
            // Admin sees Manager leaves
            return ResponseEntity.ok(leaveRepository.findByEmployeeRoleAndStatusOrderByCreatedAtDesc(Role.ROLE_MANAGER, LeaveStatus.PENDING));
        } else if (current.getRole() == Role.ROLE_MANAGER) {
            // Manager sees TL leaves
            return ResponseEntity.ok(leaveRepository.findByEmployeeManagerIdAndEmployeeRoleOrderByCreatedAtDesc(current.getId(), Role.ROLE_TL));
        } else if (current.getRole() == Role.ROLE_TL) {
            // TL sees Employee leaves
            return ResponseEntity.ok(leaveRepository.findByEmployeeTeamLeaderIdOrderByCreatedAtDesc(current.getId()));
        }

        return ResponseEntity.ok(Collections.emptyList());
    }

    @PatchMapping("/{id}/action")
    @Transactional
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_TL')")
    public ResponseEntity<LeaveRequest> processLeaveAction(
            @PathVariable Long id,
            @RequestBody ActionLeaveRequest req,
            Authentication auth
    ) {
        LeaveRequest leave = leaveRepository.findById(id).orElseThrow();
        leave.setReviewerComments(req.getComments());
        leave.setReviewedBy(auth.getName());
        leave.setStatus(req.isApproved() ? LeaveStatus.APPROVED : LeaveStatus.REJECTED);

        if (req.isApproved()) {
            User emp = leave.getEmployee();
            switch (leave.getLeaveType()) {
                case CASUAL -> emp.setCasualLeaveBalance(Math.max(0, emp.getCasualLeaveBalance() - leave.getNumberOfDays()));
                case SICK -> emp.setSickLeaveBalance(Math.max(0, emp.getSickLeaveBalance() - leave.getNumberOfDays()));
                case EARNED -> emp.setEarnedLeaveBalance(Math.max(0, emp.getEarnedLeaveBalance() - leave.getNumberOfDays()));
            }
            userRepository.save(emp);
        }

        return ResponseEntity.ok(leaveRepository.save(leave));
    }
}