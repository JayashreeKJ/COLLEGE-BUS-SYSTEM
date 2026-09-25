package com.smartbus.controller;

import com.smartbus.dto.ApiResponse;
import com.smartbus.dto.ScheduleDTO;
import com.smartbus.repository.ScheduleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleRepository scheduleRepository;

    public ScheduleController(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ScheduleDTO>>> getAllSchedules() {
        List<ScheduleDTO> schedules = scheduleRepository.findAll().stream()
                .map(ScheduleDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok("Schedules retrieved successfully", schedules));
    }
}
