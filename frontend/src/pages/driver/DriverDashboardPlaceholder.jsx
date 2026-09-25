import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function DriverDashboardPlaceholder() {
  const { user } = useAuth();
  const [driverData, setDriverData] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // GPS Broadcaster state
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [simulatedMode, setSimulatedMode] = useState(true);
  const [lastSentCoords, setLastSentCoords] = useState(null);
  const [gpsError, setGpsError] = useState('');
  const [transmitCount, setTransmitCount] = useState(0);

  const watchIdRef = useRef(null);
  const simStepRef = useRef(0);

  // Demo route path coordinates for simulated broadcast
  const demoRoutePath = [
    { lat: 12.9784, lng: 77.5696, speed: 25.0, heading: 90 },
    { lat: 12.9760, lng: 77.5850, speed: 32.5, heading: 95 },
    { lat: 12.9756, lng: 77.6094, speed: 38.0, heading: 110 },
    { lat: 12.9735, lng: 77.6250, speed: 42.0, heading: 115 },
    { lat: 12.9719, lng: 77.6412, speed: 28.5, heading: 130 },
    { lat: 12.9550, lng: 77.6350, speed: 35.0, heading: 170 },
    { lat: 12.9345, lng: 77.6101, speed: 15.0, heading: 210 },
  ];

  const fetchDriverData = async () => {
    try {
      const res = await api.get('/drivers/me');
      if (res.data && res.data.success) {
        setDriverData(res.data.data);
        setCurrentTrip(res.data.data.currentTrip || null);
        if (res.data.data.currentTrip?.latestLocation) {
          setLastSentCoords({
            latitude: res.data.data.currentTrip.latestLocation.latitude,
            longitude: res.data.data.currentTrip.latestLocation.longitude,
            speed: res.data.data.currentTrip.latestLocation.speed,
            time: res.data.data.currentTrip.latestLocation.recordedAt,
          });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch driver profile and trip assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverData();
  }, []);

  const handleStartTrip = async () => {
    if (!currentTrip?.id) return;
    setActionLoading(true);
    setError('');
    try {
      const res = await api.post(`/trips/${currentTrip.id}/start`);
      if (res.data && res.data.success) {
        setCurrentTrip(res.data.data);
        setSuccessMsg('Trip started! Bus is now marked IN_PROGRESS.');
        setIsBroadcasting(true); // Automatically turn on GPS broadcaster
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start trip');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndTrip = async () => {
    if (!currentTrip?.id) return;
    setActionLoading(true);
    setError('');
    try {
      const res = await api.post(`/trips/${currentTrip.id}/end`);
      if (res.data && res.data.success) {
        setCurrentTrip(res.data.data);
        setSuccessMsg('Trip ended successfully! Status updated to COMPLETED.');
        setIsBroadcasting(false); // Turn off GPS broadcast
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to end trip');
    } finally {
      setActionLoading(false);
    }
  };

  // Broadcast GPS location to backend API
  const sendLocationUpdate = async (latitude, longitude, speed = 30.0, heading = 90.0, accuracy = 5.0) => {
    if (!currentTrip?.id) return;
    try {
      const payload = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        accuracy: parseFloat(accuracy),
        speed: parseFloat(speed),
        heading: parseFloat(heading),
      };
      const res = await api.post(`/trips/${currentTrip.id}/location`, payload);
      if (res.data && res.data.success) {
        setLastSentCoords({
          latitude,
          longitude,
          speed,
          time: new Date().toISOString(),
        });
        setTransmitCount((prev) => prev + 1);
        setGpsError('');
      }
    } catch (err) {
      setGpsError(err.response?.data?.message || 'Failed to send location packet to server');
    }
  };

  // Broadcasting loop / geolocation tracker
  useEffect(() => {
    let intervalId = null;

    if (isBroadcasting && currentTrip?.status === 'IN_PROGRESS') {
      if (simulatedMode) {
        // Simulated GPS step mode for demos & presentation
        intervalId = setInterval(() => {
          const point = demoRoutePath[simStepRef.current % demoRoutePath.length];
          simStepRef.current += 1;
          sendLocationUpdate(point.lat, point.lng, point.speed, point.heading, 4.5);
        }, 4000);
      } else {
        // Real browser Geolocation API
        if ('geolocation' in navigator) {
          watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
              sendLocationUpdate(
                pos.coords.latitude,
                pos.coords.longitude,
                pos.coords.speed ? (pos.coords.speed * 3.6).toFixed(1) : 30.0,
                pos.coords.heading || 0,
                pos.coords.accuracy
              );
            },
            (err) => {
              setGpsError(`Geolocation error: ${err.message}. Falling back to simulation mode.`);
              setSimulatedMode(true);
            },
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
          );
        } else {
          setGpsError('Browser does not support Geolocation API. Switching to simulation mode.');
          setSimulatedMode(true);
        }
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (watchIdRef.current !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isBroadcasting, simulatedMode, currentTrip?.id, currentTrip?.status]);

  if (loading) {
    return (
      <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="status-dot" style={{ width: '16px', height: '16px', backgroundColor: 'var(--primary)', margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading driver assignment and transit status...</p>
        </div>
      </div>
    );
  }

  const bus = driverData?.assignedBus;
  const route = driverData?.assignedRoute;
  const schedule = driverData?.assignedSchedule;

  return (
    <div className="main-content" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.8rem' }}>🚍</span>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '700', margin: 0 }}>
                Driver Console: {driverData?.name || user?.name}
              </h1>
            </div>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
              License: <span style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>{driverData?.licenseNumber || 'DL-KA01-2015-00458'}</span> •
              Assigned Bus: <span style={{ color: 'var(--accent)', fontWeight: '600' }}>{bus?.busNumber || schedule?.busNumber || 'BUS-101'}</span> •
              Status: <span className={`badge ${driverData?.status === 'ON_TRIP' ? 'badge-success' : 'badge-warning'}`}>{driverData?.status || 'AVAILABLE'}</span>
            </p>
          </div>

          <div>
            <button onClick={fetchDriverData} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.8rem' }}>
              🔄 Refresh Data
            </button>
          </div>
        </div>
      </div>

      {successMsg && (
        <div style={{ padding: '0.85rem 1rem', marginBottom: '1.25rem', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', borderRadius: 'var(--radius-sm)', color: '#86efac' }}>
          ✅ {successMsg}
        </div>
      )}

      {error && (
        <div style={{ padding: '0.85rem 1rem', marginBottom: '1.25rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 'var(--radius-sm)', color: '#fca5a5' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Grid: Trip Controls & GPS Broadcaster */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Active Trip Operations Card */}
        <div className="card" style={{ border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🚀</span> Trip Controls
            </h2>
            <span className={`badge ${currentTrip?.status === 'IN_PROGRESS' ? 'badge-success' : currentTrip?.status === 'COMPLETED' ? 'badge-secondary' : 'badge-warning'}`}>
              <span className="status-dot"></span>
              {currentTrip?.status || 'SCHEDULED'}
            </span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Trip ID</span>
                <p style={{ margin: '0.2rem 0 0', fontWeight: '700' }}>#{currentTrip?.id || 'TRIP-101'}</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Scheduled Time</span>
                <p style={{ margin: '0.2rem 0 0', fontWeight: '600' }}>{schedule?.departureTime || '07:30:00'}</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Route</span>
                <p style={{ margin: '0.2rem 0 0', fontWeight: '600' }}>{route?.routeName || 'North Corridor Express'}</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Vehicle Plate</span>
                <p style={{ margin: '0.2rem 0 0', fontWeight: '600' }}>{bus?.registrationNumber || 'KA-01-EQ-1001'}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleStartTrip}
              disabled={actionLoading || currentTrip?.status === 'IN_PROGRESS'}
              className="btn btn-primary"
              style={{
                flex: 1,
                padding: '0.75rem',
                fontWeight: '700',
                background: currentTrip?.status === 'IN_PROGRESS' ? 'rgba(34, 197, 94, 0.4)' : undefined,
              }}
            >
              {currentTrip?.status === 'IN_PROGRESS' ? '🟢 Trip In Progress' : '▶️ Start Trip'}
            </button>

            <button
              onClick={handleEndTrip}
              disabled={actionLoading || currentTrip?.status !== 'IN_PROGRESS'}
              className="btn"
              style={{
                flex: 1,
                padding: '0.75rem',
                fontWeight: '700',
                background: currentTrip?.status === 'IN_PROGRESS' ? 'rgba(239, 68, 68, 0.8)' : 'var(--bg-glass)',
                color: '#ffffff',
                border: '1px solid var(--border-color)',
                cursor: currentTrip?.status === 'IN_PROGRESS' ? 'pointer' : 'not-allowed',
              }}
            >
              ⏹️ End Trip
            </button>
          </div>
        </div>

        {/* Real-time GPS Telemetry Broadcaster */}
        <div className="card" style={{ border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📡</span> Live GPS Telemetry
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`badge ${isBroadcasting ? 'badge-success' : 'badge-warning'}`}>
                {isBroadcasting ? 'TRANSMITTING' : 'OFFLINE'}
              </span>
            </div>
          </div>

          {gpsError && (
            <div style={{ padding: '0.5rem 0.75rem', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.15)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: '#fca5a5' }}>
              {gpsError}
            </div>
          )}

          {/* Telemetry packet stats */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Transmitted Lat</span>
                <strong style={{ fontFamily: 'monospace', color: '#93c5fd' }}>
                  {lastSentCoords?.latitude ? Number(lastSentCoords.latitude).toFixed(6) : '—'}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Transmitted Lng</span>
                <strong style={{ fontFamily: 'monospace', color: '#93c5fd' }}>
                  {lastSentCoords?.longitude ? Number(lastSentCoords.longitude).toFixed(6) : '—'}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Speed</span>
                <strong style={{ color: '#86efac' }}>
                  {lastSentCoords?.speed ? `${Number(lastSentCoords.speed).toFixed(1)} km/h` : '—'}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Packets Sent</span>
                <strong style={{ color: 'var(--accent)' }}>{transmitCount} pings</strong>
              </div>
            </div>
          </div>

          {/* GPS Broadcast Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Simulation Demo Mode</span>
              <button
                type="button"
                onClick={() => setSimulatedMode(!simulatedMode)}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
              >
                {simulatedMode ? '🟢 Demo Mode ON' : '📱 Device GPS'}
              </button>
            </div>

            <button
              onClick={() => setIsBroadcasting(!isBroadcasting)}
              className={`btn ${isBroadcasting ? 'btn-secondary' : 'btn-primary'}`}
              style={{ padding: '0.65rem', fontWeight: '600' }}
            >
              {isBroadcasting ? '⏸️ Stop GPS Broadcast' : '📡 Start Live GPS Broadcast'}
            </button>
          </div>
        </div>

      </div>

      {/* Assigned Route Stops Detail */}
      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🗺️</span> Assigned Route Stops & Sequence
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            {route?.routeName || 'North Corridor Express'} ({route?.routeCode || 'R-101'})
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Sequence</th>
                <th style={{ padding: '0.75rem' }}>Stop Name</th>
                <th style={{ padding: '0.75rem' }}>Landmark</th>
                <th style={{ padding: '0.75rem' }}>Offset ETA</th>
                <th style={{ padding: '0.75rem' }}>Coordinates</th>
              </tr>
            </thead>
            <tbody>
              {route?.stops && route.stops.length > 0 ? (
                route.stops.map((st) => (
                  <tr key={st.id || st.stopSequence} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '700', color: 'var(--accent)' }}>#{st.stopSequence}</td>
                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>{st.stopName}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{st.landmark || '—'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>+{st.estimatedArrivalOffsetMinutes || 0} min</span>
                    </td>
                    <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      {st.latitude ? Number(st.latitude).toFixed(4) : '—'}, {st.longitude ? Number(st.longitude).toFixed(4) : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No route stops assigned.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
