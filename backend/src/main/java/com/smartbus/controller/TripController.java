package com.smartbus.controller;

import com.smartbus.dto.ApiResponse;
import com.smartbus.dto.LocationUpdateRequest;
import com.smartbus.dto.TripDTO;
import com.smartbus.dto.TripLocationDTO;
import com.smartbus.service.TripService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TripDTO>>> getAllTrips() {
        return ResponseEntity.ok(ApiResponse.ok("Trips retrieved successfully", tripService.getAllTrips()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<TripDTO>>> getActiveTrips() {
        return ResponseEntity.ok(ApiResponse.ok("Active trips retrieved successfully", tripService.getActiveTrips()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TripDTO>> getTripById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Trip retrieved successfully", tripService.getTripById(id)));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<ApiResponse<List<TripDTO>>> getTripsByDriver(@PathVariable Long driverId) {
        return ResponseEntity.ok(ApiResponse.ok("Driver trips retrieved successfully", tripService.getTripsByDriver(driverId)));
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<ApiResponse<TripDTO>> startTrip(@PathVariable Long id) {
        TripDTO trip = tripService.startTrip(id);
        return ResponseEntity.ok(ApiResponse.ok("Trip started successfully", trip));
    }

    @PostMapping("/{id}/end")
    public ResponseEntity<ApiResponse<TripDTO>> endTrip(@PathVariable Long id) {
        TripDTO trip = tripService.endTrip(id);
        return ResponseEntity.ok(ApiResponse.ok("Trip ended successfully", trip));
    }

    @PostMapping("/{id}/location")
    public ResponseEntity<ApiResponse<TripLocationDTO>> updateLocation(
            @PathVariable Long id,
            @Valid @RequestBody LocationUpdateRequest locationRequest) {
        TripLocationDTO location = tripService.recordLocation(id, locationRequest);
        return ResponseEntity.ok(ApiResponse.ok("Location updated successfully", location));
    }

    @GetMapping("/{id}/location/latest")
    public ResponseEntity<ApiResponse<TripLocationDTO>> getLatestLocation(@PathVariable Long id) {
        TripLocationDTO location = tripService.getLatestLocation(id);
        return ResponseEntity.ok(ApiResponse.ok("Latest location retrieved", location));
    }

    @GetMapping("/{id}/location/history")
    public ResponseEntity<ApiResponse<List<TripLocationDTO>>> getLocationHistory(@PathVariable Long id) {
        List<TripLocationDTO> history = tripService.getLocationHistory(id);
        return ResponseEntity.ok(ApiResponse.ok("Location history retrieved", history));
    }
}
