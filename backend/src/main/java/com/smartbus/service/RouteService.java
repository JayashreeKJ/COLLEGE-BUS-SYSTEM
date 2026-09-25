package com.smartbus.service;

import com.smartbus.dto.RouteDTO;
import com.smartbus.dto.RouteStopDTO;
import com.smartbus.entity.Route;
import com.smartbus.exception.ResourceNotFoundException;
import com.smartbus.repository.RouteRepository;
import com.smartbus.repository.RouteStopRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RouteService {

    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;

    public RouteService(RouteRepository routeRepository, RouteStopRepository routeStopRepository) {
        this.routeRepository = routeRepository;
        this.routeStopRepository = routeStopRepository;
    }

    @Transactional(readOnly = true)
    public List<RouteDTO> getAllRoutes() {
        return routeRepository.findAll().stream()
                .map(this::populateRouteStops)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RouteDTO getRouteById(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route", "id", id));
        return populateRouteStops(route);
    }

    public RouteDTO populateRouteStops(Route route) {
        RouteDTO dto = RouteDTO.fromEntity(route);
        if (route != null && route.getId() != null) {
            List<RouteStopDTO> stops = routeStopRepository.findByRouteIdOrderByStopSequenceAsc(route.getId())
                    .stream()
                    .map(RouteStopDTO::fromEntity)
                    .collect(Collectors.toList());
            dto.setStops(stops);
        }
        return dto;
    }
}
