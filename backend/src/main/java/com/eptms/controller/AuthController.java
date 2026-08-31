package com.eptms.controller;

import com.eptms.config.JwtService;
import com.eptms.dto.AuthDTOs.AuthResponse;
import com.eptms.dto.AuthDTOs.LoginRequest;
import com.eptms.model.User;
import com.eptms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @PostMapping("/login")
    @Transactional(readOnly = true)
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("User not found"));

            String jwtToken = jwtService.generateToken(user);

            AuthResponse res = new AuthResponse();
            res.setToken(jwtToken);
            res.setId(user.getId());
            res.setFullName(user.getFullName());
            res.setEmail(user.getEmail());
            res.setRole(user.getRole());

            String teamName = "Core Operations";
            if (user.getTeam() != null) {
                try {
                    teamName = user.getTeam().getName();
                } catch (Exception e) {
                    log.warn("Could not read team name: {}", e.getMessage());
                }
            }
            res.setTeamName(teamName);

            res.setCasualLeave(user.getCasualLeaveBalance());
            res.setSickLeave(user.getSickLeaveBalance());
            res.setEarnedLeave(user.getEarnedLeaveBalance());

            return ResponseEntity.ok(res);
        } catch (AuthenticationException ex) {
            log.warn("Login failed for {}: {}", request.getEmail(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        } catch (Exception ex) {
            log.error("Internal server error during login for {}: ", request.getEmail(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Internal server error: " + ex.getMessage()));
        }
    }
}