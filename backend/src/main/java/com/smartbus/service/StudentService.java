package com.smartbus.service;

import com.smartbus.dto.RouteDTO;
import com.smartbus.dto.ScheduleDTO;
import com.smartbus.dto.StudentDTO;
import com.smartbus.dto.TripDTO;
import com.smartbus.entity.*;
import com.smartbus.enums.TripStatus;
import com.smartbus.exception.ResourceNotFoundException;
import com.smartbus.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final StopRepository stopRepository;
    private final RouteStopRepository routeStopRepository;
    private final ScheduleRepository scheduleRepository;
    private final TripRepository tripRepository;
    private final RouteService routeService;
    private final TripService tripService;

    public StudentService(StudentRepository studentRepository, UserRepository userRepository,
                          StopRepository stopRepository,
                          RouteStopRepository routeStopRepository, ScheduleRepository scheduleRepository,
                          TripRepository tripRepository, RouteService routeService, TripService tripService) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.stopRepository = stopRepository;
        this.routeStopRepository = routeStopRepository;
        this.scheduleRepository = scheduleRepository;
        this.tripRepository = tripRepository;
        this.routeService = routeService;
        this.tripService = tripService;
    }

    @Transactional(readOnly = true)
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::populateStudentDetails)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentDTO getStudentByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile", "userId", user.getId()));

        return populateStudentDetails(student);
    }

    @Transactional(readOnly = true)
    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        return populateStudentDetails(student);
    }

    @Transactional
    public StudentDTO updatePickupStop(String email, Long stopId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile", "userId", user.getId()));

        Stop stop = stopRepository.findById(stopId)
                .orElseThrow(() -> new ResourceNotFoundException("Stop", "id", stopId));

        student.setPickupStop(stop);
        Student updatedStudent = studentRepository.save(student);
        return populateStudentDetails(updatedStudent);
    }

    @Transactional
    public StudentDTO updateProfile(String email, com.smartbus.dto.UpdateStudentProfileRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile", "userId", user.getId()));

        if (req.getPhone() != null && !req.getPhone().trim().isEmpty()) {
            user.setPhone(req.getPhone().trim());
            userRepository.save(user);
        }

        if (req.getEmergencyContact() != null) {
            student.setEmergencyContact(req.getEmergencyContact().trim());
        }

        if (req.getBranch() != null && !req.getBranch().trim().isEmpty()) {
            student.setBranch(req.getBranch().trim());
        }

        if (req.getYearOfStudy() != null) {
            student.setYearOfStudy(req.getYearOfStudy());
        }

        Student updatedStudent = studentRepository.save(student);
        return populateStudentDetails(updatedStudent);
    }

    private StudentDTO populateStudentDetails(Student student) {
        StudentDTO dto = StudentDTO.fromEntity(student);

        // Find the route associated with the student's pickup stop
        if (student.getPickupStop() != null) {
            List<RouteStop> routeStops = routeStopRepository.findByStopId(student.getPickupStop().getId());
            if (!routeStops.isEmpty()) {
                Route route = routeStops.get(0).getRoute();
                RouteDTO routeDTO = routeService.populateRouteStops(route);
                dto.setAssignedRoute(routeDTO);

                // Find active schedule for this route
                List<Schedule> schedules = scheduleRepository.findByRouteId(route.getId());
                if (!schedules.isEmpty()) {
                    dto.setAssignedSchedule(ScheduleDTO.fromEntity(schedules.get(0)));
                }

                // Find active trip for this route
                List<Trip> activeTrips = tripRepository.findByRouteIdAndStatus(route.getId(), TripStatus.IN_PROGRESS);
                if (!activeTrips.isEmpty()) {
                    dto.setActiveTrip(tripService.populateTripWithLocation(activeTrips.get(0)));
                } else {
                    List<Trip> scheduledTrips = tripRepository.findByRouteIdAndStatus(route.getId(), TripStatus.SCHEDULED);
                    if (!scheduledTrips.isEmpty()) {
                        dto.setActiveTrip(tripService.populateTripWithLocation(scheduledTrips.get(0)));
                    }
                }
            }
        }
        return dto;
    }
}
