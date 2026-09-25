export default function RouteCorridorVisualizer({
  route,
  stops,
  currentStopId,
  busNumber,
  progressPercentage,
  isDemoMode,
  isLivePolling,
  onStopClick,
}) {
  const routeStops = stops && stops.length > 0 ? stops : [
    { stopId: 1, stopSequence: 1, stopName: 'Central Railway Station', estimatedArrivalOffsetMinutes: 0 },
    { stopId: 2, stopSequence: 2, stopName: 'MG Road Metro Station', estimatedArrivalOffsetMinutes: 15 },
    { stopId: 3, stopSequence: 3, stopName: 'Indiranagar 100ft Junction', estimatedArrivalOffsetMinutes: 30 },
    { stopId: 5, stopSequence: 4, stopName: 'College Main Campus', estimatedArrivalOffsetMinutes: 50 },
  ];

  const totalStops = routeStops.length;

  return (
    <div className="corridor-visualizer-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
            Active Route Corridor
          </span>
          <strong style={{ fontSize: '1.05rem', color: '#ffffff' }}>
            {route?.routeName || 'North Corridor Express'} ({route?.routeCode || 'R-101'})
          </strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isDemoMode ? (
            <span className="badge badge-warning" style={{ fontSize: '0.72rem', background: 'rgba(245, 158, 11, 0.18)' }}>
              🧪 DEMO GPS SIMULATION
            </span>
          ) : (
            <span className={`badge ${isLivePolling ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.72rem' }}>
              <span className="status-dot"></span>
              {isLivePolling ? '⚡ LIVE GPS SYNC' : '⏸️ GPS PAUSED'}
            </span>
          )}
        </div>
      </div>

      {/* Progress Track with Nodes */}
      <div className="corridor-track-wrapper">
        {/* Background Track Line */}
        <div className="corridor-track-bg">
          <div
            className="corridor-track-fill"
            style={{ width: `${Math.min(Math.max(progressPercentage, 5), 98)}%` }}
          />
        </div>

        {/* Moving Bus Marker */}
        <div
          className="corridor-bus-marker"
          style={{
            left: `${Math.min(Math.max(progressPercentage, 5), 98)}%`,
            transition: 'left 1.2s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
          title={`Bus ${busNumber || 'BUS-101'} Progress: ${Math.round(progressPercentage)}%`}
        >
          <div className="bus-marker-bubble">
            <span style={{ fontSize: '0.9rem' }}>🚌</span>
            <span style={{ fontWeight: '700', fontSize: '0.72rem' }}>{busNumber || 'BUS-101'}</span>
          </div>
          <div className="bus-marker-pulse"></div>
        </div>

        {/* Waypoint Nodes along the track */}
        <div className="corridor-nodes-container">
          {routeStops.map((st, idx) => {
            const stopId = st.stopId || st.id;
            const isPickup = currentStopId === stopId || st.stopName === 'MG Road Metro Station';
            const nodeLeft = totalStops > 1 ? (idx / (totalStops - 1)) * 100 : 50;

            return (
              <div
                key={stopId || idx}
                className={`corridor-node-point ${isPickup ? 'is-pickup' : ''}`}
                style={{ left: `${nodeLeft}%` }}
                onClick={() => onStopClick && onStopClick(st)}
                title={`Stop #${st.stopSequence || idx + 1}: ${st.stopName} (Click for details)`}
                role="button"
                tabIndex={0}
              >
                <div className={`node-circle ${isPickup ? 'pickup-node' : ''}`}>
                  {isPickup ? '🎯' : idx + 1}
                </div>
                <div className="node-tooltip-label">
                  <span className="node-name">{st.stopName}</span>
                  {st.estimatedArrivalOffsetMinutes !== undefined && (
                    <span className="node-offset">+{st.estimatedArrivalOffsetMinutes}m</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Corridor Endpoints */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2.8rem' }}>
        <span>🚩 Start: <strong>{route?.startPoint || 'Central Railway Station'}</strong></span>
        <span>🏁 Destination: <strong>{route?.endPoint || 'College Main Campus'}</strong></span>
      </div>
    </div>
  );
}
