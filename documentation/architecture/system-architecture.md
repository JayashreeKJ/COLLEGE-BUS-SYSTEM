# SmartBus — System Architecture

## 1. High-Level Architecture Overview

SmartBus follows a modern **Client-Server 3-Tier Architecture** consisting of a Single Page Application (SPA) frontend, a stateless RESTful backend service, and a relational MySQL database.

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
                           REST API Layer (JSON)
                                    │
                      Spring Boot Backend Application
                                    │
                     ┌──────────────┼──────────────┐
                     │              │              │
                Security       Business Logic    Tracking
               (JWT/Auth)     (Transit Domain)   (GPS Engine)
                     │              │              │
                     └──────────────┼──────────────┘
                                    │
                       Spring Data JPA / Hibernate
                                    │
                              MySQL Database
```

---

## 2. Layer Responsibilities

| Layer | Technology | Primary Responsibilities |
| :--- | :--- | :--- |
| **Presentation Tier (Frontend)** | React (Vite), JavaScript, React Router, Vanilla CSS | - User interface rendering and client-side routing.<br>- Role-based navigation and protected routes.<br>- Capturing driver device GPS coordinates via Browser Geolocation API.<br>- Visualizing bus locations and routes on Google Maps.<br>- Handling user interactions and communicating via asynchronous REST API calls (`fetch` / `axios`). |
| **API & Security Tier** | Spring Boot, Spring Web, Spring Security, JJWT | - Exposing structured, versioned REST API endpoints (`/api/...`).<br>- Intercepting requests using JWT Authentication Filters.<br>- Role-Based Access Control (RBAC) ensuring endpoints are restricted to authorized roles (`ROLE_STUDENT`, `ROLE_DRIVER`, `ROLE_ADMIN`).<br>- Request payload validation, sanitization, and standardized error response formatting. |
| **Business Logic Tier (Backend)** | Spring Boot Services (Java 17/21) | - Core business rules enforcement (trip lifecycles, route-stop sequencing, schedule checks).<br>- Driver assignment verification before accepting location broadcasts.<br>- Location processing, accuracy filtering, and persistence.<br>- Coordinate transformation and state aggregation for tracking consumers. |
| **Data Persistence Tier (ORM & DB)** | Spring Data JPA, Hibernate, MySQL 8.x | - Relational object-relational mapping (ORM) and declarative transaction management (`@Transactional`).<br>- Optimized querying via JPA repositories and custom JPQL/native queries.<br>- Enforcing relational integrity via Primary Keys, Foreign Keys, unique constraints, and indexes.<br>- Persistent storage of users, fleet assets, routes, schedules, trips, and location logs. |

---

## 3. Role Architecture & Permissions

The system defines three distinct user personas, each operating within a strictly scoped permission boundary:

```text
                               ┌──────────────┐
                               │     USER     │
                               └──────┬───────┘
                     ┌────────────────┼────────────────┐
                     │                │                │
             ┌───────▼──────┐ ┌───────▼──────┐ ┌───────▼──────┐
             │   STUDENT    │ │    DRIVER    │ │    ADMIN     │
             └──────────────┘ └──────────────┘ └──────────────┘
```

### 3.1 Role Comparison Matrix

| Feature / Action | Student | Driver | Admin |
| :--- | :---: | :---: | :---: |
| Account Registration | Yes (Self) | No (Admin provisioned) | No (Seeded/Pre-configured) |
| Account Login & Profile Management | Yes | Yes | Yes |
| View Bus Fleet & Driver Contact | Yes | Assigned Only | Full Access |
| View Routes, Stops, and Timings | Yes | Assigned Only | Full Access |
| Manage Fleet (Buses, Drivers, Routes, Stops) | No | No | Full CRUD |
| Manage Schedules & Assignments | No | No | Full CRUD |
| Start / End Scheduled Trips | No | Yes (Assigned) | Monitor & Override |
| Stream Live Device GPS Coordinates | No | Yes (Active Trip) | No |
| View Live Bus Tracking on Google Maps | Yes | No / Optional | Full Fleet Live View |
| System Logs & Trip History Auditing | No | Own Trips | Global History |

---

## 4. Security Architecture

SmartBus utilizes a stateless **JSON Web Token (JWT)** security architecture with Spring Security and BCrypt password hashing.

### 4.1 Authentication & Authorization Flow

```text
React Client                    Spring Boot Backend                     MySQL Database
    │                                    │                                     │
    │ 1. POST /api/auth/login            │                                     │
    │    (email, plaintext password)     │                                     │
    ├───────────────────────────────────►│                                     │
    │                                    │ 2. Find user by email               │
    │                                    ├────────────────────────────────────►│
    │                                    │◄────────────────────────────────────┤
    │                                    │ 3. User entity returned (hashed pw) │
    │                                    │                                     │
    │                                    │ 4. BCrypt.matches(raw, hash)        │
    │                                    │ 5. If valid, generate JWT Token    │
    │                                    │    (Contains: userId, role, expiry) │
    │ 6. Response: { token, userProfile }│                                     │
    │◄───────────────────────────────────┤                                     │
    │                                    │                                     │
    │ [Client stores JWT in memory/storage]                                    │
    │                                    │                                     │
    │ 7. GET /api/trips/active           │                                     │
    │    Header: "Authorization: Bearer <JWT>"                                 │
    ├───────────────────────────────────►│                                     │
    │                                    │ 8. JwtAuthenticationFilter verifies │
    │                                    │    signature, validity & extracts   │
    │                                    │    user role & principal            │
    │                                    │ 9. SecurityContextHolder populated  │
    │                                    │ 10. RBAC check (@PreAuthorize)      │
    │                                    │ 11. Controller executes service     │
    │ 12. Response: JSON Data            │                                     │
    │◄───────────────────────────────────┤                                     │
