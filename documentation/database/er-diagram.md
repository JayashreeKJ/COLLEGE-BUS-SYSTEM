# SmartBus — Entity Relationship (ER) Diagram

## 1. Complete Entity-Relationship Model

The following Mermaid diagram visualizes the entities, primary keys (PK), foreign keys (FK), core attributes, and relational cardinalities in the SmartBus database:

```mermaid
erDiagram
    USERS ||--o| STUDENTS : "has profile"
    USERS ||--o| DRIVERS : "has profile"
    
    STOPS ||--o{ STUDENTS : "assigned pickup"
    ROUTES ||--|{ ROUTE_STOPS : "contains"
    STOPS ||--|{ ROUTE_STOPS : "located at"
    
    ROUTES ||--o{ SCHEDULES : "scheduled on"
    BUSES ||--o{ SCHEDULES : "assigned to"
    DRIVERS ||--o{ SCHEDULES : "assigned to"
    
    SCHEDULES ||--o{ TRIPS : "generates"
    ROUTES ||--o{ TRIPS : "followed by"
    BUSES ||--o{ TRIPS : "executed with"
    DRIVERS ||--o{ TRIPS : "driven by"
    
    TRIPS ||--o{ TRIP_LOCATIONS : "records GPS"

    USERS {
        BIGINT id PK
        VARCHAR name
        VARCHAR email UK
        VARCHAR password_hash
        VARCHAR role
        VARCHAR phone
        VARCHAR status
        DATETIME created_at
        DATETIME updated_at
    }

    STUDENTS {
        BIGINT id PK
        BIGINT user_id FK,UK
        VARCHAR roll_number UK
        VARCHAR branch
        INT year_of_study
        BIGINT pickup_stop_id FK
        VARCHAR emergency_contact
        DATETIME created_at
        DATETIME updated_at
    }

    DRIVERS {
        BIGINT id PK
        BIGINT user_id FK,UK
        VARCHAR license_number UK
        DATE license_expiry
        VARCHAR emergency_contact
        INT experience_years
        VARCHAR status
        DATETIME created_at
        DATETIME updated_at
    }

    BUSES {
        BIGINT id PK
        VARCHAR bus_number UK
        VARCHAR registration_number UK
        INT capacity
        VARCHAR model
        VARCHAR status
        DATETIME created_at
        DATETIME updated_at
    }

    ROUTES {
        BIGINT id PK
        VARCHAR route_name
        VARCHAR route_code UK
        VARCHAR start_point
        VARCHAR end_point
        DECIMAL total_distance_km
        VARCHAR status
        DATETIME created_at
        DATETIME updated_at
    }

    STOPS {
        BIGINT id PK
        VARCHAR stop_name
        VARCHAR landmark
        DECIMAL latitude
        DECIMAL longitude
        DATETIME created_at
        DATETIME updated_at
    }

    ROUTE_STOPS {
        BIGINT id PK
        BIGINT route_id FK
        BIGINT stop_id FK
        INT stop_sequence
        INT estimated_arrival_offset_minutes
        DECIMAL distance_from_prev_stop_km
    }

    SCHEDULES {
        BIGINT id PK
        BIGINT route_id FK
        BIGINT bus_id FK
        BIGINT driver_id FK
        TIME departure_time
        TIME arrival_time
        VARCHAR operating_days
        VARCHAR status
        DATETIME created_at
        DATETIME updated_at
    }

    TRIPS {
        BIGINT id PK
        BIGINT schedule_id FK
        BIGINT bus_id FK
        BIGINT driver_id FK
        BIGINT route_id FK
        DATE trip_date
        DATETIME start_time
        DATETIME end_time
        VARCHAR status
        TEXT notes
        DATETIME created_at
        DATETIME updated_at
    }

    TRIP_LOCATIONS {
        BIGINT id PK
        BIGINT trip_id FK
        DECIMAL latitude
        DECIMAL longitude
        DECIMAL accuracy
        DECIMAL speed
        DECIMAL heading
        DATETIME recorded_at
        DATETIME created_at
    }
```

---

## 2. Key Relationship Explanations

1. **`USERS` ↔ `STUDENTS` & `DRIVERS` (1 : 0..1)**
   - Every student or driver is anchored to a unique `user_id` authentication identity.
   - Admin accounts reside purely in `USERS` without requiring profile extensions.

2. **`ROUTES` ↔ `ROUTE_STOPS` ↔ `STOPS` (Many-to-Many via Junction)**
   - A single physical stop (e.g. "Main Junction") can be part of multiple college bus routes.
   - `ROUTE_STOPS` defines the strict topological order (`stop_sequence`) and time offsets for each route independently.

3. **`SCHEDULES` ↔ `TRIPS` (1 : N Template to Instance)**
   - A `SCHEDULE` defines recurring operational plans (e.g., Weekday Morning Route 2).
   - Each individual bus journey conducted by a driver is recorded as an independent `TRIP` record.

4. **`TRIPS` ↔ `TRIP_LOCATIONS` (1 : N Real-Time Stream)**
   - As a driver executes a trip, periodic GPS fixes are stored sequentially in `TRIP_LOCATIONS`.
   - Indexing on `(trip_id, recorded_at DESC)` ensures instant retrieval of the bus marker's current coordinate.
