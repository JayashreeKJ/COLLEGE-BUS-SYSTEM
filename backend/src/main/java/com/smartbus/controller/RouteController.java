package com.smartbus.controller;

import com.smartbus.dto.ApiResponse;
import com.smartbus.dto.RouteDTO;
import com.smartbus.service.RouteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RouteDTO>>> getAllRoutes() {
        return ResponseEntity.ok(ApiResponse.ok("Routes retrieved successfully", routeService.getAllRoutes()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RouteDTO>> getRouteById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Route retrieved successfully", routeService.getRouteById(id)));
    }
}
