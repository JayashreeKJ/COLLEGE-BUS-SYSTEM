package com.smartbus.service;

import com.smartbus.dto.LocationUpdateRequest;
import com.smartbus.dto.TripDTO;
import com.smartbus.dto.TripLocationDTO;
import com.smartbus.entity.Driver;
import com.smartbus.entity.Trip;
import com.smartbus.entity.TripLocation;
import com.smartbus.enums.DriverStatus;
import com.smartbus.enums.TripStatus;
import com.smartbus.exception.ResourceNotFoundException;
import com.smartbus.repository.DriverRepository;
import com.smartbus.repository.TripLocationRepository;
import com.smartbus.repository.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final TripLocationRepository tripLocationRepository;
    private final DriverRepository driverRepository;

    public TripService(TripRepository tripRepository, TripLocationRepository tripLocationRepository, DriverRepository driverRepository) {
        this.tripRepository = tripRepository;
        this.tripLocationRepository = tripLocationRepository;
        this.driverRepository = driverRepository;
    }

    @Transactional(readOnly = true)
    public List<TripDTO> getAllTrips() {
        return tripRepository.findAll().stream()
                .map(this::populateTripWithLocation)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TripDTO> getActiveTrips() {
        return tripRepository.findByStatus(TripStatus.IN_PROGRESS).stream()
                .map(this::populateTripWithLocation)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TripDTO getTripById(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", id));
        return populateTripWithLocation(trip);
    }

    @Transactional(readOnly = true)
    public List<TripDTO> getTripsByDriver(Long driverId) {
        return tripRepository.findAll().stream()
                .filter(t -> t.getDriver() != null && t.getDriver().getId().equals(driverId))
                .map(this::populateTripWithLocation)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TripDTO getActiveTripForDriver(Long driverId) {
        List<Trip> activeTrips = tripRepository.findByDriverIdAndStatus(driverId, TripStatus.IN_PROGRESS);
        if (!activeTrips.isEmpty()) {
            return populateTripWithLocation(activeTrips.get(0));
        }
        // If none in progress, check for scheduled today
        List<Trip> scheduledTrips = tripRepository.findByDriverIdAndStatus(driverId, TripStatus.SCHEDULED);
        if (!scheduledTrips.isEmpty()) {
            return populateTripWithLocation(scheduledTrips.get(0));
        }
        return null;
    }

    @Transactional
    public TripDTO startTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));
        
        trip.setStatus(TripStatus.IN_PROGRESS);
        trip.setStartTime(LocalDateTime.now());
        Trip savedTrip = tripRepository.save(trip);

        if (savedTrip.getDriver() != null) {
            Driver driver = savedTrip.getDriver();
            driver.setStatus(DriverStatus.ON_TRIP);
            driverRepository.save(driver);
        }

        return populateTripWithLocation(savedTrip);
    }

    @Transactional
    public TripDTO endTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        trip.setStatus(TripStatus.COMPLETED);
        trip.setEndTime(LocalDateTime.now());
        Trip savedTrip = tripRepository.save(trip);

        if (savedTrip.getDriver() != null) {
            Driver driver = savedTrip.getDriver();
            driver.setStatus(DriverStatus.AVAILABLE);
            driverRepository.save(driver);
        }

        return populateTripWithLocation(savedTrip);
    }

    @Transactional
    public TripLocationDTO recordLocation(Long tripId, LocationUpdateRequest req) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        TripLocation location = new TripLocation(
                trip,
                req.getLatitude(),
                req.getLongitude(),
                req.getAccuracy(),
                req.getSpeed(),
                req.getHeading(),
                LocalDateTime.now()
        );

        TripLocation savedLocation = tripLocationRepository.save(location);
        return TripLocationDTO.fromEntity(savedLocation);
    }

    @Transactional(readOnly = true)
    public TripLocationDTO getLatestLocation(Long tripId) {
        return tripLocationRepository.findLatestByTripId(tripId)
                .map(TripLocationDTO::fromEntity)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<TripLocationDTO> getLocationHistory(Long tripId) {
        return tripLocationRepository.findByTripIdOrderByRecordedAtAsc(tripId).stream()
                .map(TripLocationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public TripDTO populateTripWithLocation(Trip trip) {
        TripDTO dto = TripDTO.fromEntity(trip);
        if (trip != null && trip.getId() != null) {
            tripLocationRepository.findLatestByTripId(trip.getId())
                    .ifPresent(tl -> dto.setLatestLocation(TripLocationDTO.fromEntity(tl)));
        }
        return dto;
    }
}
