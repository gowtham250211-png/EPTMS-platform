package com.eptms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String performedBy;
    private String action;
    private String entityTarget;
    private String details;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}