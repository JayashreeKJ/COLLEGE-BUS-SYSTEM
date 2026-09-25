package com.smartbus.config;

import com.smartbus.entity.*;
import com.smartbus.enums.*;
import com.smartbus.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final DriverRepository driverRepository;
    private final BusRepository busRepository;
    private final RouteRepository routeRepository;
    private final StopRepository stopRepository;
    private final RouteStopRepository routeStopRepository;
    private final ScheduleRepository scheduleRepository;
    private final TripRepository tripRepository;
    private final TripLocationRepository tripLocationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, StudentRepository studentRepository,
                           DriverRepository driverRepository, BusRepository busRepository,
                           RouteRepository routeRepository, StopRepository stopRepository,
                           RouteStopRepository routeStopRepository, ScheduleRepository scheduleRepository,
                           TripRepository tripRepository, TripLocationRepository tripLocationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.driverRepository = driverRepository;
        this.busRepository = busRepository;
        this.routeRepository = routeRepository;
        this.stopRepository = stopRepository;
        this.routeStopRepository = routeStopRepository;
        this.scheduleRepository = scheduleRepository;
        this.tripRepository = tripRepository;
        this.tripLocationRepository = tripLocationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Database already seeded with demo data. Skipping initialization.");
            return;
        }

        logger.info("Seeding initial demo data for SmartBus System...");

        String defaultPass = passwordEncoder.encode("password123");

        // 1. Create Users
        User adminUser = userRepository.save(new User("Campus Admin", "admin@college.edu", defaultPass, Role.ROLE_ADMIN, "+91 98765 43210", UserStatus.ACTIVE));
        User driverUser1 = userRepository.save(new User("Ramesh Kumar", "driver@college.edu", defaultPass, Role.ROLE_DRIVER, "+91 98765 00001", UserStatus.ACTIVE));
        User driverUser2 = userRepository.save(new User("Suresh Babu", "driver2@college.edu", defaultPass, Role.ROLE_DRIVER, "+91 98765 00002", UserStatus.ACTIVE));
        User studentUser1 = userRepository.save(new User("Jayashree K", "student@college.edu", defaultPass, Role.ROLE_STUDENT, "+91 98765 11111", UserStatus.ACTIVE));
        User studentUser2 = userRepository.save(new User("Rahul Verma", "student2@college.edu", defaultPass, Role.ROLE_STUDENT, "+91 98765 22222", UserStatus.ACTIVE));

        // 2. Create Stops
        Stop stop1 = stopRepository.save(new Stop("Central Railway Station", "Platform 1 Exit Gate", new BigDecimal("12.97840000"), new BigDecimal("77.56960000")));
        Stop stop2 = stopRepository.save(new Stop("MG Road Metro Station", "Near Trinity Circle Pillar 42", new BigDecimal("12.97560000"), new BigDecimal("77.60940000")));
        Stop stop3 = stopRepository.save(new Stop("Indiranagar 100ft Junction", "Opposite BDA Complex", new BigDecimal("12.97190000"), new BigDecimal("77.64120000")));
        Stop stop4 = stopRepository.save(new Stop("Marathahalli Bridge", "Under the Main Flyover", new BigDecimal("12.95690000"), new BigDecimal("77.70110000")));
        Stop stop5 = stopRepository.save(new Stop("College Main Campus", "Admin Block Gate 1", new BigDecimal("12.93450000"), new BigDecimal("77.61010000")));

        // 3. Create Buses
        Bus bus1 = busRepository.save(new Bus("BUS-101", "KA-01-EQ-1001", 45, "Tata Starbus Ultra", BusStatus.ACTIVE));
        Bus bus2 = busRepository.save(new Bus("BUS-102", "KA-01-EQ-1002", 50, "Ashok Leyland Lynx", BusStatus.ACTIVE));
        Bus bus3 = busRepository.save(new Bus("BUS-103", "KA-01-EQ-1003", 40, "Eicher Skyline Pro", BusStatus.ACTIVE));

        // 4. Create Drivers
        Driver driver1 = driverRepository.save(new Driver(driverUser1, "DL-KA01-2015-00458", LocalDate.of(2030, 12, 31), "+91 94444 12345", 8, DriverStatus.ON_TRIP));
        Driver driver2 = driverRepository.save(new Driver(driverUser2, "DL-KA01-2018-00982", LocalDate.of(2029, 6, 30), "+91 94444 67890", 5, DriverStatus.AVAILABLE));

        // 5. Create Students
        Student student1 = studentRepository.save(new Student(studentUser1, "1MS21CS045", "Computer Science & Engineering", 3, stop2, "+91 98450 12345"));
        Student student2 = studentRepository.save(new Student(studentUser2, "1MS21EC082", "Electronics & Communication", 2, stop3, "+91 98450 67890"));

        // 6. Create Routes
        Route route1 = routeRepository.save(new Route("North Corridor Express", "R-101", "Central Railway Station", "College Main Campus", new BigDecimal("18.50"), RouteStatus.ACTIVE));
        Route route2 = routeRepository.save(new Route("East Campus Shuttle", "R-102", "MG Road Metro Station", "College Main Campus", new BigDecimal("14.20"), RouteStatus.ACTIVE));

        // 7. Create Route Stops
        routeStopRepository.save(new RouteStop(route1, stop1, 1, 0, new BigDecimal("0.00")));
        routeStopRepository.save(new RouteStop(route1, stop2, 2, 15, new BigDecimal("4.50")));
        routeStopRepository.save(new RouteStop(route1, stop3, 3, 30, new BigDecimal("4.20")));
        routeStopRepository.save(new RouteStop(route1, stop5, 4, 50, new BigDecimal("9.80")));

        routeStopRepository.save(new RouteStop(route2, stop2, 1, 0, new BigDecimal("0.00")));
        routeStopRepository.save(new RouteStop(route2, stop4, 2, 25, new BigDecimal("8.30")));
        routeStopRepository.save(new RouteStop(route2, stop5, 3, 45, new BigDecimal("5.90")));

        // 8. Create Schedules
        Schedule schedule1 = scheduleRepository.save(new Schedule(route1, bus1, driver1, LocalTime.of(7, 30), LocalTime.of(8, 30), "MON-FRI", ScheduleStatus.ACTIVE));
        Schedule schedule2 = scheduleRepository.save(new Schedule(route2, bus2, driver2, LocalTime.of(7, 45), LocalTime.of(8, 35), "MON-FRI", ScheduleStatus.ACTIVE));

        // 9. Create Trips
        Trip activeTrip = new Trip(schedule1, bus1, driver1, route1, LocalDate.now(), TripStatus.IN_PROGRESS, "Morning regular pickup service");
        activeTrip.setStartTime(LocalDateTime.now().minusMinutes(22));
        activeTrip = tripRepository.save(activeTrip);

        Trip scheduledTrip2 = new Trip(schedule2, bus2, driver2, route2, LocalDate.now(), TripStatus.SCHEDULED, "Morning east sector route");
        tripRepository.save(scheduledTrip2);

        // 10. Create Initial GPS Location Telemetry for Active Trip
        tripLocationRepository.save(new TripLocation(
                activeTrip,
                new BigDecimal("12.97350000"),
                new BigDecimal("77.62500000"),
                new BigDecimal("5.00"),
                new BigDecimal("34.50"),
                new BigDecimal("115.00"),
                LocalDateTime.now().minusSeconds(10)
        ));

        logger.info("Demo data seeding successfully completed! Demo logins ready: admin@college.edu, driver@college.edu, student@college.edu (password: password123)");
    }
}
