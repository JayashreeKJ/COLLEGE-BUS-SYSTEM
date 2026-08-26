# SmartBus – College Bus Management & Tracking System

## 1. Project Overview
**SmartBus** is a comprehensive college bus management and real-time tracking web application designed to streamline campus transportation. It facilitates seamless transit coordination between college administrators, bus drivers, and students.

---

## 2. Current Project Status
```text
Current Status:
Step 1 — Project Structure: COMPLETED
Step 2 — Architecture & Database Design: COMPLETED
Implementation: NOT STARTED
```

---

## 3. Confirmed Technology Stack
- **Frontend**:
  - React (Vite)
  - JavaScript (ES6+)
  - React Router
  - Vanilla CSS (Glassmorphism, CSS Variables, Modern Design)
- **Backend**:
  - Java (Spring Boot)
  - Spring Web (REST API)
  - Spring Data JPA / Hibernate
  - Spring Security & JWT (JSON Web Tokens)
  - BCrypt Password Hashing
- **Database**:
  - MySQL 8.x (Third Normal Form Normalized Schema)
- **Location & Mapping**:
  - **Device GPS / Geolocation API**: Source of live latitude/longitude coordinates from the driver's device.
  - **Google Maps Platform JavaScript API**: Visualization canvas for rendering interactive maps, live bus markers, stops, and route paths.

---

## 4. Key Architectural Distinction: GPS vs. Google Maps
```text
┌────────────────────────────────────────────────────────────────────────┐
│                        CORE ARCHITECTURAL RULE                         │
├───────────────────────────────────┬────────────────────────────────────┤
│       SOURCE OF COORDINATES       │         MAP VISUALIZATION          │
│        (Device GPS Sensor)        │       (Google Maps Platform)       │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Driver's smartphone / browser.  │ • JavaScript map rendering canvas. │
│ • Web Geolocation API.            │ • Displays live markers & routes.  │
│ • Raw latitude/longitude origin.  │ • Consumes coordinates for visual. │
└───────────────────────────────────┴────────────────────────────────────┘
```
> **Note**: Google Maps does **not** track the bus. The driver's device hardware captures real GPS coordinates, sends them to the Spring Boot REST backend, and the student/admin frontend displays them onto Google Maps.

---

## 5. System Architecture Summary
```text
                 SMARTBUS SYSTEM
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     Student         Driver         Admin
        │              │              │
        └──────────────┼──────────────┘
                       │
             React Frontend (Vite)
                       │
                 REST API Layer
                       │
            Spring Boot Backend (Java)
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     Security    Business Logic    Tracking
     (JWT/Auth) (Transit Domain)  (GPS Engine)
        │              │              │
        └──────────────┼──────────────┘
                       │
                Spring Data JPA
                       │
                 MySQL Database
```

---

## 6. User Roles & Capabilities
- **Student**:
  - Self-registration & JWT Login
  - View buses, schedules, routes, and stops
  - Track active buses live on Google Maps with real-time ETA
  - Manage student profile & preferred boarding stop
- **Driver**:
  - Secure Driver Login (provisioned by Admin)
  - View assigned bus, route, and schedule
  - Start & End trips
  - Stream continuous device GPS coordinates during active journeys
- **Admin**:
  - Manage buses, drivers, routes, stops, and schedules (CRUD)
  - Assign drivers and buses to specific transit routes
  - Live Fleet Monitoring Dashboard tracking all concurrent buses

---

## 7. Main Database Entities
1. **`users`**: Central credentials, roles (`STUDENT`, `DRIVER`, `ADMIN`), and contact information.
2. **`students`**: Student academic profile (`roll_number`, `branch`, `year`, `pickup_stop_id`).
3. **`drivers`**: Driver vocational details (`license_number`, `license_expiry`, `experience`).
4. **`buses`**: Physical vehicle fleet records (`bus_number`, `registration_number`, `capacity`).
5. **`routes`**: Travel corridors (`route_name`, `route_code`, `start_point`, `end_point`).
6. **`stops`**: Geographic stops with precise latitude/longitude landmarks.
7. **`route_stops`**: Junction table maintaining route-specific ordered stop sequences and time offsets.
8. **`schedules`**: Recurring timetable templates linking route, bus, driver, and departure times.
9. **`trips`**: Concrete daily journey instances with states: `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`.
10. **`trip_locations`**: High-frequency time-stamped GPS coordinate telemetry breadcrumbs.

---

## 8. Planned Implementation Roadmap
- **Phase 1: Project Setup & System Blueprinting** *(Completed)*
- **Phase 2: Database Schema & Seed Data Initialization**
- **Phase 3: Spring Boot Backend Development (Security, JWT, Domain APIs, GPS Ingestion)**
- **Phase 4: React Frontend Development (Auth, Dashboards, Google Maps Integration)**
- **Phase 5: Live GPS Simulation & Real-Time Tracking Integration**
- **Phase 6: Verification, Testing & College Presentation / Viva Preparation**

---

## 9. Documentation Index
Detailed technical blueprints are available in the [documentation/](file:///C:/COLLEGE-BUS-SYSTEM/documentation) directory:
- **System Architecture**: [system-architecture.md](file:///C:/COLLEGE-BUS-SYSTEM/documentation/architecture/system-architecture.md)
- **Application Flow & Sequence Diagrams**: [application-flow.md](file:///C:/COLLEGE-BUS-SYSTEM/documentation/architecture/application-flow.md)
- **Module Architecture**: [module-architecture.md](file:///C:/COLLEGE-BUS-SYSTEM/documentation/architecture/module-architecture.md)
- **Location Tracking Architecture**: [location-tracking-architecture.md](file:///C:/COLLEGE-BUS-SYSTEM/documentation/architecture/location-tracking-architecture.md)
- **Database Design & Rationale**: [database-design.md](file:///C:/COLLEGE-BUS-SYSTEM/documentation/database/database-design.md)
- **Entity Relationship (ER) Diagram**: [er-diagram.md](file:///C:/COLLEGE-BUS-SYSTEM/documentation/database/er-diagram.md)
- **Database Data Dictionary**: [data-dictionary.md](file:///C:/COLLEGE-BUS-SYSTEM/documentation/database/data-dictionary.md)
