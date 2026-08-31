package com.eptms.controller;

import com.eptms.model.User;
import com.eptms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/performance")
@RequiredArgsConstructor
public class PerformanceController {

    private final UserRepository userRepository;

    @GetMapping("/leaderboard")
    public ResponseEntity<List<User>> getLeaderboard() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .sorted((a, b) -> Integer.compare(b.getXpPoints(), a.getXpPoints()))
                .limit(10)
                .toList());
    }
}