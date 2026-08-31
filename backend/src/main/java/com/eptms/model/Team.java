package com.eptms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "teams")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    @JsonIgnoreProperties({"teams"})
    private Department department;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    @JsonIgnoreProperties({"manager", "teamLeader", "team", "authorities", "password"})
    private User manager;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tl_id")
    @JsonIgnoreProperties({"manager", "teamLeader", "team", "authorities", "password"})
    private User teamLeader;

    @JsonIgnore
    @OneToMany(mappedBy = "team")
    private List<User> members;
}