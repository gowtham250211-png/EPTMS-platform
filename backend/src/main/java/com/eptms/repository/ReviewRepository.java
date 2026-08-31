package com.eptms.repository;

import com.eptms.model.PerformanceReview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<PerformanceReview, Long> {}