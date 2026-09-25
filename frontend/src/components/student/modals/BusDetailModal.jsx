export default function BusDetailModal({ isOpen, onClose, bus, route, schedule, trip }) {
  if (!isOpen) return null;

  const busNumber = bus?.busNumber || schedule?.busNumber || trip?.busNumber || 'BUS-101';
  const regNumber = bus?.registrationNumber || 'KA-01-EQ-1001';
  const model = bus?.model || 'Tata Starbus Ultra (Euro VI)';
  const capacity = bus?.capacity || 45;
  const status = bus?.status || (trip?.status === 'IN_PROGRESS' ? 'ACTIVE' : 'READY');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem' }}>🚍</span>
            <div>
              <h2 className="modal-title">Bus Fleet Details: {busNumber}</h2>
              <p className="modal-subtitle">Registration & Transit Vehicle Specification</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Top Status Banner */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.85rem 1.2rem',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fleet Status</span>
              <p style={{ margin: 0, fontWeight: '700', color: '#93c5fd' }}>
                {trip?.status === 'IN_PROGRESS' ? 'En Route (Live Journey)' : 'Ready for Scheduled Service'}
              </p>
            </div>
            <span className={`badge ${status === 'ACTIVE' || trip?.status === 'IN_PROGRESS' ? 'badge-success' : 'badge-warning'}`}>
              <span className="status-dot"></span>
              {status}
            </span>
          </div>

          {/* Grid of specs */}
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Vehicle Registration</span>
              <strong className="detail-value">{regNumber}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Model & Chassis</span>
              <strong className="detail-value">{model}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Seating Capacity</span>
              <strong className="detail-value">{capacity} Passengers</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Assigned Route</span>
              <strong className="detail-value">{route?.routeName || 'North Corridor Express'} ({route?.routeCode || 'R-101'})</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Operating Schedule</span>
              <strong className="detail-value">{schedule?.departureTime || '07:30 AM'} • {schedule?.operatingDays || 'MON-FRI'}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Active Driver</span>
              <strong className="detail-value">{schedule?.driverName || trip?.driverName || 'Ramesh Kumar'}</strong>
            </div>
          </div>

          {/* Safety & Compliance Checklist */}
          <div style={{ marginTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🛡️ Safety & Telemetry Checklist
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#86efac' }}>
                ✓ GPS Telemetry Active
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#86efac' }}>
                ✓ Speed Governor (60 km/h)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#86efac' }}>
                ✓ Emergency Panic Button
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#86efac' }}>
                ✓ First Aid & Fire Safety
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
