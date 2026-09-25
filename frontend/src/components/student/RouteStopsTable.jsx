export default function RouteStopsTable({
  route,
  currentStopId,
  currentStopName,
  onSelectStop,
  onSetPickupStop,
  scheduledDeparture,
}) {
  const stops = route?.stops || [];

  const calculateETA = (offsetMin) => {
    if (!scheduledDeparture) return `+${offsetMin || 0} min`;
    try {
      const parts = scheduledDeparture.split(':');
      const baseH = parseInt(parts[0], 10);
      const baseM = parseInt(parts[1], 10);
      const totalM = baseH * 60 + baseM + (offsetMin || 0);
      const h = Math.floor(totalM / 60) % 24;
      const m = totalM % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayHour = h % 12 || 12;
      return `${String(displayHour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm} (+${offsetMin || 0}m)`;
    } catch {
      return `+${offsetMin || 0} min`;
    }
  };

  return (
    <div className="card">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.2rem', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🗺️</span> Route Stops & Timetable
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            {route?.routeName || 'North Corridor Express'} • Total Distance: {route?.totalDistanceKm || 18.5} km •{' '}
            <span style={{ color: '#93c5fd' }}>Click any stop to inspect waypoint or change your pickup point</span>
          </p>
        </div>

        <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
          {stops.length} Total Stops
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="interactive-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.85rem 0.75rem' }}>Seq</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Stop Name</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Landmark</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Arrival Time (ETA)</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Coordinates</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>Boarding Status / Action</th>
            </tr>
          </thead>
          <tbody>
            {stops.length > 0 ? (
              stops.map((st) => {
                const stopId = st.stopId || st.id;
                const isPickup = stopId === currentStopId || st.stopName === currentStopName;

                return (
                  <tr
                    key={st.id || st.stopSequence || stopId}
                    className={`stop-table-row ${isPickup ? 'is-pickup-row' : ''}`}
                    onClick={() => onSelectStop && onSelectStop(st)}
                    title="Click row to inspect stop details"
                  >
                    <td style={{ padding: '0.85rem 0.75rem', fontWeight: '700', color: isPickup ? 'var(--accent)' : 'var(--text-dim)' }}>
                      #{st.stopSequence}
                    </td>

                    <td style={{ padding: '0.85rem 0.75rem', fontWeight: isPickup ? '700' : '600', color: isPickup ? '#93c5fd' : 'var(--text-main)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>{st.stopName}</span>
                        {isPickup && <span style={{ fontSize: '0.85rem' }}>📍</span>}
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {st.landmark || '—'}
                    </td>

                    <td style={{ padding: '0.85rem 0.75rem' }}>
                      <span className={`badge ${isPickup ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.75rem' }}>
                        {calculateETA(st.estimatedArrivalOffsetMinutes)}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 0.75rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      {st.latitude ? Number(st.latitude).toFixed(4) : '—'}, {st.longitude ? Number(st.longitude).toFixed(4) : '—'}
                    </td>

                    <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                      {isPickup ? (
                        <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem' }}>
                          🎯 Your Pickup Stop
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSetPickupStop) onSetPickupStop(stopId, st.stopName);
                          }}
                          title={`Select ${st.stopName} as your pickup stop`}
                        >
                          Select Stop
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No route stop timetable available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
