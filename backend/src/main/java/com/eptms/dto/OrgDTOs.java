package com.eptms.dto;

import com.eptms.model.Role;
import lombok.Data;

public class OrgDTOs {
    @Data
    public static class CreateUserRequest {
        private String fullName;
        private String email;
        private String password;
        private Role role;
        private Long managerId;
        private Long tlId;
    }

    @Data
    public static class RoleChangeRequest {
        private Long userId;
        private Role newRole;
        private Long managerId;
        private Long tlId;
    }
}