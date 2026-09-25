package com.smartbus.controller;

import com.smartbus.dto.ApiResponse;
import com.smartbus.enums.TripStatus;
import com.smartbus.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final BusRepository busRepository;
    private final DriverRepository driverRepository;
    private final RouteRepository routeRepository;
    private final StopRepository stopRepository;
    private final StudentRepository studentRepository;
    private final TripRepository tripRepository;

    public AdminController(BusRepository busRepository, DriverRepository driverRepository,
                           RouteRepository routeRepository, StopRepository stopRepository,
                           StudentRepository studentRepository, TripRepository tripRepository) {
        this.busRepository = busRepository;
        this.driverRepository = driverRepository;
        this.routeRepository = routeRepository;
        this.stopRepository = stopRepository;
        this.studentRepository = studentRepository;
        this.tripRepository = tripRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBuses", busRepository.count());
        stats.put("totalDrivers", driverRepository.count());
        stats.put("totalRoutes", routeRepository.count());
        stats.put("totalStops", stopRepository.count());
        stats.put("totalStudents", studentRepository.count());
        stats.put("activeTrips", tripRepository.findByStatus(TripStatus.IN_PROGRESS).size());
        stats.put("totalTrips", tripRepository.count());

        return ResponseEntity.ok(ApiResponse.ok("Admin stats retrieved", stats));
    }
}
