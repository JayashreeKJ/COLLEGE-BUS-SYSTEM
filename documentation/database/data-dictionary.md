# SmartBus — Database Data Dictionary

This document provides a comprehensive specification of all tables, fields, data types, constraints, and keys in the SmartBus MySQL database.

---

## 1. Table: `users`
**Purpose**: Central user identity, authentication, and core account credentials.

| Table | Column | Data Type | Key | Nullable | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `users` | `id` | `BIGINT AUTO_INCREMENT` | `PK` | No | Unique identifier for user |
| `users` | `name` | `VARCHAR(100)` | - | No | Full legal/display name of the user |
| `users` | `email` | `VARCHAR(120)` | `UK` | No | Unique login email address |
| `users` | `password_hash` | `VARCHAR(255)` | - | No | BCrypt hashed password |
| `users` | `role` | `VARCHAR(20)` | - | No | User role (`STUDENT`, `DRIVER`, `ADMIN`) |
| `users` | `phone` | `VARCHAR(20)` | - | Yes | Contact telephone number |
| `users` | `status` | `VARCHAR(20)` | - | No | Account status (`ACTIVE`, `INACTIVE`, `SUSPENDED`) |
| `users` | `created_at` | `DATETIME` | - | No | Timestamp of account creation |
| `users` | `updated_at` | `DATETIME` | - | No | Timestamp of last profile update |

---

## 2. Table: `students`
**Purpose**: Profile details specific to registered student passengers.

| Table | Column | Data Type | Key | Nullable | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `students` | `id` | `BIGINT AUTO_INCREMENT` | `PK` | No | Unique identifier for student profile |
| `students` | `user_id` | `BIGINT` | `FK, UK` | No | References `users.id` (1:1 relationship) |
| `students` | `roll_number` | `VARCHAR(50)` | `UK` | No | College admission / roll number |
| `students` | `branch` | `VARCHAR(100)` | - | Yes | Academic department / branch (e.g., "CSE") |
| `students` | `year_of_study` | `INT` | - | Yes | Current year of study (1 to 4) |
| `students` | `pickup_stop_id` | `BIGINT` | `FK` | Yes | References `stops.id` (Default boarding stop) |
| `students` | `emergency_contact` | `VARCHAR(20)` | - | Yes | Guardian emergency phone number |
| `students` | `created_at` | `DATETIME` | - | No | Profile creation timestamp |
| `students` | `updated_at` | `DATETIME` | - | No | Profile update timestamp |

---

## 3. Table: `drivers`
**Purpose**: Profile details, licensing, and records for bus drivers.

| Table | Column | Data Type | Key | Nullable | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `drivers` | `id` | `BIGINT AUTO_INCREMENT` | `PK` | No | Unique identifier for driver profile |
| `drivers` | `user_id` | `BIGINT` | `FK, UK` | No | References `users.id` (1:1 relationship) |
| `drivers` | `license_number` | `VARCHAR(50)` | `UK` | No | Commercial driving license number |
| `drivers` | `license_expiry` | `DATE` | - | Yes | Expiration date of driving license |
| `drivers` | `emergency_contact` | `VARCHAR(20)` | - | Yes | Emergency contact phone number |
| `drivers` | `experience_years` | `INT` | - | Yes | Years of commercial driving experience |
| `drivers` | `status` | `VARCHAR(20)` | - | No | Duty status (`AVAILABLE`, `ON_TRIP`, `ON_LEAVE`) |
| `drivers` | `created_at` | `DATETIME` | - | No | Profile creation timestamp |
| `drivers` | `updated_at` | `DATETIME` | - | No | Profile update timestamp |

---

## 4. Table: `buses`
**Purpose**: Physical vehicle inventory within the college transit fleet.

