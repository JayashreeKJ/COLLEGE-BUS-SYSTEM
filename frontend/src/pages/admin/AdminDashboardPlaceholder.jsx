import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardPlaceholder() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('trips');
  const [stats, setStats] = useState({
    totalBuses: 0,
    totalDrivers: 0,
    totalRoutes: 0,
    totalStops: 0,
    totalStudents: 0,
    activeTrips: 0,
    totalTrips: 0,
  });

  const [trips, setTrips] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAllAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, tripsRes, busesRes, routesRes, driversRes, schedulesRes] = await Promise.allSettled([
        api.get('/admin/stats'),
        api.get('/trips'),
        api.get('/buses'),
        api.get('/routes'),
        api.get('/drivers'),
        api.get('/schedules'),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data?.data) {
        setStats(statsRes.value.data.data);
      }
      if (tripsRes.status === 'fulfilled' && tripsRes.value.data?.data) {
        setTrips(tripsRes.value.data.data);
      }
      if (busesRes.status === 'fulfilled' && busesRes.value.data?.data) {
        setBuses(busesRes.value.data.data);
      }
      if (routesRes.status === 'fulfilled' && routesRes.value.data?.data) {
        setRoutes(routesRes.value.data.data);
      }
      if (driversRes.status === 'fulfilled' && driversRes.value.data?.data) {
        setDrivers(driversRes.value.data.data);
      }
      if (schedulesRes.status === 'fulfilled' && schedulesRes.value.data?.data) {
        setSchedules(schedulesRes.value.data.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  return (
    <div className="main-content" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.8rem' }}>⚙️</span>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '700', margin: 0 }}>
                SmartBus Fleet & Operations Control
              </h1>
            </div>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
              Administrator: <strong style={{ color: 'var(--text-main)' }}>{user?.name || 'Campus Admin'}</strong> • College Transit Management
            </p>
          </div>

          <div>
            <button onClick={fetchAllAdminData} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.8rem' }}>
              🔄 Refresh All Fleet Data
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.85rem 1rem', marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 'var(--radius-sm)', color: '#fca5a5' }}>
          ⚠️ {error}
        </div>
      )}

      {/* KPI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary)', padding: '1rem 1.25rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>ACTIVE TRIPS</span>
          <p style={{ fontSize: '1.8rem', fontWeight: '700', margin: '0.25rem 0 0', color: '#86efac' }}>
            {stats.activeTrips || 0}
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent)', padding: '1rem 1.25rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>TOTAL BUSES</span>
          <p style={{ fontSize: '1.8rem', fontWeight: '700', margin: '0.25rem 0 0', color: 'var(--text-main)' }}>
            {stats.totalBuses || 0}
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f59e0b', padding: '1rem 1.25rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>ACTIVE ROUTES</span>
          <p style={{ fontSize: '1.8rem', fontWeight: '700', margin: '0.25rem 0 0', color: 'var(--text-main)' }}>
            {stats.totalRoutes || 0}
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #a855f7', padding: '1rem 1.25rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>DRIVERS</span>
          <p style={{ fontSize: '1.8rem', fontWeight: '700', margin: '0.25rem 0 0', color: 'var(--text-main)' }}>
            {stats.totalDrivers || 0}
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #06b6d4', padding: '1rem 1.25rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>STUDENTS</span>
          <p style={{ fontSize: '1.8rem', fontWeight: '700', margin: '0.25rem 0 0', color: 'var(--text-main)' }}>
            {stats.totalStudents || 0}
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        {[
          { id: 'trips', label: '🛰️ Active Trips & Telemetry' },
          { id: 'buses', label: '🚍 Bus Fleet' },
          { id: 'routes', label: '🗺️ Routes & Stops' },
          { id: 'drivers', label: '👨‍✈️ Driver Directory' },
          { id: 'schedules', label: '⏰ Timetable Schedules' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="btn"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === tab.id ? '600' : '400',
              background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Trips & Telemetry */}
      {activeTab === 'trips' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Active & Scheduled Daily Trips</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{trips.length} Total Trips Recorded</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Trip ID</th>
                  <th style={{ padding: '0.75rem' }}>Bus</th>
                  <th style={{ padding: '0.75rem' }}>Driver</th>
                  <th style={{ padding: '0.75rem' }}>Route</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem' }}>Latest GPS Coordinates</th>
                  <th style={{ padding: '0.75rem' }}>Speed</th>
                </tr>
              </thead>
              <tbody>
                {trips.length > 0 ? (
                  trips.map((tr) => (
                    <tr key={tr.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '700' }}>#{tr.id}</td>
                      <td style={{ padding: '0.75rem', fontWeight: '600', color: 'var(--accent)' }}>{tr.busNumber}</td>
                      <td style={{ padding: '0.75rem' }}>{tr.driverName || '—'}</td>
                      <td style={{ padding: '0.75rem' }}>{tr.routeName}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${tr.status === 'IN_PROGRESS' ? 'badge-success' : tr.status === 'COMPLETED' ? 'badge-secondary' : 'badge-warning'}`}>
                          {tr.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#93c5fd' }}>
                        {tr.latestLocation?.latitude ? `${Number(tr.latestLocation.latitude).toFixed(4)}, ${Number(tr.latestLocation.longitude).toFixed(4)}` : 'No telemetry yet'}
                      </td>
                      <td style={{ padding: '0.75rem', color: '#86efac' }}>
                        {tr.latestLocation?.speed ? `${Number(tr.latestLocation.speed).toFixed(1)} km/h` : '—'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No trips found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Bus Fleet */}
      {activeTab === 'buses' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Registered Bus Fleet</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{buses.length} Buses</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Bus Number</th>
                  <th style={{ padding: '0.75rem' }}>Registration Number</th>
                  <th style={{ padding: '0.75rem' }}>Model</th>
                  <th style={{ padding: '0.75rem' }}>Capacity</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {buses.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '700', color: 'var(--accent)' }}>{b.busNumber}</td>
                    <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{b.registrationNumber}</td>
                    <td style={{ padding: '0.75rem' }}>{b.model}</td>
                    <td style={{ padding: '0.75rem' }}>{b.capacity} seats</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge badge-success">{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Routes & Stops */}
      {activeTab === 'routes' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Campus Transit Routes</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{routes.length} Routes</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Code</th>
                  <th style={{ padding: '0.75rem' }}>Route Name</th>
                  <th style={{ padding: '0.75rem' }}>Start Point</th>
                  <th style={{ padding: '0.75rem' }}>Destination</th>
                  <th style={{ padding: '0.75rem' }}>Distance</th>
                  <th style={{ padding: '0.75rem' }}>Stops Count</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '700', color: 'var(--accent)' }}>{r.routeCode}</td>
                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>{r.routeName}</td>
                    <td style={{ padding: '0.75rem' }}>{r.startPoint}</td>
                    <td style={{ padding: '0.75rem' }}>{r.endPoint}</td>
                    <td style={{ padding: '0.75rem' }}>{r.totalDistanceKm} km</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge badge-warning">{r.stops?.length || 0} stops</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Driver Directory */}
      {activeTab === 'drivers' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Driver Directory</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{drivers.length} Drivers</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Driver Name</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                  <th style={{ padding: '0.75rem' }}>Phone</th>
                  <th style={{ padding: '0.75rem' }}>License Number</th>
                  <th style={{ padding: '0.75rem' }}>Experience</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((d) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>{d.name}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{d.email}</td>
                    <td style={{ padding: '0.75rem' }}>{d.phone || '—'}</td>
                    <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{d.licenseNumber}</td>
                    <td style={{ padding: '0.75rem' }}>{d.experienceYears} yrs</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${d.status === 'ON_TRIP' ? 'badge-success' : 'badge-warning'}`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Timetable Schedules */}
      {activeTab === 'schedules' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Timetable & Schedules</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{schedules.length} Schedules</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Route</th>
                  <th style={{ padding: '0.75rem' }}>Bus</th>
                  <th style={{ padding: '0.75rem' }}>Driver</th>
                  <th style={{ padding: '0.75rem' }}>Departure</th>
                  <th style={{ padding: '0.75rem' }}>Arrival</th>
                  <th style={{ padding: '0.75rem' }}>Days</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>{s.routeName} ({s.routeCode})</td>
                    <td style={{ padding: '0.75rem', color: 'var(--accent)', fontWeight: '700' }}>{s.busNumber}</td>
                    <td style={{ padding: '0.75rem' }}>{s.driverName}</td>
                    <td style={{ padding: '0.75rem' }}>{s.departureTime}</td>
                    <td style={{ padding: '0.75rem' }}>{s.arrivalTime}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge badge-warning">{s.operatingDays}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
