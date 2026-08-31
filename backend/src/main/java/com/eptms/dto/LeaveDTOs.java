package com.eptms.dto;

import com.eptms.model.LeaveType;
import lombok.Data;
import java.time.LocalDate;

public class LeaveDTOs {
    @Data
    public static class ApplyLeaveRequest {
        private LeaveType leaveType;
        private LocalDate startDate;
        private LocalDate endDate;
        private String reason;
    }

    @Data
    public static class ActionLeaveRequest {
        private boolean approved;
        private String comments;
    }
}