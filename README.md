# SmartBus – College Bus Management & Tracking System

## 1. Project Overview

**SmartBus** is a web-based College Bus Management and Tracking System developed to simplify and modernize campus transportation management. The application provides a centralized platform for students, drivers, and administrators to manage transportation-related activities efficiently.

The system integrates user authentication, bus and route management, scheduling, driver coordination, and live bus tracking through an intuitive web interface.

SmartBus aims to improve transportation accessibility, operational efficiency, and communication between college transportation stakeholders.

**Live Application:** https://college-bus-system.vercel.app/

**Backend API:** https://smartbus-backend-aefe.onrender.com

---

## 2. Project Status

```text
Project Status:
Project Structure:              COMPLETED
System Architecture:             COMPLETED
Database Design:                 COMPLETED
Backend Development:             COMPLETED
Frontend Development:            COMPLETED
Authentication & Authorization:  IMPLEMENTED
Bus Management:                   IMPLEMENTED
Route & Schedule Management:      IMPLEMENTED
Live Bus Tracking:                IMPLEMENTED
Deployment:                       COMPLETED
```

The application has been developed and deployed, with the frontend hosted on Vercel and the backend hosted on Render.

---

## 3. Technology Stack

### Frontend
- **React.js** – Component-based user interface development.
- **Vite** – Frontend development and build tool.
- **JavaScript (ES6+)** – Application functionality and client-side logic.
- **React Router** – Navigation and route management.
- **CSS3** – Responsive layouts, styling, and interface design.

### Backend
- **Java 21** – Backend programming language.
- **Spring Boot 3.3.4** – Backend application framework.
- **Spring Web** – RESTful API development.
- **Spring Data JPA** – Database interaction and persistence.
- **Hibernate** – Object-relational mapping.
- **Spring Security** – Application security and access control.
- **JWT (JSON Web Token)** – Token-based authentication.
- **BCrypt** – Password hashing.

### Database
- **MySQL 8.x** – Relational database management system.

### Deployment
- **Vercel** – Frontend hosting and deployment.
- **Render** – Backend application hosting.

### Location Tracking
- **Device Geolocation API** – Obtaining geographical coordinates from the driver's device.
- **Live Tracking Interface** – Displaying bus movement and location information to authorized users.

---

## 4. System Architecture

SmartBus follows a client-server architecture in which the React frontend communicates with the Spring Boot backend through REST APIs. The backend handles authentication, business logic, transportation data, and database operations.

```text
                       SMARTBUS SYSTEM
                              |
          +-------------------+-------------------+
          |                   |                   |
       Student              Driver              Admin
          |                   |                   |
          +-------------------+-------------------+
                              |
                       React Frontend
                          (Vite)
                              |
                         REST APIs
                              |
                      Spring Boot Backend
                          (Java 21)
                              |
          +-------------------+-------------------+
          |                   |                   |
     Authentication     Business Logic       GPS Tracking
       & Security       & Management          Operations
          |                   |                   |
          +-------------------+-------------------+
                              |
                       Spring Data JPA
                              |
                         MySQL Database
```

### Deployment Architecture

```text
             User's Web Browser
                     |
                     |
             Vercel Frontend
                     |
                     | HTTPS / REST API
                     |
             Render Backend
                     |
                     |
               MySQL Database
```

---

## 5. User Roles and Functionalities

### Student Module
- Student registration and secure login.
- Access to the student dashboard.
- View available buses and transportation details.
- View assigned routes, boarding stops, and bus schedules.
- Track bus locations through the live tracking interface.
- View personal profile and student information.

### Driver Module
- Secure driver login.
- Access driver dashboard.
- View assigned bus and route information.
- View relevant transportation schedules.
- Start and end assigned trips.
- Share device location during active trips for bus tracking.
- Manage driver profile information.

### Administrator Module
- Secure administrator access.
- Manage student and driver information.
- Add, update, and manage bus details.
- Manage routes and bus stops.
- Create and manage transportation schedules.
- Assign buses and drivers to routes.
- Monitor transportation operations through the administration dashboard.

---

## 6. Major System Modules

### 6.1 Authentication and Authorization
Provides secure access to the application through role-based authentication. The system distinguishes between students, drivers, and administrators and provides access according to their respective roles.

### 6.2 Student Management
Maintains student-related information and provides students with access to their transportation details, assigned routes, schedules, and tracking facilities.

### 6.3 Driver Management
Handles driver information, authentication, assigned transportation details, and trip-related operations.