```

### 4.2 Security Principles & Best Practices
1. **No Plaintext Passwords**: Passwords are never stored in plaintext. They are salted and hashed using **BCrypt** with an appropriate workload factor (default: 10 or 12).
2. **Stateless Sessions**: The server maintains no HTTP session state. Every incoming API request is authenticated independently via the `Authorization: Bearer <token>` HTTP header.
3. **Role Prefixing**: Roles in Spring Security follow the standard `ROLE_` convention (`ROLE_STUDENT`, `ROLE_DRIVER`, `ROLE_ADMIN`).
4. **Token Expiration**: Access tokens are signed using a cryptographic HMAC-SHA256 secret key with an expiration window (e.g., 24 hours for daily campus transit).

---

## 5. REST API Architecture Plan

The API surface is structured into modular domain controllers with clear URI paths and HTTP method conventions:

```text
/api/
├── auth/           # Authentication and credential management
├── users/          # User profile operations
├── students/       # Student-specific information and registrations
├── drivers/        # Driver-specific information and assignments
├── admin/          # Administrative operations and system metrics
├── buses/          # Bus fleet management
├── routes/         # Transit routes and stop sequencing
├── stops/          # Physical bus stop points and coordinates
├── schedules/      # Recurring timetable schedules
├── trips/          # Real-time and historical trip execution
└── tracking/       # GPS ingestion and latest location queries
```

### High-Level Endpoint Summary

| Endpoint Group | Method & Path | Description | Access Role |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST /api/auth/register` | Student self-registration | Public |
| | `POST /api/auth/login` | Authenticate user & issue JWT | Public |
| | `GET /api/auth/me` | Fetch authenticated user profile | Authenticated |
| **Buses** | `GET /api/buses` | List all buses in fleet | Student, Driver, Admin |
| | `POST /api/buses` | Register a new bus | Admin |
| | `PUT /api/buses/{id}` | Update bus details/status | Admin |
| | `DELETE /api/buses/{id}` | Decommission bus | Admin |
| **Routes & Stops** | `GET /api/routes` | View all active routes with stops | Student, Driver, Admin |
| | `POST /api/routes` | Create route with stop sequence | Admin |
| | `GET /api/stops` | List all physical bus stops | Student, Driver, Admin |
| | `POST /api/stops` | Add new stop location | Admin |
| **Schedules** | `GET /api/schedules` | View bus timetables | Student, Driver, Admin |
| | `POST /api/schedules` | Create recurring schedule | Admin |
| **Trips** | `POST /api/trips/start` | Driver initiates assigned trip | Driver |
| | `POST /api/trips/{id}/end` | Driver completes trip | Driver |
| | `GET /api/trips/active` | Get all currently active trips | Student, Driver, Admin |
| **Tracking** | `POST /api/tracking/update` | Ingest driver GPS coordinates | Driver |
| | `GET /api/tracking/trip/{tripId}/latest` | Get latest coordinates of a trip | Student, Driver, Admin |
| | `GET /api/tracking/active-fleet` | Get latest coordinates of all active buses | Admin |

---

## 6. Frontend Architecture Plan (React + Vite)

The frontend application is structured for clarity, modularity, and easy navigation during college project presentations:

