export default function StudentWelcomeCard({
  studentData,
  user,
  onOpenPickupModal,
  onOpenProfileModal,
  onRefresh,
  isRefreshing,
}) {
  return (
    <div
      className="card welcome-card"
      style={{
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            onClick={onOpenProfileModal}
            className="student-avatar-badge"
            title="Click to view full profile"
            role="button"
            tabIndex={0}
          >
            🎓
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>
                Welcome, {studentData?.name || user?.name || 'Student'}
              </h1>
              <button
                onClick={onOpenProfileModal}
                className="badge badge-info"
                style={{
                  cursor: 'pointer',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.55rem',
                }}
                title="View and edit profile"
              >
                Profile ⚙️
              </button>
            </div>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.88rem' }}>
              Roll No:{' '}
              <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>
                {studentData?.rollNumber || '1MS21CS045'}
              </span>{' '}
              • Branch:{' '}
              <span style={{ color: 'var(--text-main)' }}>
                {studentData?.branch || 'Computer Science & Engineering'}
              </span>{' '}
              • Year:{' '}
              <span style={{ color: 'var(--text-main)' }}>
                {studentData?.yearOfStudy ? `Year ${studentData.yearOfStudy}` : '3rd Year'}
              </span>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Clickable Pickup Stop Pill */}
          <button
            type="button"
            onClick={onOpenPickupModal}
            className="pickup-pill-btn"
            title="Click to change your boarding stop"
          >
            <span style={{ fontSize: '1.1rem' }}>📍</span>
            <div style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: '#93c5fd', letterSpacing: '0.04em' }}>
                Boarding Stop (Click to change)
              </span>
              <strong style={{ fontSize: '0.92rem', color: '#ffffff' }}>
                {studentData?.pickupStopName || 'MG Road Metro Station'}
              </strong>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#93c5fd', marginLeft: '0.25rem' }}>✏️</span>
          </button>

          {/* Refresh Action Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="btn btn-secondary refresh-btn"
            title="Fetch latest tracking and schedule data"
            style={{ padding: '0.55rem 0.9rem', fontSize: '0.85rem' }}
          >
            <span className={isRefreshing ? 'spin-icon' : ''}>🔄</span>
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
