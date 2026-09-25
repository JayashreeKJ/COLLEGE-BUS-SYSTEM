package com.smartbus.service;

import com.smartbus.dto.BusDTO;
import com.smartbus.dto.DriverDTO;
import com.smartbus.dto.RouteDTO;
import com.smartbus.dto.ScheduleDTO;
import com.smartbus.entity.Driver;
import com.smartbus.entity.Schedule;
import com.smartbus.entity.User;
import com.smartbus.exception.ResourceNotFoundException;
import com.smartbus.repository.DriverRepository;
import com.smartbus.repository.ScheduleRepository;
import com.smartbus.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DriverService {

    private final DriverRepository driverRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;
    private final RouteService routeService;
    private final TripService tripService;

    public DriverService(DriverRepository driverRepository, UserRepository userRepository,
                         ScheduleRepository scheduleRepository, RouteService routeService, TripService tripService) {
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
        this.scheduleRepository = scheduleRepository;
        this.routeService = routeService;
        this.tripService = tripService;
    }

    @Transactional(readOnly = true)
    public List<DriverDTO> getAllDrivers() {
        return driverRepository.findAll().stream()
                .map(this::populateDriverDetails)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DriverDTO getDriverByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Driver driver = driverRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile", "userId", user.getId()));

        return populateDriverDetails(driver);
    }

    @Transactional(readOnly = true)
    public DriverDTO getDriverById(Long id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver", "id", id));
        return populateDriverDetails(driver);
    }

    private DriverDTO populateDriverDetails(Driver driver) {
        DriverDTO dto = DriverDTO.fromEntity(driver);

        // Find schedule assigned to driver
        List<Schedule> schedules = scheduleRepository.findByDriverId(driver.getId());
        if (!schedules.isEmpty()) {
            Schedule schedule = schedules.get(0);
            dto.setAssignedSchedule(ScheduleDTO.fromEntity(schedule));
            if (schedule.getBus() != null) {
                dto.setAssignedBus(BusDTO.fromEntity(schedule.getBus()));
            }
            if (schedule.getRoute() != null) {
                RouteDTO routeDTO = routeService.populateRouteStops(schedule.getRoute());
                dto.setAssignedRoute(routeDTO);
            }
        }

        // Find current trip (in progress or scheduled)
        dto.setCurrentTrip(tripService.getActiveTripForDriver(driver.getId()));

        return dto;
    }
}
