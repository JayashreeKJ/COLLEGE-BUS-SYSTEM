export default function AssignedBusCard({ schedule, route, onOpenBusModal }) {
  return (
    <div
      className="card interactive-card"
      onClick={onOpenBusModal}
      title="Click to view complete bus specifications and fleet details"
      role="button"
      tabIndex={0}
      style={{ cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🚍</span> Assigned Bus Information
        </h2>
        <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
          Details ↗
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block', textTransform: 'uppercase' }}>
            Bus Number
          </span>
          <p style={{ margin: '0.2rem 0 0', fontWeight: '800', fontSize: '1.2rem', color: 'var(--accent)' }}>
            {schedule?.busNumber || 'BUS-101'}
          </p>
        </div>

        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block', textTransform: 'uppercase' }}>
            Route Code
          </span>
          <p style={{ margin: '0.2rem 0 0', fontWeight: '700', fontSize: '1.05rem', color: '#ffffff' }}>
            {route?.routeCode || schedule?.routeCode || 'R-101'}
          </p>
        </div>

        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block', textTransform: 'uppercase' }}>
            Scheduled Departure
          </span>
          <p style={{ margin: '0.2rem 0 0', fontWeight: '600', color: 'var(--text-main)' }}>
            {schedule?.departureTime || '07:30:00 AM'}
          </p>
        </div>

        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block', textTransform: 'uppercase' }}>
            Operating Days
          </span>
          <p style={{ margin: '0.2rem 0 0', fontWeight: '600', color: 'var(--text-main)' }}>
            {schedule?.operatingDays || 'MON - FRI'}
          </p>
        </div>
      </div>
    </div>
  );
}
