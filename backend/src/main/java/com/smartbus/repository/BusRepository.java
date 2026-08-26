package com.smartbus.repository;

import com.smartbus.entity.Bus;
import com.smartbus.enums.BusStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    Optional<Bus> findByBusNumber(String busNumber);
    Optional<Bus> findByRegistrationNumber(String registrationNumber);
    List<Bus> findByStatus(BusStatus status);
}
