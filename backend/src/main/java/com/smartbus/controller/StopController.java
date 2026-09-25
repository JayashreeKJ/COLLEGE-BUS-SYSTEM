package com.smartbus.controller;

import com.smartbus.dto.ApiResponse;
import com.smartbus.dto.StopDTO;
import com.smartbus.repository.StopRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stops")
public class StopController {

    private final StopRepository stopRepository;

    public StopController(StopRepository stopRepository) {
        this.stopRepository = stopRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StopDTO>>> getAllStops() {
        List<StopDTO> stops = stopRepository.findAll().stream()
                .map(StopDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok("Stops retrieved successfully", stops));
    }
}
