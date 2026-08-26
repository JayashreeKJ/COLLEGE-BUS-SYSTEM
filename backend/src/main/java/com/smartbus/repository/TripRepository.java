package com.smartbus.repository;

import com.smartbus.entity.Trip;
import com.smartbus.enums.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByStatus(TripStatus status);
    List<Trip> findByTripDate(LocalDate tripDate);
    List<Trip> findByDriverIdAndStatus(Long driverId, TripStatus status);
    List<Trip> findByRouteIdAndStatus(Long routeId, TripStatus status);
}
