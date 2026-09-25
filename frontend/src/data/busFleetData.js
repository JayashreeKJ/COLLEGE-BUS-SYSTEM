// Bus Fleet, Drivers and Schedule Dataset for Sri Shakthi Institute of Engineering & Technology (SIET)

export const BUS_FLEET = [
  {
    id: "BUS-12",
    busNumber: "TN 38 XX 1234",
    name: "Bus 12 (Express Corridor)",
    routeId: "ROUTE-01",
    routeName: "Pappampatti Pirivu → Gandhipuram → SIET Campus",
    capacity: 42,
    occupancy: 31,
    status: "LIVE", // LIVE | SCHEDULED | MAINTENANCE | COMPLETED
    speed: 34,
    fuelLevel: "78%",
    driver: {
      id: "DRV-01",
      name: "R. Kumar",
      phone: "+91 98432 76543",
      experience: "8 years at SIET",
      rating: 4.9,
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      status: "On Route",
      licenseNo: "TN38-2015-009823"
    },
    gpsStatus: "ACTIVE",
    lastMaintenance: "2026-09-10",
    model: "Ashok Leyland Viking BS-VI",
    ac: true,
    features: ["GPS Telemetry", "CCTV Surveillance", "Speed Governor (40km/h)", "First Aid Kit", "Emergency Exit"]
  },
  {
    id: "BUS-04",
    busNumber: "TN 38 Y 5678",
    name: "Bus 04 (Saravanampatti Line)",
    routeId: "ROUTE-02",
    routeName: "Saravanampatti → Keeranatham → SIET Campus",
    capacity: 48,
    occupancy: 42,
    status: "LIVE",
    speed: 28,
    fuelLevel: "82%",
    driver: {
      id: "DRV-02",
      name: "M. Selvam",
      phone: "+91 97890 12345",
      experience: "6 years at SIET",
      rating: 4.8,
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      status: "On Route",
      licenseNo: "TN38-2018-004456"
    },
    gpsStatus: "ACTIVE",
    lastMaintenance: "2026-09-15",
    model: "Tata Starbus Ultra",
    ac: false,
    features: ["GPS Telemetry", "CCTV Surveillance", "First Aid Kit"]
  },
  {
    id: "BUS-07",
    busNumber: "TN 38 Z 9912",
    name: "Bus 07 (Pollachi Highway)",
    routeId: "ROUTE-03",
    routeName: "Eachanari → Sundarapuram → Singanallur → SIET Campus",
    capacity: 52,
    occupancy: 45,
    status: "LIVE",
    speed: 38,
    fuelLevel: "65%",
    driver: {
      id: "DRV-03",
      name: "K. Ramesh",
      phone: "+91 94432 98765",
      experience: "11 years at SIET",
      rating: 5.0,
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      status: "On Route",
      licenseNo: "TN38-2012-001290"
    },
    gpsStatus: "ACTIVE",
    lastMaintenance: "2026-09-02",
    model: "Ashok Leyland Sunshine",
    ac: true,
    features: ["GPS Telemetry", "CCTV Surveillance", "Speed Governor (40km/h)"]
  },
  {
    id: "BUS-18",
    busNumber: "TN 38 AB 4321",
    name: "Bus 18 (Tiruppur Express)",
    routeId: "ROUTE-04",
    routeName: "Tiruppur Old Bus Stand → Avinashi → SIET Campus",
    capacity: 45,
    occupancy: 38,
    status: "SCHEDULED",
    speed: 0,
    fuelLevel: "90%",
    driver: {
      id: "DRV-04",
      name: "S. Balaji",
      phone: "+91 99944 55667",
      experience: "5 years at SIET",
      rating: 4.7,
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      status: "Standby",
      licenseNo: "TN39-2019-007812"
    },
    gpsStatus: "STANDBY",
    lastMaintenance: "2026-09-18",
    model: "Eicher Skyline Pro",
    ac: true,
    features: ["GPS Telemetry", "CCTV Surveillance", "First Aid Kit"]
  },
  {
    id: "BUS-22",
    busNumber: "TN 38 AC 8765",
    name: "Bus 22 (Mettupalayam Line)",
    routeId: "ROUTE-05",
    routeName: "Mettupalayam → Karamadai → Thudiyalur → SIET Campus",
    capacity: 50,
    occupancy: 46,
    status: "LIVE",
    speed: 31,
    fuelLevel: "70%",
    driver: {
      id: "DRV-05",
      name: "P. Murugan",
      phone: "+91 98421 88990",
      experience: "9 years at SIET",
      rating: 4.9,
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
      status: "On Route",
      licenseNo: "TN38-2014-003321"
    },
    gpsStatus: "ACTIVE",
    lastMaintenance: "2026-09-08",
    model: "Ashok Leyland Viking BS-VI",
    ac: true,
    features: ["GPS Telemetry", "CCTV Surveillance", "Speed Governor (40km/h)"]
  }
];

export const SCHEDULES = [
  {
    id: "SCHED-M01",
    busId: "BUS-12",
    busNumber: "Bus 12",
    route: "Coimbatore Corridor → SIET Campus",
    shift: "Morning Pickup",
    departureTime: "06:20 AM",
    arrivalTime: "08:13 AM",
    status: "Running",
    type: "Morning"
  },
  {
    id: "SCHED-M02",
    busId: "BUS-04",
    busNumber: "Bus 04",
    route: "Saravanampatti → SIET Campus",
    shift: "Morning Pickup",
    departureTime: "06:45 AM",
    arrivalTime: "08:10 AM",
    status: "Running",
    type: "Morning"
  },
  {
    id: "SCHED-M03",
    busId: "BUS-07",
    busNumber: "Bus 07",
    route: "Pollachi Highway / Eachanari → SIET Campus",
    shift: "Morning Pickup",
    departureTime: "06:30 AM",
    arrivalTime: "08:15 AM",
    status: "Running",
    type: "Morning"
  },
  {
    id: "SCHED-A01",
    busId: "BUS-12",
    busNumber: "Bus 12",
    route: "SIET Campus → Coimbatore Gandhipuram",
    shift: "Special Exam Shift",
    departureTime: "01:30 PM",
    arrivalTime: "03:00 PM",
    status: "Scheduled",
    type: "Afternoon"
  },
  {
    id: "SCHED-E01",
    busId: "BUS-12",
    busNumber: "Bus 12",
    route: "SIET Campus → All City Stops (Return)",
    shift: "Evening Drop-off",
    departureTime: "04:45 PM",
    arrivalTime: "06:35 PM",
    status: "Scheduled",
    type: "Evening"
  },
  {
    id: "SCHED-E02",
    busId: "BUS-04",
    busNumber: "Bus 04",
    route: "SIET Campus → Saravanampatti Return",
    shift: "Evening Drop-off",
    departureTime: "04:45 PM",
    arrivalTime: "06:10 PM",
    status: "Scheduled",
    type: "Evening"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Trip Commenced",
    message: "Bus 12 departed from origin Pappampatti Pirivu on schedule at 6:20 AM.",
    time: "25 min ago",
    type: "info",
    read: false
  },
  {
    id: "notif-2",
    title: "Approaching Singanallur",
    message: "Bus 12 is 3 minutes away from Singanallur junction.",
    time: "10 min ago",
    type: "warning",
    read: false
  },
  {
    id: "notif-3",
    title: "Live GPS Calibrated",
    message: "High-precision satellite telemetry active at 34 km/h corridor speed.",
    time: "4 min ago",
    type: "success",
    read: true
  }
];
