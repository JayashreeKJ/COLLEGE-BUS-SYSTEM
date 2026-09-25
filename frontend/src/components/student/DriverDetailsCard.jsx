export default function DriverDetailsCard({ schedule, trip, studentData, onOpenDriverModal }) {
  const driverName = schedule?.driverName || trip?.driverName || 'Ramesh Kumar';
  const driverPhone = schedule?.driverPhone || trip?.driverPhone || '+91 98765 00001';
  const emergencyPhone = studentData?.emergencyContact || '+91 94444 12345';
  const notes = trip?.notes || 'Regular college morning transit route';

  return (
    <div
      className="card interactive-card"
      onClick={onOpenDriverModal}
      title="Click to view driver credentials and contact details"
      role="button"
      tabIndex={0}
      style={{ cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>👨‍✈️</span> Driver Details
        </h2>
        <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
          Profile ↗
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block', textTransform: 'uppercase' }}>
            Driver Name
          </span>
          <p style={{ margin: '0.2rem 0 0', fontWeight: '700', fontSize: '1.05rem', color: '#ffffff' }}>
            {driverName}
          </p>
        </div>

        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block', textTransform: 'uppercase' }}>
            Contact Phone
          </span>
          <p style={{ margin: '0.2rem 0 0', fontWeight: '600' }}>
            <a
              href={`tel:${driverPhone}`}
              onClick={(e) => e.stopPropagation()}
              style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
              title="Click to call driver directly"
            >
              📞 {driverPhone}
            </a>
          </p>
        </div>

        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block', textTransform: 'uppercase' }}>
            Emergency Desk
          </span>
          <p style={{ margin: '0.2rem 0 0', fontWeight: '500', color: 'var(--text-muted)' }}>
            <a
              href={`tel:${emergencyPhone}`}
              onClick={(e) => e.stopPropagation()}
              style={{ color: '#fca5a5', textDecoration: 'none' }}
              title="Click to call emergency transit desk"
            >
              🚨 {emergencyPhone}
            </a>
          </p>
        </div>

        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block', textTransform: 'uppercase' }}>
            Trip Service Notes
          </span>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {notes}
          </p>
        </div>
      </div>
    </div>
  );
}