### 6.4 Bus Management
Maintains bus information and supports the administration of the college transportation fleet.

### 6.5 Route and Stop Management
Provides facilities to manage transportation routes, boarding points, and associated stop information.

### 6.6 Schedule Management
Maintains bus schedules and provides transportation timing information to students and drivers.

### 6.7 Live Bus Tracking
Allows users to monitor bus movement through the live tracking interface. The driver's device provides geographical location information, which is processed by the backend and made available to the frontend for visualization.

---

## 7. Database Design

SmartBus uses a relational database to organize and maintain transportation-related information.

The database is designed around the following major entities:

1. **Users** – Stores authentication details, roles, and common user information.
2. **Students** – Maintains student-specific academic and transportation details.
3. **Drivers** – Stores driver information and professional details.
4. **Buses** – Maintains bus numbers, registration details, and vehicle information.
5. **Routes** – Stores transportation route information.
6. **Stops** – Maintains bus stop details and geographical information.
7. **Route Stops** – Establishes the relationship between routes and their respective stops.
8. **Schedules** – Stores bus schedules and associated transportation details.
9. **Trips** – Maintains information about individual bus journeys and their statuses.
10. **Trip Locations** – Stores geographical location records associated with bus trips.

The database supports the storage, retrieval, and management of information required by the different application modules.

---

## 8. Advantages

- Centralized management of college transportation activities.
- Improved accessibility to bus schedules and route information.
- Role-based access for students, drivers, and administrators.
- Better coordination between transportation stakeholders.
- Live visibility of active bus locations.
- Simplified management of buses, routes, stops, and schedules.
- Reduced dependency on manual transportation information management.
- Accessible through a web browser without requiring a dedicated desktop application.

---

## 9. Deployment Details

The SmartBus application is deployed using cloud hosting services.

| Component | Platform | Deployment |
|---|---|---|
| Frontend | Vercel | Live |
| Backend | Render | Live |
| Database | MySQL | Configured for application use |

### Application Links

- **Live Application:** https://college-bus-system.vercel.app/
- **Backend Health Check:** https://smartbus-backend-aefe.onrender.com/api/health
- **GitHub Repository:** https://github.com/JayashreeKJ/COLLEGE-BUS-SYSTEM

The backend health endpoint can be used to verify whether the deployed backend service is responding.

**Deployment Note:** The backend is hosted on Render's free service tier. The service may enter a sleep state after a period of inactivity, resulting in a delay when the next request wakes it.

---

## 10. Installation and Setup

Follow these instructions to run the project locally.

### Prerequisites

Ensure that the following software is installed:

- Node.js and npm
- Java Development Kit (JDK 21)
- Maven
- MySQL Server
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/JayashreeKJ/COLLEGE-BUS-SYSTEM.git
```

```bash
cd COLLEGE-BUS-SYSTEM
```

### Step 2: Configure the Database

- Start the MySQL server.
- Create the database required by the backend.
- Configure the database connection details in the backend application configuration.
- Ensure that the backend has the required database credentials.

### Step 3: Run the Backend

Navigate to the backend directory:

```bash
cd backend
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

### Step 4: Run the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

---

## 11. Future Enhancements

Although the core SmartBus application has been implemented and deployed, the following enhancements can be considered for future development:

- Push notifications for bus arrival and schedule updates.
- Advanced route optimization.
- Automated attendance management using bus boarding information.
- Predictive arrival-time estimation using historical transportation data.
- Enhanced analytics and transportation reports for administrators.
- Dedicated mobile application for students and drivers.
- Improved tracking and monitoring capabilities.

---

## 12. Conclusion

SmartBus provides a centralized and web-based solution for managing college transportation activities. By integrating student management, driver management, bus administration, route scheduling, and live bus tracking, the system simplifies transportation operations and improves information accessibility.

The application demonstrates the practical implementation of modern web technologies, RESTful backend services, relational database management, authentication mechanisms, and cloud deployment.

SmartBus serves as a step towards a more organized, accessible, and technology-driven college transportation management system.

---

## 13. Project Repository

**Project Name:** SmartBus – College Bus Management & Tracking System

**Repository:** [COLLEGE-BUS-SYSTEM](https://github.com/JayashreeKJ/COLLEGE-BUS-SYSTEM)

**Live Application:** [SmartBus Web Application](https://college-bus-system.vercel.app/)

**Backend Service:** [SmartBus Backend API](https://smartbus-backend-aefe.onrender.com)
