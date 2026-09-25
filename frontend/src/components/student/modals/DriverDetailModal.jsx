export default function DriverDetailModal({ isOpen, onClose, driver, schedule, trip, studentEmergencyContact }) {
  if (!isOpen) return null;

  const driverName = driver?.name || schedule?.driverName || trip?.driverName || 'Ramesh Kumar';
  const driverPhone = driver?.phone || schedule?.driverPhone || trip?.driverPhone || '+91 98765 00001';
  const emergencyPhone = studentEmergencyContact || driver?.emergencyContact || '+91 94444 12345';
  const licenseNumber = driver?.licenseNumber || 'DL-KA01-2015-00458';
  const experienceYears = driver?.experienceYears || 8;
  const status = driver?.status || (trip?.status === 'IN_PROGRESS' ? 'ON_TRIP' : 'AVAILABLE');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem' }}>👨‍✈️</span>
            <div>
              <h2 className="modal-title">{driverName}</h2>
              <p className="modal-subtitle">Official College Transit Operator</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Driver Status Banner */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.85rem 1.2rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duty Status</span>
              <p style={{ margin: 0, fontWeight: '700', color: '#86efac' }}>
                {status === 'ON_TRIP' ? 'Actively Driving (On Trip)' : 'On Standby / Assigned'}
              </p>
            </div>
            <span className={`badge ${status === 'ON_TRIP' ? 'badge-success' : 'badge-warning'}`}>
              <span className="status-dot"></span>
              {status}
            </span>
          </div>

          {/* Contact Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <a
              href={`tel:${driverPhone}`}
              className="btn btn-primary"
              style={{ padding: '0.65rem', fontSize: '0.88rem', textDecoration: 'none' }}
            >
              📞 Call Driver
            </a>
            <a
              href={`tel:${emergencyPhone}`}
              className="btn btn-secondary"
              style={{ padding: '0.65rem', fontSize: '0.88rem', textDecoration: 'none', color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.4)' }}
            >
              🚨 Emergency Desk
            </a>
          </div>

          {/* Details Grid */}
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Direct Contact Number</span>
              <strong className="detail-value">{driverPhone}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Commercial License</span>
              <strong className="detail-value">{licenseNumber}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Driving Experience</span>
              <strong className="detail-value">{experienceYears}+ Years Campus & City</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Assigned Vehicle</span>
              <strong className="detail-value">{schedule?.busNumber || 'BUS-101'}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Assigned Route</span>
              <strong className="detail-value">{schedule?.routeCode || 'R-101'}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Service Notes</span>
              <strong className="detail-value">{trip?.notes || 'Regular morning student transit route'}</strong>
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
