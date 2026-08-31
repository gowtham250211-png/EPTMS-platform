package com.eptms.dto;

import com.eptms.model.Role;
import lombok.Data;

public class AuthDTOs {
    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private Long id;
        private String fullName;
        private String email;
        private Role role;
        private String teamName;
        private int casualLeave;
        private int sickLeave;
        private int earnedLeave;
    }
}