| Table | Column | Data Type | Key | Nullable | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `buses` | `id` | `BIGINT AUTO_INCREMENT` | `PK` | No | Unique identifier for the bus |
| `buses` | `bus_number` | `VARCHAR(30)` | `UK` | No | Internal display number (e.g., "Bus-04") |
| `buses` | `registration_number` | `VARCHAR(50)` | `UK` | No | State RTO registration plate number |
| `buses` | `capacity` | `INT` | - | No | Total passenger seating capacity |
| `buses` | `model` | `VARCHAR(100)` | - | Yes | Bus manufacturer and model details |
| `buses` | `status` | `VARCHAR(20)` | - | No | Operational state (`ACTIVE`, `MAINTENANCE`, `INACTIVE`) |
| `buses` | `created_at` | `DATETIME` | - | No | Record creation timestamp |
| `buses` | `updated_at` | `DATETIME` | - | No | Record update timestamp |

---

## 5. Table: `routes`
**Purpose**: Transit routes and travel corridors connecting campus and town areas.

| Table | Column | Data Type | Key | Nullable | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `routes` | `id` | `BIGINT AUTO_INCREMENT` | `PK` | No | Unique identifier for route |
| `routes` | `route_name` | `VARCHAR(100)` | - | No | Descriptive name (e.g., "North Campus Express") |
| `routes` | `route_code` | `VARCHAR(30)` | `UK` | No | Unique short code (e.g., "R-01") |
| `routes` | `start_point` | `VARCHAR(100)` | - | No | Starting origin location/landmark |
| `routes` | `end_point` | `VARCHAR(100)` | - | No | Final destination location/campus gate |
| `routes` | `total_distance_km` | `DECIMAL(6,2)` | - | Yes | Total route distance in kilometers |
| `routes` | `status` | `VARCHAR(20)` | - | No | Operational status (`ACTIVE`, `INACTIVE`) |
| `routes` | `created_at` | `DATETIME` | - | No | Record creation timestamp |
| `routes` | `updated_at` | `DATETIME` | - | No | Record update timestamp |

---

## 6. Table: `stops`
**Purpose**: Master list of physical geographic bus stops and boarding points.

| Table | Column | Data Type | Key | Nullable | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `stops` | `id` | `BIGINT AUTO_INCREMENT` | `PK` | No | Unique identifier for stop |
| `stops` | `stop_name` | `VARCHAR(100)` | - | No | Public name of the stop (e.g., "Central Station") |
| `stops` | `landmark` | `VARCHAR(150)` | - | Yes | Prominent nearby physical landmark |
| `stops` | `latitude` | `DECIMAL(10,8)` | - | No | WGS-84 Latitude coordinate |
| `stops` | `longitude` | `DECIMAL(11,8)` | - | No | WGS-84 Longitude coordinate |
| `stops` | `created_at` | `DATETIME` | - | No | Record creation timestamp |
| `stops` | `updated_at` | `DATETIME` | - | No | Record update timestamp |

---

## 7. Table: `route_stops`
**Purpose**: Junction mapping associating stops to routes in sequential transit order.

| Table | Column | Data Type | Key | Nullable | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `route_stops` | `id` | `BIGINT AUTO_INCREMENT` | `PK` | No | Unique identifier for route stop entry |
| `route_stops` | `route_id` | `BIGINT` | `FK` | No | References `routes.id` |
| `route_stops` | `stop_id` | `BIGINT` | `FK` | No | References `stops.id` |
| `route_stops` | `stop_sequence` | `INT` | - | No | 1-based order of stop along the route |
| `route_stops` | `estimated_arrival_offset_minutes` | `INT` | - | Yes | Minutes elapsed from route start time |
| `route_stops` | `distance_from_prev_stop_km` | `DECIMAL(5,2)` | - | Yes | Segment distance from preceding stop |

> **Constraint**: Unique composite key on `(route_id, stop_sequence)` and `(route_id, stop_id)`.

---

## 8. Table: `schedules`
**Purpose**: Timetable templates defining recurring bus runs.

