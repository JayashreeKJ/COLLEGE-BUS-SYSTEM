# SmartBus — Module Architecture

## 1. Modular System Decomposition

The SmartBus platform is structured into decoupled, domain-driven functional modules. Each module maintains clear boundaries between presentation, REST endpoints, business logic, and database persistence.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           SMARTBUS CORE ENGINE                          │
├───────────────────┬───────────────────┬─────────────────────────────────┤
│   USER & AUTH     │  FLEET & TRANSIT  │       TRIP & LIVE TRACKING      │
├───────────────────┼───────────────────┼─────────────────────────────────┤
│ • Authentication  │ • Bus Management  │ • Trip Lifecycle Management     │
│ • User Profiles   │ • Driver Profiles │ • Device GPS Telemetry Pipeline │
│ • RBAC & Security │ • Routes & Stops  │ • Live Location Ingestion       │
│                   │ • Timetables      │ • Google Maps Coordinate Stream │
└───────────────────┴───────────────────┴─────────────────────────────────┘
```

---

## 2. Module Breakdown & Responsibilities

### 2.1 User Authentication & Authorization Module
- **Purpose**: Manage secure access, token issuance, and role enforcement across the platform.
- **Key Responsibilities**:
  - Student self-registration and profile creation.
  - Secure credential validation using BCrypt password hashing.
  - Stateless JWT token generation containing user ID, username, and assigned role (`ROLE_STUDENT`, `ROLE_DRIVER`, `ROLE_ADMIN`).
  - Spring Security request interception to protect endpoints based on user authorities.

### 2.2 Profile Management Module (Separation Rationale)
- **Purpose**: Maintain user identity while accommodating role-specific attributes without schema pollution.
- **Design Pattern**: Core `User` table for authentication credentials + Extension tables (`Student`, `Driver`) for domain attributes.
- **Why Separate?**:
  - `User`: Contains credentials (`email`, `password_hash`, `role`, `status`) common to all system actors.
  - `Student`: Contains academic details (`roll_number`, `branch`, `year_of_study`, `pickup_stop_id`).
  - `Driver`: Contains licensing and vocational details (`license_number`, `license_expiry`, `emergency_contact`, `experience_years`).
  - **Benefits**: Enforces third normal form (3NF), eliminates nullable fields in the user table, and avoids tight coupling.

### 2.3 Bus & Fleet Management Module
- **Purpose**: Manage physical campus transit vehicles.
- **Key Responsibilities**:
  - Registration and tracking of buses (bus number, registration plate, seating capacity, operational status).
  - Status tracking (`ACTIVE`, `MAINTENANCE`, `DECOMMISSIONED`).
  - Associating default assigned drivers and tracking vehicle maintenance flags.
  - **Note**: Live coordinates are *never* stored directly in the `buses` table; real-time locations belong to the active trip lifecycle.

### 2.4 Route & Stop Management Module
- **Purpose**: Define transit corridors, physical boarding points, and stop sequences.
- **Key Responsibilities**:
  - **Physical Stops (`stops`)**: Storing geolocation points (`name`, `latitude`, `longitude`, `landmark`).
  - **Routes (`routes`)**: Defining high-level transit corridors (`route_name`, `route_code`, `source`, `destination`, `total_distance_km`).
  - **Ordered Route Stops (`route_stops`)**: Associating stops with routes along with explicit sequence order (`stop_sequence`), approximate travel times (`estimated_arrival_offset_minutes`), and intermediate distances.
  - Supports many-to-many relationships (e.g., "City Center" can be a stop on both Route 1 and Route 5 with different sequence numbers).

### 2.5 Schedule & Assignment Module
- **Purpose**: Define master timetables and operational assignments.
- **Key Responsibilities**:
  - Linking a **Bus**, a **Driver**, and a **Route** into a recurring timetable.
  - Specifying departure times, operating days (e.g., `MON,TUE,WED,THU,FRI`), and seasonal activation flags.
  - Prevents hardcoding of transport schedules in client code.

### 2.6 Trip Management Module
- **Purpose**: Govern actual daily transit runs executed by drivers.
- **Core Distinction: Schedule vs. Trip**:
  - **Schedule**: A static, recurring plan template (e.g., "Route 3 runs every weekday at 08:00 AM using Bus #12").
  - **Trip**: A dynamic runtime instance created for a specific date/time (e.g., "Trip #1043 on August 26, 2026, started by Driver John at 08:02 AM").
- **Trip Lifecycle States**:
  ```text
  [ SCHEDULED ] ──(Driver starts)──► [ IN_PROGRESS ] ──(Driver finishes)──► [ COMPLETED ]
         │                                   │
         └──(Admin/Weather Cancellation)─────┴──────────► [ CANCELLED ]
  ```
  - `SCHEDULED`: Generated for the day; awaiting driver startup.
  - `IN_PROGRESS`: Bus is currently en route; actively accepting GPS updates.
  - `COMPLETED`: Journey concluded; GPS logging stopped; summary metrics finalized.
  - `CANCELLED`: Trip aborted due to mechanical breakdown, holiday, or route closure.

### 2.7 Live Tracking & Location Telemetry Module
- **Purpose**: Process device GPS coordinates and provide low-latency feeds for map visualization.
- **Key Responsibilities**:
  - Ingesting driver device latitude/longitude streams via authenticated REST API calls.
  - Validating coordinate integrity (range checks, accuracy thresholds).
  - Appending chronological entries to `trip_locations` table.
  - Providing the most recent location point for active trips to student and admin clients.

### 2.8 Dashboard & Monitoring Module
- **Purpose**: Deliver role-specific metrics, status summaries, and operational overviews.
- **Student Dashboard**: Quick route search, bus ETA display, live tracking viewer.
- **Driver Dashboard**: Active trip controls, start/stop trigger, GPS broadcast health indicator.
- **Admin Dashboard**: Total buses active, ongoing trips count, real-time fleet map overview, alert logs.
