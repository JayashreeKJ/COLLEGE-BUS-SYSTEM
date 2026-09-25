package com.smartbus.controller;

import com.smartbus.dto.ApiResponse;
import com.smartbus.dto.BusDTO;
import com.smartbus.service.BusService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
public class BusController {

    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BusDTO>>> getAllBuses() {
        return ResponseEntity.ok(ApiResponse.ok("Buses retrieved successfully", busService.getAllBuses()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BusDTO>> getBusById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Bus retrieved successfully", busService.getBusById(id)));
    }
}