| Table | Column | Data Type | Key | Nullable | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `schedules` | `id` | `BIGINT AUTO_INCREMENT` | `PK` | No | Unique identifier for schedule |
| `schedules` | `route_id` | `BIGINT` | `FK` | No | References `routes.id` |
| `schedules` | `bus_id` | `BIGINT` | `FK` | No | References `buses.id` |
| `schedules` | `driver_id` | `BIGINT` | `FK` | No | References `drivers.id` |
| `schedules` | `departure_time` | `TIME` | - | No | Scheduled departure time (HH:MM:SS) |
| `schedules` | `arrival_time` | `TIME` | - | Yes | Scheduled arrival time at terminus |
| `schedules` | `operating_days` | `VARCHAR(50)` | - | No | Days of operation (e.g., "MON,TUE,WED,THU,FRI") |
| `schedules` | `status` | `VARCHAR(20)` | - | No | Schedule state (`ACTIVE`, `SUSPENDED`) |
| `schedules` | `created_at` | `DATETIME` | - | No | Record creation timestamp |
| `schedules` | `updated_at` | `DATETIME` | - | No | Record update timestamp |

---

## 9. Table: `trips`
**Purpose**: Concrete, real-time daily journey instances executed by a driver and bus.

| Table | Column | Data Type | Key | Nullable | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `trips` | `id` | `BIGINT AUTO_INCREMENT` | `PK` | No | Unique identifier for trip instance |
| `trips` | `schedule_id` | `BIGINT` | `FK` | Yes | References originating `schedules.id` |
| `trips` | `bus_id` | `BIGINT` | `FK` | No | References `buses.id` |
| `trips` | `driver_id` | `BIGINT` | `FK` | No | References `drivers.id` |
| `trips` | `route_id` | `BIGINT` | `FK` | No | References `routes.id` |
| `trips` | `trip_date` | `DATE` | - | No | Date of the trip (YYYY-MM-DD) |
| `trips` | `start_time` | `DATETIME` | - | Yes | Timestamp when driver tapped "Start Trip" |
| `trips` | `end_time` | `DATETIME` | - | Yes | Timestamp when driver tapped "End Trip" |
| `trips` | `status` | `VARCHAR(20)` | - | No | `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` |
| `trips` | `notes` | `TEXT` | - | Yes | Driver/admin operational notes or delay reasons |
| `trips` | `created_at` | `DATETIME` | - | No | Record creation timestamp |
| `trips` | `updated_at` | `DATETIME` | - | No | Record update timestamp |

---

## 10. Table: `trip_locations`
**Purpose**: High-frequency GPS telemetry breadcrumbs logged during active trips.

| Table | Column | Data Type | Key | Nullable | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `trip_locations` | `id` | `BIGINT AUTO_INCREMENT` | `PK` | No | Unique identifier for GPS telemetry record |
| `trip_locations` | `trip_id` | `BIGINT` | `FK` | No | References `trips.id` |
| `trip_locations` | `latitude` | `DECIMAL(10,8)` | - | No | WGS-84 Latitude coordinate (-90 to +90) |
| `trip_locations` | `longitude` | `DECIMAL(11,8)` | - | No | WGS-84 Longitude coordinate (-180 to +180) |
| `trip_locations` | `accuracy` | `DECIMAL(6,2)` | - | Yes | Device GPS accuracy radius in meters |
| `trip_locations` | `speed` | `DECIMAL(6,2)` | - | Yes | Vehicle speed in km/h (if reported by device) |
| `trip_locations` | `heading` | `DECIMAL(5,2)` | - | Yes | Compass bearing in degrees (0 to 360) |
| `trip_locations` | `recorded_at` | `DATETIME` | - | No | Timestamp of GPS fix on driver's device |
| `trip_locations` | `created_at` | `DATETIME` | - | No | Server timestamp of ingestion |

> **Critical Performance Index**: `INDEX idx_trip_latest (trip_id, recorded_at DESC)`.
