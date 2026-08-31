package com.eptms.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "performance_reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PerformanceReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    @JsonIgnoreProperties({"manager", "teamLeader", "team", "authorities", "password"})
    private User employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id")
    @JsonIgnoreProperties({"manager", "teamLeader", "team", "authorities", "password"})
    private User reviewer;

    private String reviewPeriod;
    private double taskCompletionScore;
    private double qualityScore;
    private double attendanceScore;
    private double deadlineScore;
    private double teamworkScore;
    private double overallScore;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Builder.Default
    private LocalDate reviewDate = LocalDate.now();
}