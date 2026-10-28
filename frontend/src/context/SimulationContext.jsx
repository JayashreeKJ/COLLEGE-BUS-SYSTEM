import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { SEEDED_COIMBATORE_STOPS, DEFAULT_PICKUP_STOP_ID, COLLEGE_INFO, getBusRoute } from '../data/coimbatoreRouteData';
import { BUS_FLEET, INITIAL_NOTIFICATIONS } from '../data/busFleetData';
import { checkBackendHealth } from '../services/healthService';

const SimulationContext = createContext(null);

export const SimulationProvider = ({ children }) => {
  // Bus selection state: check URL search params first, then localStorage, defaulting to BUS-12
  const [selectedBusId, setSelectedBusIdState] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlBus = params.get('bus') || params.get('busId');
      if (urlBus) {
        const found = BUS_FLEET.find((b) => b.id.toLowerCase() === urlBus.toLowerCase() || b.busNumber.toLowerCase().includes(urlBus.toLowerCase()));
        if (found) return found.id;
        const numMatch = urlBus.match(/\d+/);
        if (numMatch) {
          const num = parseInt(numMatch[0], 10);
          const padded = `BUS-${num < 10 ? '0' + num : num}`;
          const match = BUS_FLEET.find((b) => b.id === padded || b.id === `BUS-${num}`);
          if (match) return match.id;
        }
      }
    } catch {
      // ignore
    }
    return localStorage.getItem('smartbus_selected_bus_id') || 'BUS-12';
  });

  // Driver overrides state persisted in localStorage
  const [driverOverrides, setDriverOverrides] = useState(() => {
    try {
      const saved = localStorage.getItem('smartbus_driver_overrides');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const handleDriverUpdated = () => {
      try {
        const saved = localStorage.getItem('smartbus_driver_overrides');
        setDriverOverrides(saved ? JSON.parse(saved) : {});
      } catch {
        // ignore
      }
    };
    window.addEventListener('smartbus_driver_updated', handleDriverUpdated);
    return () => window.removeEventListener('smartbus_driver_updated', handleDriverUpdated);
  }, []);

  const updateDriverProfileOverride = useCallback((driverId, { name, photo }) => {
    setDriverOverrides((prev) => {
      const updated = {
        ...prev,
        [driverId]: {
          ...(prev[driverId] || {}),
          ...(name !== undefined ? { name } : {}),
          ...(photo !== undefined ? { photo } : {}),
        }
      };
      localStorage.setItem('smartbus_driver_overrides', JSON.stringify(updated));
      return updated;
    });
    window.dispatchEvent(new CustomEvent('smartbus_driver_updated', { detail: { driverId, name, photo } }));
  }, []);

  // Compute fleet with overrides
  const fleet = useMemo(() => {
    return BUS_FLEET.map((bus) => {
      if (bus.driver && driverOverrides[bus.driver.id]) {
        const override = driverOverrides[bus.driver.id];
        return {
          ...bus,
          driver: {
            ...bus.driver,
            name: override.name !== undefined ? override.name : bus.driver.name,
            photo: override.photo !== undefined ? override.photo : bus.driver.photo,
          }
        };
      }
      return bus;
    });
  }, [driverOverrides]);

  // Active bus record
  const activeBus = useMemo(() => {
    return fleet.find((b) => b.id === selectedBusId) ||
           fleet.find((b) => b.id === 'BUS-12') ||
           fleet[0];
  }, [fleet, selectedBusId]);

  // Stops for the active bus
  const stops = useMemo(() => {
    return getBusRoute(activeBus.id);
  }, [activeBus.id]);

  // Persistence helpers for pickup stop
  const [selectedPickupStopId, setSelectedPickupStopIdState] = useState(() => {
    const saved = localStorage.getItem('smartbus_pickup_stop_id');
    return saved || DEFAULT_PICKUP_STOP_ID;
  });

  // Ensure pickup stop belongs to current bus route; fallback to realistic stop if not
  useEffect(() => {
    if (stops && stops.length > 0) {
      const exists = stops.some((s) => s.id === selectedPickupStopId);
      if (!exists) {
        // Pick intermediate stop if available, or first stop
        const fallbackIdx = Math.min(2, Math.max(0, stops.length - 2));
        setSelectedPickupStopIdState(stops[fallbackIdx].id);
      }
    }
  }, [stops, selectedPickupStopId]);

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('smartbus_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Simulation controls state
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 1x, 2x, 5x, 10x
  // Start near initial segment of route
  const [progressIndex, setProgressIndex] = useState(() => {
    return Math.min(2.1, Math.max(0, (getBusRoute('BUS-12').length - 1) * 0.2));
  });
  const [speedKmh, setSpeedKmh] = useState(34);
  const [lastSyncTime, setLastSyncTime] = useState(Date.now());
  const [backendOnline, setBackendOnline] = useState(false);
  const [backendPing, setBackendPing] = useState(null);

  // Switch active bus function
  const setSelectedBusId = useCallback((busId) => {
    const found = BUS_FLEET.find((b) => b.id === busId || b.id.toLowerCase() === String(busId).toLowerCase());
    if (!found) return;

    setSelectedBusIdState(found.id);
    localStorage.setItem('smartbus_selected_bus_id', found.id);

    const busStops = getBusRoute(found.id);
    // Position simulation on new route
    const newProgress = Math.min(1.8, Math.max(0, (busStops.length - 1) * 0.25));
    setProgressIndex(newProgress);
    setSpeedKmh(found.speed || 32);

    // Pick a default pickup stop for this new bus
    const defaultIdx = Math.min(2, Math.max(0, busStops.length - 2));
    if (busStops[defaultIdx]) {
      setSelectedPickupStopIdState(busStops[defaultIdx].id);
      localStorage.setItem('smartbus_pickup_stop_id', busStops[defaultIdx].id);
    }

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: `Selected ${found.name}`,
        message: `Loaded independent corridor with ${busStops.length} stops (${found.routeName}).`,
        time: 'Just now',
        type: 'info',
        read: false,
        timestamp: Date.now()
      },
      ...prev.slice(0, 19)
    ]);
  }, []);

  // Listen for URL changes with ?bus=... parameter
  useEffect(() => {
    const checkUrlParam = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlBus = params.get('bus') || params.get('busId');
        if (urlBus) {
          const found = BUS_FLEET.find((b) => b.id.toLowerCase() === urlBus.toLowerCase() || b.busNumber.toLowerCase().includes(urlBus.toLowerCase()));
          if (found && found.id !== selectedBusId) {
            setSelectedBusId(found.id);
          } else {
            const numMatch = urlBus.match(/\d+/);
            if (numMatch) {
              const num = parseInt(numMatch[0], 10);
              const padded = `BUS-${num < 10 ? '0' + num : num}`;
              const match = BUS_FLEET.find((b) => b.id === padded || b.id === `BUS-${num}`);
              if (match && match.id !== selectedBusId) {
                setSelectedBusId(match.id);
              }
            }
          }
        }
      } catch {
        // ignore
      }
    };
    checkUrlParam();
  }, [selectedBusId, setSelectedBusId]);

  // Persist notifications
  useEffect(() => {
    localStorage.setItem('smartbus_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Check Backend Live Status periodically
  useEffect(() => {
    const verifyApi = async () => {
      const start = Date.now();
      const res = await checkBackendHealth();
      const elapsed = Date.now() - start;
      setBackendOnline(res.success);
      setBackendPing(res.success ? elapsed : null);
    };
    verifyApi();
    const interval = setInterval(verifyApi, 15000);
    return () => clearInterval(interval);
  }, []);

  // Update pickup stop with persistence
  const setSelectedPickupStopId = useCallback((stopId) => {
    setSelectedPickupStopIdState(stopId);
    localStorage.setItem('smartbus_pickup_stop_id', stopId);
    const stopObj = stops.find((s) => s.id === stopId);
    if (stopObj) {
      addNotification({
        title: 'Pickup Stop Selected',
        message: `Your preferred morning pickup stop is set to ${stopObj.name} (${stopObj.scheduledTime}).`,
        type: 'info'
      });
    }
  }, [stops]);

  // Add a dynamic notification
  const addNotification = useCallback((notif) => {
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: notif.title || 'Bus Alert',
        message: notif.message || '',
        time: 'Just now',
        type: notif.type || 'info',
        read: false,
        timestamp: Date.now()
      },
      ...prev.slice(0, 19) // keep latest 20
    ]);
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Simulation tick loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgressIndex((prev) => {
        const step = 0.05 * speedMultiplier;
        let next = prev + step;
        if (next >= stops.length - 1) {
          next = stops.length - 1;
        }

        // Randomize speed slightly for realistic HUD
        const currentSpeed = next >= stops.length - 1 ? 0 : Math.floor(28 + Math.sin(next * 5) * 8 + Math.random() * 4);
        setSpeedKmh(currentSpeed);
        setLastSyncTime(Date.now());

        // Check if crossed a stop threshold for notifications
        const prevFloor = Math.floor(prev);
        const nextFloor = Math.floor(next);
        if (nextFloor > prevFloor && nextFloor < stops.length) {
          const reachedStop = stops[nextFloor];
          addNotification({
            title: `Arrived at ${reachedStop.name}`,
            message: `${activeBus.name} reached ${reachedStop.name} (Stop #${reachedStop.sequence}). Next: ${
              stops[nextFloor + 1]?.name || 'SIET Campus'
            }.`,
            type: reachedStop.id === selectedPickupStopId ? 'warning' : 'info'
          });
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier, stops, selectedPickupStopId, addNotification, activeBus.name]);

  // Compute interpolated GPS coordinates
  const floorIdx = Math.floor(progressIndex);
  const ceilIdx = Math.min(floorIdx + 1, stops.length - 1);
  const fraction = progressIndex - floorIdx;

  const currentStop = stops[floorIdx] || stops[0];
  const nextStop = stops[ceilIdx] || stops[stops.length - 1];

  const currentLat = currentStop ? currentStop.lat + (nextStop.lat - currentStop.lat) * fraction : COLLEGE_INFO.coordinates.lat;
  const currentLng = currentStop ? currentStop.lng + (nextStop.lng - currentStop.lng) * fraction : COLLEGE_INFO.coordinates.lng;

  // Selected pickup stop object
  const selectedPickupStop = stops.find((s) => s.id === selectedPickupStopId) || stops[Math.min(2, stops.length - 1)] || stops[0];
  const pickupStopIndex = stops.findIndex((s) => s.id === selectedPickupStopId);

  // Dynamic ETA calculations
  const totalStops = stops.length;
  const stopsRemainingToDestination = Math.max(0, totalStops - 1 - progressIndex);
  const etaMinutesToDestination = Math.max(1, Math.round(stopsRemainingToDestination * 3.2));

  // ETA to student's pickup stop
  let etaMinutesToPickup = 0;
  let pickupStatus = 'UPCOMING'; // COMPLETED | CURRENT | UPCOMING

  if (pickupStopIndex !== -1) {
    if (progressIndex >= pickupStopIndex + 0.1) {
      pickupStatus = 'PASSED';
      etaMinutesToPickup = 0;
    } else if (Math.abs(progressIndex - pickupStopIndex) < 0.15) {
      pickupStatus = 'ARRIVING';
      etaMinutesToPickup = 1;
    } else {
      pickupStatus = 'UPCOMING';
      const stopsUntilPickup = Math.max(0, pickupStopIndex - progressIndex);
      etaMinutesToPickup = Math.max(1, Math.round(stopsUntilPickup * 3.2));
    }
  }

  // Distance calculations
  const progressPercent = Math.min(100, Math.max(0, (progressIndex / Math.max(1, totalStops - 1)) * 100));
  const totalRouteKm = useMemo(() => {
    if (!stops || stops.length === 0) return 30.0;
    const last = stops[stops.length - 1];
    if (last && last.distanceFromStart) {
      const parsed = parseFloat(last.distanceFromStart);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 35.0;
  }, [stops]);

  const distanceTravelledKm = ((progressIndex / Math.max(1, totalStops - 1)) * totalRouteKm).toFixed(1);
  const distanceRemainingKm = Math.max(0, totalRouteKm - distanceTravelledKm).toFixed(1);

  // Controls
  const togglePlay = () => setIsPlaying((p) => !p);
  const resetSimulation = () => {
    setProgressIndex(0);
    setSpeedKmh(34);
    addNotification({
      title: 'Simulation Reset',
      message: `${activeBus.name} position reset to origin (${stops[0]?.name || 'Stop 1'}).`,
      type: 'info'
    });
  };
  const stepForward = () => {
    setProgressIndex((prev) => Math.min(stops.length - 1, prev + 1));
  };
  const jumpToStop = (index) => {
    setProgressIndex(Math.max(0, Math.min(stops.length - 1, index)));
  };

  const value = {
    // Bus Selection & Fleet
    availableBuses: fleet,
    selectedBusId,
    setSelectedBusId,
    activeBus,
    driverOverrides,
    updateDriverProfileOverride,
    // Stops and College Data
    stops,
    collegeInfo: COLLEGE_INFO,
    totalRouteKm,
    // Simulation Live States
    isPlaying,
    speedMultiplier,
    setSpeedMultiplier,
    progressIndex,
    progressPercent,
    currentLocation: {
      lat: currentLat,
      lng: currentLng,
      speed: speedKmh,
      timestamp: lastSyncTime
    },
    currentStop,
    nextStop,
    etaMinutesToDestination,
    distanceTravelledKm,
    distanceRemainingKm,
    // Student Pickup Stop
    selectedPickupStopId,
    selectedPickupStop,
    pickupStopIndex,
    pickupStatus,
    etaMinutesToPickup,
    setSelectedPickupStopId,
    // Notifications
    notifications,
    addNotification,
    markAllNotificationsRead,
    clearNotifications,
    // Controls
    togglePlay,
    resetSimulation,
    stepForward,
    jumpToStop,
    // Backend Status
    backendOnline,
    backendPing
  };

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
