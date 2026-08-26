# SmartBus — Application & Operational Flows

## 1. Overview
This document outlines the end-to-end user journeys, operational workflows, and transactional sequences across the SmartBus platform.

---

## 2. Student User Journey Flow

```text
[Student Visits Portal]
         │
         ├─── Not Registered? ──► [Sign Up Page] ──► Fill Details (Roll No, Branch, Email, Password)
         │                                                      │
         │◄─────────────────────────────────────────────────────┘
         │
         ▼
  [Login Page]
         │ (Submits Email & Password)
         ▼
  [Authenticate via JWT]
         │
         ▼
  [Student Dashboard]
         │
         ├───────────────────────┬────────────────────────┬───────────────────────┐
         ▼                       ▼                        ▼                       ▼
  [View Bus Fleet]        [Search Routes]          [View Timetables]      [Live Bus Tracking]
   - Bus capacities        - Origin/Destination     - Departure times      - Select Active Trip
   - Assigned drivers      - Ordered Stop List      - Operating days       - Google Maps View
   - Contact details       - Estimated timings      - Stop-by-stop ETA     - Real-time Marker Update
```

---

## 3. Driver Operational Flow

```text
[Driver Receives Credentials from Admin]
                   │
                   ▼
             [Driver Login]
                   │ (JWT issued with ROLE_DRIVER)
                   ▼
          [Driver Dashboard]
                   │
                   ├── View Assigned Bus
                   ├── View Assigned Route & Ordered Stops
                   └── View Scheduled Departure
                   │
                   ▼
          [Tap "Start Trip"]
                   │
                   ├── Backend updates Trip status: "IN_PROGRESS"
                   ├── Browser requests Geolocation Permission
                   │
                   ▼
     [GPS Broadcasting Loop (Active)]
     ┌────────────────────────────────────────────────────────┐
     │ 1. navigator.geolocation.watchPosition()               │
     │ 2. Extract: latitude, longitude, accuracy, timestamp   │
     │ 3. Filter jitter / out-of-range readings               │
     │ 4. POST /api/tracking/update every 5–10 seconds        │
     │ 5. Backend stores record in `trip_locations`           │
     └─────────────────────────┬──────────────────────────────┘
                               │
                     (Destination Reached)
                               ▼
                       [Tap "End Trip"]
                               │
                               ├── Browser stops Geolocation watcher
                               ├── Backend updates Trip status: "COMPLETED"
                               └── Trip stats logged & archived
```

---

## 4. Admin Management Flow

```text
[Admin Login] ──► [Admin Dashboard]
                         │
        ┌────────────────┼────────────────┬────────────────┬────────────────┐
        ▼                ▼                ▼                ▼                ▼
 [Manage Buses]   [Manage Drivers] [Manage Routes]  [Manage Stops]   [Manage Schedules]
  - Add Bus        - Register Driver - Create Route   - Add Geo-Stop  - Link Bus+Driver+Route
  - Edit Capacity  - License details - Sequence Stops - Set Lat/Lng    - Define timings/days
  - Fleet Status   - Assign Bus      - Set Distances  - Landmark name - Activate/Deactivate
        │                │                │                │                │
        └────────────────┴────────────────┴────────────────┴────────────────┘
                                          │
                                          ▼
                               [Fleet Monitor Dashboard]
                                 - View all IN_PROGRESS trips
                                 - Global Google Map showing all active bus markers
                                 - Trip status, delays, and telemetry
```

---

## 5. End-to-End Sequence Diagrams

### 5.1 Authentication Flow
```text
User / Browser               React App                   Spring Boot                  MySQL
      │                          │                            │                         │
      │ 1. Enter Email/Password  │                            │                         │
      ├─────────────────────────►│                            │                         │
      │                          │ 2. POST /api/auth/login    │                         │
      │                          ├───────────────────────────►│                         │
      │                          │                            │ 3. Query User By Email  │
      │                          │                            ├────────────────────────►│
      │                          │                            │◄────────────────────────┤
      │                          │                            │ 4. Verify BCrypt Hash   │
      │                          │                            │ 5. Create JWT Token     │
      │                          │ 6. Return 200 OK + JWT     │                         │
      │                          │◄───────────────────────────┤                         │
      │                          │                            │                         │
      │                          │ 7. Store JWT in LocalState │                         │
      │ 8. Render Role Dashboard │                            │                         │
      │◄─────────────────────────┤                            │                         │
```

### 5.2 Live GPS Tracking Loop Sequence
```text
Driver Device            React Driver UI             Spring Boot API            MySQL              Student React UI (Map)
      │                         │                           │                     │                          │
      │ (Trip Started)          │                           │                     │                          │
      │ 1. GPS Fix (lat, lng)   │                           │                     │                          │
      ├────────────────────────►│                           │                     │                          │
      │                         │ 2. POST /tracking/update  │                     │                          │
      │                         │    {tripId, lat, lng, acc}│                     │                          │
      │                         ├──────────────────────────►│                     │                          │
      │                         │                           │ 3. Save to          │                          │
      │                         │                           │    trip_locations   │                          │
      │                         │                           ├────────────────────►│                          │
      │                         │                           │◄────────────────────┤                          │
      │                         │ 4. 200 OK (Acknowledged)  │                     │                          │
      │                         │◄──────────────────────────┤                     │                          │
      │                         │                           │                     │                          │
      │                         │                           │                     │ 5. GET /tracking/latest  │
      │                         │                           │◄───────────────────────────────────────────────┤
      │                         │                           │ 6. Fetch Latest Point                          │
      │                         │                           ├────────────────────►│                          │
      │                         │                           │◄────────────────────┤                          │
      │                         │                           │ 7. Return Coordinates (lat, lng, recordedAt)   │
      │                         │                           ├───────────────────────────────────────────────►│
      │                         │                           │                     │                          │
      │                         │                           │                     │ 8. Smooth Marker Pan     │
      │                         │                           │                     │    on Google Maps Canvas │
```
