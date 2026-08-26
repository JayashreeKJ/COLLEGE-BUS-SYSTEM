-- ===================================================================
-- SmartBus: College Bus Management & Tracking System
-- MySQL 8.x Database Schema Definition
-- ===================================================================

CREATE DATABASE IF NOT EXISTS smartbus_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smartbus_db;

-- 1. Users Table (Core Authentication & System Accounts)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Stops Table (Physical Geolocation Bus Stops)
CREATE TABLE IF NOT EXISTS stops (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stop_name VARCHAR(100) NOT NULL,
    landmark VARCHAR(150),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Students Table (Academic Profile Extensions)
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    branch VARCHAR(100),
    year_of_study INT,
    pickup_stop_id BIGINT,
    emergency_contact VARCHAR(20),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_student_stop FOREIGN KEY (pickup_stop_id) REFERENCES stops (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 4. Drivers Table (Driver Profile & Licensing)
CREATE TABLE IF NOT EXISTS drivers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    license_expiry DATE,
    emergency_contact VARCHAR(20),
    experience_years INT,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_driver_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 5. Buses Table (Fleet Vehicles)
CREATE TABLE IF NOT EXISTS buses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(30) NOT NULL UNIQUE,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    capacity INT NOT NULL,
    model VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. Routes Table (Transit Corridors)
CREATE TABLE IF NOT EXISTS routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_name VARCHAR(100) NOT NULL,
    route_code VARCHAR(30) NOT NULL UNIQUE,
    start_point VARCHAR(100) NOT NULL,
    end_point VARCHAR(100) NOT NULL,
    total_distance_km DECIMAL(6, 2),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 7. Route Stops Table (Ordered Sequence Junction)
CREATE TABLE IF NOT EXISTS route_stops (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT NOT NULL,
    stop_id BIGINT NOT NULL,
    stop_sequence INT NOT NULL,
    estimated_arrival_offset_minutes INT,
    distance_from_prev_stop_km DECIMAL(5, 2),
    CONSTRAINT uk_route_sequence UNIQUE (route_id, stop_sequence),
    CONSTRAINT uk_route_stop UNIQUE (route_id, stop_id),
    CONSTRAINT fk_rs_route FOREIGN KEY (route_id) REFERENCES routes (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rs_stop FOREIGN KEY (stop_id) REFERENCES stops (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 8. Schedules Table (Recurring Timetable Templates)
CREATE TABLE IF NOT EXISTS schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT NOT NULL,
    bus_id BIGINT NOT NULL,
    driver_id BIGINT NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME,
    operating_days VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sched_route FOREIGN KEY (route_id) REFERENCES routes (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_sched_bus FOREIGN KEY (bus_id) REFERENCES buses (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_sched_driver FOREIGN KEY (driver_id) REFERENCES drivers (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 9. Trips Table (Daily Journey Instances)
CREATE TABLE IF NOT EXISTS trips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    schedule_id BIGINT,
    bus_id BIGINT NOT NULL,
    driver_id BIGINT NOT NULL,
    route_id BIGINT NOT NULL,
    trip_date DATE NOT NULL,
    start_time DATETIME,
    end_time DATETIME,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_trip_schedule FOREIGN KEY (schedule_id) REFERENCES schedules (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_trip_bus FOREIGN KEY (bus_id) REFERENCES buses (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_trip_driver FOREIGN KEY (driver_id) REFERENCES drivers (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_trip_route FOREIGN KEY (route_id) REFERENCES routes (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_trip_status_date (status, trip_date)
) ENGINE=InnoDB;

-- 10. Trip Locations Table (Real-Time GPS Telemetry Breadcrumbs)
CREATE TABLE IF NOT EXISTS trip_locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(6, 2),
    speed DECIMAL(6, 2),
    heading DECIMAL(5, 2),
    recorded_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tl_trip FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_trip_latest (trip_id, recorded_at DESC)
) ENGINE=InnoDB;
