# SmartBus — Live Location Tracking Architecture

## 1. Fundamental Conceptual Distinction

A common misconception in web mapping systems is conflating coordinate generation with map display. SmartBus strictly isolates these two concerns:

```text
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                                 CORE ARCHITECTURAL RULE                               │
├───────────────────────────────────────────┬───────────────────────────────────────────┤
│           SOURCE OF COORDINATES           │             MAP VISUALIZATION             │
│            (Device GPS Sensor)            │           (Google Maps Platform)          │
├───────────────────────────────────────────┼───────────────────────────────────────────┤
│ • Driver's smartphone / browser hardware. │ • JavaScript SDK for rendering base tiles.│
│ • Geolocation Web API (`watchPosition`).  │ • Displays custom bus markers and stops.  │
│ • Emits raw latitude, longitude, speed.   │ • Renders polyline routes & pan/zoom UI.  │
│ • True origin of physical location.       │ • Merely consumes coordinates for display.│
└───────────────────────────────────────────┴───────────────────────────────────────────┘
```

> **Important**: Google Maps **never** tracks or generates the bus coordinates. The driver's physical device captures its own GPS coordinates, pushes them to the Spring Boot REST backend, and the student/admin interfaces project those coordinates onto a Google Maps JavaScript canvas.

---

## 2. End-to-End Tracking Pipeline

```text
  ┌───────────────────────────────┐
  │  Driver Device GPS Hardware   │
  └───────────────┬───────────────┘
                  │ (WGS-84 Coordinates: lat, lng, accuracy, speed)
                  ▼
  ┌───────────────────────────────┐
  │  React Driver Web Interface   │
  │  (navigator.geolocation API)  │
  └───────────────┬───────────────┘
                  │ HTTP POST /api/tracking/update
                  │ Payload: { tripId, latitude, longitude, accuracy, timestamp }
                  ▼
  ┌───────────────────────────────┐
  │      Spring Boot Backend      │
  │      (TrackingController)     │
  └───────┬───────────────┬───────┘
          │               │
 (Async Persistence)      │ (Fast Query API)
          ▼               ▼
  ┌───────────────┐  ┌────────────────────────────────┐
  │ MySQL Database│  │ GET /api/tracking/trip/{id}/lat │
  │`trip_locations│  └────────────┬───────────────────┘
  └───────────────┘               │ JSON: { lat, lng, lastUpdated }
                                  ▼
                     ┌───────────────────────────────┐
                     │ Student/Admin React Interface │
                     └────────────┬──────────────────┘
                                  │
                                  ▼
                     ┌───────────────────────────────┐
                     │ Google Maps JavaScript API    │
                     │ (Animates Marker on Map)      │
                     └───────────────────────────────┘
```

---

## 3. Telemetry Ingestion & Query Lifecycle

1. **Trip Initialization**:
   - The driver starts a scheduled trip from the Driver Dashboard.
   - The backend sets `trip.status = 'IN_PROGRESS'`.
2. **GPS Stream Activation**:
   - The driver's React app activates `navigator.geolocation.watchPosition(...)` with `enableHighAccuracy: true`.
   - The client polls or streams updates at a controlled interval (e.g., every 5–10 seconds).
3. **Backend Validation & Storage**:
   - The backend validates that the submitting user is the assigned driver and that the trip is currently `IN_PROGRESS`.
   - The coordinates are verified to be within valid geographical bounds ($-90 \le \text{lat} \le 90$, $-180 \le \text{lng} \le 180$).
   - A new row is inserted into `trip_locations`.
4. **Consumer Polling & Rendering**:
   - Students and Admins viewing the active trip query `GET /api/tracking/trip/{tripId}/latest` every 5–10 seconds.
   - The React Google Maps component receives updated coordinates and smoothly repositions the bus marker using animation/interpolation.

---

## 4. Engineering & Edge-Case Considerations

### 4.1 GPS Accuracy & Outlier Filtering
- **Problem**: GPS hardware in urban/campus environments can produce multipath reflections or poor accuracy fixes (e.g., accuracy $> 50$ meters).
- **Mitigation**:
  - The client checks `position.coords.accuracy`. If accuracy exceeds a configured threshold (e.g., $> 35$ meters), the reading is dropped or flagged.
  - Coordinate bounds are validated server-side to reject corrupted data.

### 4.2 Timestamps & Clock Skew
- **Problem**: Client device clocks may be out of sync with the backend server.
- **Mitigation**: The system records two timestamps: `recorded_at` (client device time when GPS fix occurred) and `created_at` (server receipt time). Server-side freshness logic relies on server timestamps for consistency.

### 4.3 Stale Location & Offline Detection
- **Problem**: The driver may drive through a dead zone or close the browser tab unexpectedly.
- **Mitigation**:
  - The backend and frontend calculate data freshness: $\Delta t = \text{currentTime} - \text{latestLocationTime}$.
  - If $\Delta t > 60\text{ seconds}$, the student UI flags the bus status as **"Connection Lost / Stale Location"** rather than misleading the user with inaccurate real-time movement.

### 4.4 Stationary Bus / Jitter Suppression
- **Problem**: When a bus is stopped at a traffic light or bus stop, GPS drift can cause the marker to jitter randomly.
- **Mitigation**: If the calculated distance between the consecutive GPS points is less than a minimum threshold (e.g., $< 5$ meters) and speed is near 0, the marker maintains its current position.

### 4.5 Permission Denial & Graceful Fallback
- **Problem**: Driver refuses browser location permissions or hardware GPS is disabled.
- **Mitigation**:
  - The React driver interface displays an explicit, prominent banner explaining that location access is mandatory to start the trip.
  - The "Start Trip" button is disabled until location permission is granted.

### 4.6 Database Growth & Data Retention Strategy
- **Problem**: Ingesting GPS logs every 5 seconds for a fleet of 20 buses creates $\approx 14,400$ records per bus/day ($288,000$ daily rows).
- **Mitigation**:
  - **Composite Indexing**: `trip_locations` is indexed on `(trip_id, recorded_at DESC)` for instant latest-coordinate lookups ($O(1)$ indexed retrieval).
  - **Retention Policy**: Active trips write to `trip_locations`. Once a trip status becomes `COMPLETED` or `CANCELLED`, detailed high-frequency telemetry can be archived or down-sampled (keeping only 1 point every 60 seconds for route audit), and raw point logs older than 30 days can be purged via scheduled maintenance tasks.

---

## 5. Real-Time Communication Roadmap (Future Scope)

While SmartBus initially uses clean, reliable **REST Polling (Short Polling)** to maintain simplicity and rock-solid college project demonstration stability, the architecture is designed for direct upgrade to real-time protocols:

```text
 REST Ingestion (Driver) ──► Spring Boot Ingestion ──► STOMP / WebSocket Broker ──► Student Subscriptions
```
- **Phase 1 (Current Plan)**: HTTP REST `POST` from Driver + HTTP REST `GET` Polling (every 5-10s) from Student/Admin.
- **Phase 2 (Future Enhancement)**: WebSocket with STOMP or Server-Sent Events (SSE) for sub-second push notifications without polling overhead.
