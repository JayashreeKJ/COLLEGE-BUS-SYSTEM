import { Link } from 'react-router-dom';

export default function DriverDashboardPlaceholder() {
  return (
    <div className="main-content">
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚌</div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Driver Portal (Foundation Area)</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          This area will allow drivers to view assigned trips, start/complete journeys, and stream live device GPS telemetry coordinates.
        </p>
        <span className="badge badge-warning" style={{ marginBottom: '1.5rem' }}>
          Phase 1 Foundation Setup
        </span>
        <div>
          <Link to="/" className="btn btn-secondary">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
