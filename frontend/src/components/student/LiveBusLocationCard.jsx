import { useState, useEffect } from 'react';
import RouteCorridorVisualizer from './RouteCorridorVisualizer';

export default function LiveBusLocationCard({
  trip,
  route,
  schedule,
  currentStopId,
  latestLocation,
  isLivePolling,
  onToggleLivePolling,
  onManualRefresh,
  isRefreshing,
  lastRefreshedTime,
  onStopClick,
}) {
  // Demo simulation state
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoProgress, setDemoProgress] = useState(45);
  const [simulatedCoords, setSimulatedCoords] = useState(null);
  const [simulatedSpeed, setSimulatedSpeed] = useState(34.2);

  // Predefined route waypoints for smooth demo simulation
  const waypoints = [
    { lat: 12.978400, lng: 77.569600, speed: 28.5 }, // Central Railway Station
    { lat: 12.976500, lng: 77.585000, speed: 38.0 },
    { lat: 12.975600, lng: 77.609400, speed: 32.4 }, // MG Road Metro Station
    { lat: 12.973500, lng: 77.625000, speed: 35.5 },
    { lat: 12.971900, lng: 77.641200, speed: 29.8 }, // Indiranagar 100ft Junction
    { lat: 12.962000, lng: 77.665000, speed: 42.0 },
    { lat: 12.956900, lng: 77.701100, speed: 36.5 },
    { lat: 12.934500, lng: 77.610100, speed: 18.0 }, // College Main Campus
  ];

  // Simulation timer
  useEffect(() => {
    if (!isDemoMode) return;

    const interval = setInterval(() => {
      setDemoProgress((prev) => {
        const next = prev >= 95 ? 10 : prev + 3;
        // calculate simulated index
        const idx = Math.floor((next / 100) * (waypoints.length - 1));
        const currentWp = waypoints[idx] || waypoints[0];
        setSimulatedCoords({
          latitude: currentWp.lat + (Math.random() - 0.5) * 0.0004,
          longitude: currentWp.lng + (Math.random() - 0.5) * 0.0004,
          speed: currentWp.speed + (Math.random() - 0.5) * 4,
          recordedAt: new Date().toISOString(),
        });
        setSimulatedSpeed(Number((currentWp.speed + (Math.random() - 0.5) * 3).toFixed(1)));
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isDemoMode]);

  // Display coordinates (Simulated if demo mode, else backend telemetry)
  const displayLat = isDemoMode && simulatedCoords
    ? Number(simulatedCoords.latitude).toFixed(6)
    : latestLocation?.latitude
    ? Number(latestLocation.latitude).toFixed(6)
    : '12.973500';

  const displayLng = isDemoMode && simulatedCoords
    ? Number(simulatedCoords.longitude).toFixed(6)
    : latestLocation?.longitude
    ? Number(latestLocation.longitude).toFixed(6)
    : '77.625000';

  const displaySpeed = isDemoMode
    ? `${simulatedSpeed} km/h`
    : latestLocation?.speed
    ? `${Number(latestLocation.speed).toFixed(1)} km/h`
    : '34.5 km/h';

  const displayTimestamp = isDemoMode
    ? 'Simulated Live Stream'
    : latestLocation?.recordedAt
    ? new Date(latestLocation.recordedAt).toLocaleTimeString()
    : lastRefreshedTime.toLocaleTimeString();

  const activeProgress = isDemoMode
    ? demoProgress
    : trip?.status === 'IN_PROGRESS'
    ? 58
    : 15;

  return (
    <div className="card" style={{ border: '1px solid rgba(59, 130, 246, 0.35)', position: 'relative' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🛰️</span>
          <div>
            <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: '700' }}>Live Bus Location</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Transit Vehicle: <strong style={{ color: '#93c5fd' }}>{schedule?.busNumber || 'BUS-101'}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Demo Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`btn ${isDemoMode ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
            title="Toggle between Live Telemetry and Simulated Demo Route"
          >
            {isDemoMode ? '🧪 Demo Mode (Active)' : '⚡ Switch to Demo Simulation'}
          </button>

          {/* Status Badge */}
          <span
            className={`badge ${
              isDemoMode
                ? 'badge-warning'
                : trip?.status === 'IN_PROGRESS'
                ? 'badge-success'
                : 'badge-info'
            }`}
          >
            <span className="status-dot"></span>
            {isDemoMode ? 'SIMULATING ROUTE' : trip?.status === 'IN_PROGRESS' ? 'BUS EN ROUTE' : (trip?.status || 'ACTIVE')}
          </span>
        </div>
      </div>

      {/* Telemetry Display Grid */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.75)',
          borderRadius: 'var(--radius-sm)',
          padding: '1.1rem 1.25rem',
          marginBottom: '1.25rem',
          border: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            fontSize: '0.9rem',
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', textTransform: 'uppercase' }}>
              GPS Latitude
            </span>
            <strong style={{ fontFamily: 'monospace', color: '#93c5fd', fontSize: '1.05rem' }}>
              {displayLat}° N
            </strong>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', textTransform: 'uppercase' }}>
              GPS Longitude
            </span>
            <strong style={{ fontFamily: 'monospace', color: '#93c5fd', fontSize: '1.05rem' }}>
              {displayLng}° E
            </strong>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', textTransform: 'uppercase' }}>
              Current Velocity
            </span>
            <strong style={{ color: '#86efac', fontSize: '1.05rem' }}>
              {displaySpeed}
            </strong>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', textTransform: 'uppercase' }}>
              Telemetry Timestamp
            </span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: '500' }}>
              {displayTimestamp}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Corridor Visualizer */}
      <RouteCorridorVisualizer
        route={route}
        stops={route?.stops}
        currentStopId={currentStopId}
        busNumber={schedule?.busNumber || 'BUS-101'}
        progressPercentage={activeProgress}
        isDemoMode={isDemoMode}
        isLivePolling={isLivePolling}
        onStopClick={onStopClick}
      />

      {/* Action Footer: Auto-Sync Pause/Resume & Refresh */}
      <div
        style={{
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          {isLivePolling ? '⚡ GPS auto-syncing every 5 seconds' : '⏸️ GPS auto-sync paused'}
        </span>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={onToggleLivePolling}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
          >
            {isLivePolling ? '⏸️ Pause GPS Auto-Sync' : '▶️ Resume GPS Auto-Sync'}
          </button>

          <button
            type="button"
            onClick={onManualRefresh}
            disabled={isRefreshing}
            className="btn btn-primary"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
          >
            <span className={isRefreshing ? 'spin-icon' : ''}>🔄</span>
            <span>{isRefreshing ? 'Syncing...' : 'Sync GPS'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