```text
frontend/
├── public/                 # Static assets, favicon, campus map icons
├── src/
│   ├── assets/             # Images, logos, SVG markers
│   ├── components/         # Reusable presentation components
│   │   ├── common/         # Buttons, Input fields, Modal, Loader, Alert
│   │   ├── layout/         # Header, Navbar, Sidebar, Footer, PageWrapper
│   │   ├── map/            # GoogleMapContainer, BusMarker, StopMarker, RoutePolyline
│   │   └── cards/          # BusCard, RouteCard, TripStatusCard
│   ├── context/            # React Contexts for global state
│   │   ├── AuthContext.jsx # Current user, login/logout, token state
│   │   └── MapContext.jsx  # Map instance, active markers
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js      # Access AuthContext
│   │   ├── useGeolocation.js # Browser Geolocation watchPosition hook
│   │   └── usePolling.js   # Periodic data fetching for live tracking
│   ├── layouts/            # Role-based layout templates
│   │   ├── StudentLayout.jsx
│   │   ├── DriverLayout.jsx
│   │   └── AdminLayout.jsx
│   ├── pages/              # Route-level view components
│   │   ├── auth/           # Login, Register, Unauthorized
│   │   ├── student/        # StudentDashboard, BusList, RouteSearch, LiveTracking, Profile
│   │   ├── driver/         # DriverDashboard, TripControl, LocationBroadcaster
│   │   └── admin/          # AdminDashboard, BusMgmt, DriverMgmt, RouteMgmt, ScheduleMgmt, FleetMonitor
│   ├── routes/             # Route definitions & guards
│   │   ├── AppRoutes.jsx   # Top-level route switch
│   │   └── ProtectedRoute.jsx # Role validation and redirection guard
│   ├── services/           # Backend API integration services
│   │   ├── api.js          # Axios / Fetch base client with JWT interceptor
│   │   ├── authService.js  # Login, Register, Profile API calls
│   │   ├── busService.js   # Fleet APIs
│   │   ├── routeService.js # Route and stop APIs
│   │   ├── tripService.js  # Trip lifecycle APIs
│   │   └── trackingService.js # GPS coordinate post & fetch APIs
│   ├── utils/              # Helper utilities
│   │   ├── formatters.js   # Date, time, and distance formatting
│   │   └── validators.js   # Form input validation
│   ├── App.jsx             # Root component with providers
│   ├── main.jsx            # Entry point
│   └── index.css           # Global typography, CSS variables, and design tokens
```

---

## 7. Backend Architecture Plan (Spring Boot)

The backend follows the established **Spring layered architectural pattern**, enforcing separation of concerns:

```text
backend/
├── src/
│   ├── main/
│   │   ├── java/com/smartbus/
│   │   │   ├── config/            # Application configuration beans (CORS, Swagger/OpenAPI, ModelMapper)
│   │   │   ├── controller/        # REST Controllers handling HTTP requests & responses
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── BusController.java
│   │   │   │   ├── RouteController.java
│   │   │   │   ├── ScheduleController.java
│   │   │   │   ├── TripController.java
│   │   │   │   ├── TrackingController.java
│   │   │   │   └── AdminController.java
│   │   │   ├── dto/               # Data Transfer Objects (Request/Response contracts)
│   │   │   │   ├── request/       # LoginRequest, RegisterRequest, LocationUpdateRequest, etc.
│   │   │   │   └── response/      # JwtResponse, TripResponse, BusResponse, LocationDTO, etc.
│   │   │   ├── entity/            # JPA Entity classes mapping directly to MySQL tables
│   │   │   │   ├── User.java
│   │   │   │   ├── Student.java
│   │   │   │   ├── Driver.java
│   │   │   │   ├── Bus.java
│   │   │   │   ├── Route.java
│   │   │   │   ├── Stop.java
│   │   │   │   ├── RouteStop.java
│   │   │   │   ├── Schedule.java
│   │   │   │   ├── Trip.java
│   │   │   │   └── TripLocation.java
│   │   │   ├── enums/             # System enumerations
│   │   │   │   ├── Role.java          # ROLE_STUDENT, ROLE_DRIVER, ROLE_ADMIN
│   │   │   │   ├── BusStatus.java     # ACTIVE, MAINTENANCE, INACTIVE
│   │   │   │   └── TripStatus.java    # SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
│   │   │   ├── exception/         # Custom exceptions & global HTTP exception handler
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   ├── BadRequestException.java
│   │   │   │   ├── UnauthorizedException.java
│   │   │   │   └── GlobalExceptionHandler.java # @RestControllerAdvice
│   │   │   ├── repository/        # Spring Data JPA Repository interfaces
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── BusRepository.java
│   │   │   │   ├── RouteRepository.java
│   │   │   │   ├── StopRepository.java
│   │   │   │   ├── ScheduleRepository.java
│   │   │   │   ├── TripRepository.java
│   │   │   │   └── TripLocationRepository.java
│   │   │   ├── security/          # Spring Security & JWT components
│   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   ├── JwtAuthenticationEntryPoint.java
│   │   │   │   ├── CustomUserDetailsService.java
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── service/           # Business logic interfaces
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── BusService.java
│   │   │   │   ├── RouteService.java
│   │   │   │   ├── ScheduleService.java
│   │   │   │   ├── TripService.java
│   │   │   │   └── TrackingService.java
│   │   │   ├── service/impl/      # Service implementation classes (@Service)
│   │   │   └── SmartBusApplication.java # Spring Boot entry point (@SpringBootApplication)
│   │   └── resources/
│   │       ├── application.properties # Spring, JPA, Hibernate, JWT, & MySQL configurations
│   │       └── application-dev.properties
└── pom.xml                        # Maven dependencies & build definitions
```
