package com.smartbus.controller;

import com.smartbus.dto.HealthResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Value("${spring.application.name:SmartBus-Backend}")
    private String appName;

    @GetMapping
    public ResponseEntity<HealthResponse> getHealthStatus() {
        HealthResponse response = new HealthResponse(
            "UP",
            "SmartBus Backend API is running successfully",
            "1.0.0-SNAPSHOT",
            "development"
        );
        return ResponseEntity.ok(response);
    }
}
