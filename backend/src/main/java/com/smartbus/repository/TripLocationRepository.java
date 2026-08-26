package com.smartbus.repository;

import com.smartbus.entity.TripLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripLocationRepository extends JpaRepository<TripLocation, Long> {
    
    // Efficient latest-coordinate lookup for a given active trip
    @Query("SELECT tl FROM TripLocation tl WHERE tl.trip.id = :tripId ORDER BY tl.recordedAt DESC LIMIT 1")
    Optional<TripLocation> findLatestByTripId(@Param("tripId") Long tripId);

    List<TripLocation> findByTripIdOrderByRecordedAtAsc(Long tripId);
}
