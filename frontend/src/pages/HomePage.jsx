import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { checkBackendHealth } from '../services/healthService';

export default function HomePage() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkBackendHealth().then((res) => {
      setHealthData(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="main-content">
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '2.5rem 0 3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <span className="badge badge-info">Phase 1 Foundation</span>
          <span className="badge badge-success">Spring Boot & React</span>
        </div>
        <h1 style={{ fontSize: '2.8rem', lineHeight: '1.2', marginBottom: '1rem' }}>
          SmartBus – College Bus Management & Live Tracking
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto 2rem' }}>
          Next-generation campus transit management. Seamless real-time GPS tracking for students, intuitive journey controls for drivers, and centralized fleet oversight for college administrators.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            Access Portal
          </Link>
          <a
            href="#system-status"
            className="btn btn-secondary"
            style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
          >
            System Status
          </a>
        </div>
      </section>

      {/* Role Portals Grid */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', textAlign: 'center' }}>
          Dedicated User Portals
        </h2>
        <div className="grid-3">
          {/* Student Portal */}
          <div className="card">
            <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🎓</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Student Portal</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              View bus routes, stop timetables, driver contact details, and track your morning/evening bus live on Google Maps.
            </p>
            <Link to="/student" className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }}>
              Open Student Portal →
            </Link>
          </div>

          {/* Driver Portal */}
          <div className="card">
            <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🚌</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Driver Portal</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              View assigned buses and scheduled trips, start/stop journeys, and broadcast live device GPS coordinates.
            </p>
            <Link to="/driver" className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }}>
              Open Driver Portal →
            </Link>
          </div>

          {/* Admin Portal */}
          <div className="card">
            <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🛡️</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Admin Portal</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Manage fleet vehicles, driver registrations, routes, sequenced stops, timetables, and monitor active campus trips.
            </p>
            <Link to="/admin" className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }}>
              Open Admin Portal →
            </Link>
          </div>
        </div>
      </section>

      {/* Backend Integration & Health Status */}
      <section id="system-status" className="card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Backend REST API Health</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Verifies live connectivity between React frontend and Spring Boot backend (<code style={{ color: 'var(--accent)' }}>/api/health</code>).
            </p>
          </div>
          <div>
            {loading ? (
              <span className="badge badge-warning">Checking...</span>
            ) : healthData?.success ? (
              <span className="badge badge-success">
                <span className="status-dot"></span> Backend Online
              </span>
            ) : (
              <span className="badge badge-danger">
                <span className="status-dot"></span> Backend Offline / Unreachable
              </span>
            )}
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontFamily: 'monospace' }}>
          {loading ? (
            <p style={{ color: 'var(--text-dim)' }}>Connecting to Spring Boot REST endpoint...</p>
          ) : healthData?.success ? (
            <pre style={{ color: 'var(--success)', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(healthData.data, null, 2)}
            </pre>
          ) : (
            <p style={{ color: 'var(--danger)' }}>
              Error: {healthData?.error || 'Unable to connect to Spring Boot server on localhost:8080'}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
