import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { SEEDED_COIMBATORE_STOPS, DEFAULT_PICKUP_STOP_ID, COLLEGE_INFO } from '../data/coimbatoreRouteData';
import { BUS_FLEET, INITIAL_NOTIFICATIONS } from '../data/busFleetData';
import { checkBackendHealth } from '../services/healthService';

const SimulationContext = createContext(null);

export const SimulationProvider = ({ children }) => {
  // Persistence helpers
  const [selectedPickupStopId, setSelectedPickupStopIdState] = useState(() => {
    return localStorage.getItem('smartbus_pickup_stop_id') || DEFAULT_PICKUP_STOP_ID;
  });

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
  const [progressIndex, setProgressIndex] = useState(4.2); // Start near Singanallur/Gandhipuram corridor
  const [speedKmh, setSpeedKmh] = useState(34);
  const [lastSyncTime, setLastSyncTime] = useState(Date.now());
  const [backendOnline, setBackendOnline] = useState(false);
  const [backendPing, setBackendPing] = useState(null);

  // Active bus
  const activeBus = BUS_FLEET[0]; // Bus 12
  const stops = SEEDED_COIMBATORE_STOPS;

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
            message: `Bus 12 has reached ${reachedStop.name} (Stop #${reachedStop.sequence}). Next stop: ${
              stops[nextFloor + 1]?.name || 'SIET Campus'
            }.`,
            type: reachedStop.id === selectedPickupStopId ? 'warning' : 'info'
          });
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier, stops, selectedPickupStopId, addNotification]);

  // Compute interpolated GPS coordinates
  const floorIdx = Math.floor(progressIndex);
  const ceilIdx = Math.min(floorIdx + 1, stops.length - 1);
  const fraction = progressIndex - floorIdx;

  const currentStop = stops[floorIdx] || stops[0];
  const nextStop = stops[ceilIdx] || stops[stops.length - 1];

  const currentLat = currentStop.lat + (nextStop.lat - currentStop.lat) * fraction;
  const currentLng = currentStop.lng + (nextStop.lng - currentStop.lng) * fraction;

  // Selected pickup stop object
  const selectedPickupStop = stops.find((s) => s.id === selectedPickupStopId) || stops[4]; // Singanallur default
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
  const progressPercent = Math.min(100, Math.max(0, (progressIndex / (totalStops - 1)) * 100));
  const totalRouteKm = 45.2;
  const distanceTravelledKm = ((progressIndex / (totalStops - 1)) * totalRouteKm).toFixed(1);
  const distanceRemainingKm = Math.max(0, totalRouteKm - distanceTravelledKm).toFixed(1);

  // Controls
  const togglePlay = () => setIsPlaying((p) => !p);
  const resetSimulation = () => {
    setProgressIndex(0);
    setSpeedKmh(34);
    addNotification({
      title: 'Simulation Reset',
      message: 'Bus position reset to Pappampatti Pirivu (Stop 1).',
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
    // Stops and College Data
    stops,
    collegeInfo: COLLEGE_INFO,
    activeBus,
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
