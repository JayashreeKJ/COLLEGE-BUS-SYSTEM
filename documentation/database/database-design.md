# SmartBus — Relational Database Design

## 1. Database Overview

SmartBus uses a relational **MySQL 8.x** schema designed in **Third Normal Form (3NF)**. The design ensures data integrity, avoids redundant storage, enforces strict foreign key constraints, and guarantees efficient query execution for real-time tracking lookups.

---

## 2. Core Entities & Architectural Rationale

### 2.1 Users and Role Profiles (`users`, `students`, `drivers`)
- **Centralized Authentication**: The `users` table handles system login credentials, email uniqueness, password hashes, contact phones, and primary role definitions (`STUDENT`, `DRIVER`, `ADMIN`).
- **Normalized Profile Extensions**:
  - `students` maintains a 1-to-1 foreign key to `users` with academic attributes (`roll_number`, `branch`, `year_of_study`, `pickup_stop_id`).
  - `drivers` maintains a 1-to-1 foreign key to `users` with vocational attributes (`license_number`, `license_expiry`, `emergency_contact`).
- **Advantage**: Prevents sprawling sparse tables with dozens of nullable columns, and provides strong referential integrity.

### 2.2 Transit Fleet & Infrastructure (`buses`, `routes`, `stops`, `route_stops`)
- **Fleet Identification (`buses`)**: Buses are tracked by `bus_number` (e.g., "Bus-07") and state `registration_number` (e.g., "KA-01-AB-1234").
- **Physical Stop Locations (`stops`)**: Physical geographic points defined by `latitude`, `longitude`, and `landmark`. Stops exist independently of routes.
- **Ordered Route Sequences (`route_stops`)**: Associative junction table resolving the many-to-many relationship between `routes` and `stops`. It carries route-specific metadata:
  - `stop_sequence`: 1-based order of stops along the route.
  - `estimated_arrival_offset_minutes`: Travel time offset from trip start.
  - `distance_from_prev_stop_km`: Segment distance.

### 2.3 Operational Timetables (`schedules`)
- **Template Definition**: Represents the recurring transit schedule linking a `route_id`, a default `bus_id`, a default `driver_id`, planned `departure_time`, and active `operating_days` (e.g., "MON,TUE,WED,THU,FRI").

### 2.4 Dynamic Runtime Executions (`trips`, `trip_locations`)
- **Trip Instance (`trips`)**: Distinct from recurring schedules. An actual physical trip conducted on a specific date (`trip_date`), with precise start/end timestamps and operational states (`SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
- **Telemetry Logs (`trip_locations`)**: High-frequency GPS breadcrumbs received from the driver's device during active trips.

---

## 3. Key Relationships & Cardinalities

```text
  ┌──────────┐ 1        1:1         1 ┌───────────┐
  │  users   ├────────────────────────┤ students  │
  └────┬─────┘                        └─────┬─────┘
       │ 1                                  │ N:1
       │ 1:1                                ▼
       │ 1                            ┌───────────┐
       ├─────────────────────────────►│   stops   │◄─────────┐
       │                              └─────┬─────┘          │
       │ 1 ┌───────────┐                    │ 1              │
       └──►│  drivers  │                    │ 1:N            │
           └─────┬─────┘                    ▼                │
                 │ 1                  ┌───────────┐          │
                 │                    │route_stops│ (N:1)    │
                 │                    └─────▲─────┘          │
                 │ 1:N                      │ N:1            │
                 ▼                          │                │
           ┌───────────┐              ┌─────┴─────┐          │
           │ schedules │◄─────────────┤  routes   │          │
           └─────┬─────┘ 1        1:N └─────┬─────┘          │
                 │                          │                │
                 │ 1:N                      │ 1:N            │
                 ▼                          ▼                │
  ┌──────────┐ 1 ┌───────────────────────────┐               │
  │  buses   ├──►│           trips           │               │
  └──────────┘   └─────────────┬─────────────┘               │
                               │ 1                           │
                               │ 1:N                         │
                               ▼                             │
                         ┌──────────────┐                    │
                         │trip_locations│                    │
                         └──────────────┘                    │
```

### Cardinality Summary
1. **User to Student / Driver**: `1 : 0..1` (One user record maps to at most one student or driver profile).
2. **Route to Stops**: `N : M` resolved via `route_stops` (`Route 1:N route_stops N:1 Stop`).
3. **Route / Bus / Driver to Schedule**: `1 : N` (A route, bus, or driver can be associated with multiple timetable schedules).
4. **Schedule to Trips**: `1 : N` (One recurring schedule template produces multiple dated trip instances).
5. **Trip to TripLocations**: `1 : N` (One trip records hundreds of continuous GPS coordinates).

---

## 4. Integrity Constraints & Foreign Keys

| Parent Table | Parent Key | Child Table | Foreign Key | On Delete Action | On Update Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `users` | `id` | `students` | `user_id` | `CASCADE` | `CASCADE` |
| `users` | `id` | `drivers` | `user_id` | `CASCADE` | `CASCADE` |
| `stops` | `id` | `students` | `pickup_stop_id` | `SET NULL` | `CASCADE` |
| `routes` | `id` | `route_stops` | `route_id` | `CASCADE` | `CASCADE` |
| `stops` | `id` | `route_stops` | `stop_id` | `RESTRICT` | `CASCADE` |
| `routes` | `id` | `schedules` | `route_id` | `RESTRICT` | `CASCADE` |
| `buses` | `id` | `schedules` | `bus_id` | `RESTRICT` | `CASCADE` |
| `drivers` | `id` | `schedules` | `driver_id` | `RESTRICT` | `CASCADE` |
| `schedules` | `id` | `trips` | `schedule_id` | `SET NULL` | `CASCADE` |
| `buses` | `id` | `trips` | `bus_id` | `RESTRICT` | `CASCADE` |
| `drivers` | `id` | `trips` | `driver_id` | `RESTRICT` | `CASCADE` |
| `routes` | `id` | `trips` | `route_id` | `RESTRICT` | `CASCADE` |
| `trips` | `id` | `trip_locations` | `trip_id` | `CASCADE` | `CASCADE` |

---

## 5. Performance Indexing Strategy

1. **Unique Lookups**:
   - `users.email` (Unique Index for rapid authentication)
   - `buses.bus_number`, `buses.registration_number` (Unique Index)
   - `routes.route_code` (Unique Index)
   - `students.roll_number`, `drivers.license_number` (Unique Index)
   - `route_stops(route_id, stop_sequence)` (Composite Unique Index preventing duplicate sequence positions)
2. **Telemetry Performance**:
   - `trip_locations(trip_id, recorded_at DESC)` (Crucial composite index enabling $O(1)$ retrieval of the latest GPS coordinate for active buses).
3. **Trip Filtering**:
   - `trips(status, trip_date)` (Index for rapid querying of active trips during peak hours).
