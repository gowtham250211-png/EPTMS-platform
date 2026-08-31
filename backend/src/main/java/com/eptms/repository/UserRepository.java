package com.eptms.repository;

import com.eptms.model.Role;
import com.eptms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByTeamLeaderId(Long tlId);
    List<User> findByManagerId(Long managerId);
    long countByRole(Role role);
}