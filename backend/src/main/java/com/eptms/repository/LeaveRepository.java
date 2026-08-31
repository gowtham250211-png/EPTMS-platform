package com.eptms.repository;

import com.eptms.model.LeaveRequest;
import com.eptms.model.LeaveStatus;
import com.eptms.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);

    // For Admin: Get leaves applied by Managers
    List<LeaveRequest> findByEmployeeRoleAndStatusOrderByCreatedAtDesc(Role role, LeaveStatus status);

    // For Manager: Get leaves applied by TLs reporting to this Manager
    List<LeaveRequest> findByEmployeeManagerIdAndEmployeeRoleOrderByCreatedAtDesc(Long managerId, Role role);

    // For TL: Get leaves applied by Employees reporting to this TL
    List<LeaveRequest> findByEmployeeTeamLeaderIdOrderByCreatedAtDesc(Long tlId);
}