package com.smartbus.controller;

import com.smartbus.dto.ApiResponse;
import com.smartbus.dto.DriverDTO;
import com.smartbus.service.DriverService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DriverDTO>>> getAllDrivers() {
        return ResponseEntity.ok(ApiResponse.ok("Drivers retrieved successfully", driverService.getAllDrivers()));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<DriverDTO>> getMyDriverProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        DriverDTO driver = driverService.getDriverByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Driver profile retrieved", driver));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DriverDTO>> getDriverById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Driver retrieved successfully", driverService.getDriverById(id)));
    }
}
