package com.smartbus.repository;

import com.smartbus.entity.Stop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StopRepository extends JpaRepository<Stop, Long> {
    List<Stop> findByStopNameContainingIgnoreCase(String stopName);
}
