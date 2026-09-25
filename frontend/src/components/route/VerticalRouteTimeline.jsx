import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, Clock, MapPin, Navigation, Sparkles, Star, ChevronRight, X } from 'lucide-react';

export default function VerticalRouteTimeline({ maxStops = null }) {
  const {
    stops,
    progressIndex,
    selectedPickupStopId,
    setSelectedPickupStopId,
    jumpToStop
  } = useSimulation();

  const toast = useToast();
  const [activeModalStop, setActiveModalStop] = useState(null);

  const displayStops = maxStops ? stops.slice(0, maxStops) : stops;
  const currentFloor = Math.floor(progressIndex);

  const handleStopClick = (stop) => {
    setActiveModalStop(stop);
  };

  const handleSetAsPickup = (stop) => {
    setSelectedPickupStopId(stop.id);
    toast.success(`Set ${stop.name} as your morning pickup stop`);
    setActiveModalStop(null);
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {displayStops.map((stop, index) => {
          const isCompleted = index < currentFloor;
          const isCurrent = index === currentFloor;
          const isUpcoming = index > currentFloor;
          const isPickup = stop.id === selectedPickupStopId;

          // Estimate arrival based on simulation
          const diffMinutes = Math.max(0, Math.round((index - progressIndex) * 3.2));
          const estimatedArrival = isCompleted
            ? 'Departed'
            : isCurrent
            ? 'Arriving Now'
            : `+${diffMinutes} min`;

          return (
            <div
              key={stop.id}
              onClick={() => handleStopClick(stop)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                position: 'relative',
                paddingBottom: index === displayStops.length - 1 ? '0' : '1.5rem',
                cursor: 'pointer'
              }}
            >
              {/* Connecting vertical line */}
              {index !== displayStops.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '28px',
                    left: '14px',
                    width: '2px',
                    bottom: '0',
                    background: isCompleted ? 'var(--primary)' : 'var(--border-color)',
                    transition: 'background 0.3s ease'
                  }}
                />
              )}

              {/* Status Circle Node */}
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: isCurrent
                    ? '#ffffff'
                    : isCompleted
                    ? 'var(--primary-dim)'
                    : 'var(--bg-secondary)',
                  border: isCurrent
                    ? '3px solid var(--accent-cyan)'
                    : isCompleted
                    ? '2px solid var(--primary)'
                    : isPickup
                    ? '2px solid var(--accent-magenta-light)'
                    : '2px solid var(--border-color)',
                  boxShadow: isCurrent
                    ? '0 0 16px var(--accent-cyan)'
                    : isPickup
                    ? '0 0 12px var(--accent-magenta-light)'
                    : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isCurrent
                    ? '#070711'
                    : isCompleted
                    ? 'var(--accent)'
                    : isPickup
                    ? 'var(--accent-magenta-light)'
                    : 'var(--text-dim)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  zIndex: 2,
                  flexShrink: 0,
                  transition: 'all 0.2s ease'
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                ) : isCurrent ? (
                  <span className="live-dot" style={{ width: '8px', height: '8px' }}></span>
                ) : isPickup ? (
                  <Star size={14} fill="#e879f9" color="#e879f9" />
                ) : (
                  stop.sequence
                )}
              </div>

              {/* Stop Information Card */}
              <div
                style={{
                  flex: 1,
                  background: isCurrent
                    ? 'rgba(34, 211, 238, 0.08)'
                    : isPickup
                    ? 'rgba(192, 38, 211, 0.08)'
                    : 'var(--bg-glass)',
                  border: isCurrent
                    ? '1px solid var(--border-cyan)'
                    : isPickup
                    ? '1px solid var(--border-purple)'
                    : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-purple)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isCurrent
                    ? 'var(--border-cyan)'
                    : isPickup
                    ? 'var(--border-purple)'
                    : 'var(--border-color)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                      {stop.name}
                    </h4>
                    {isPickup && (
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                        MY PICKUP
                      </span>
                    )}
                    {isCurrent && (
                      <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                        BUS AT STOP
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    📍 {stop.landmark} • {stop.distanceFromStart}
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                      {stop.scheduledTime}
                    </div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: isCompleted ? 'var(--text-dim)' : isCurrent ? 'var(--accent-cyan)' : 'var(--accent)'
                      }}
                    >
                      {estimatedArrival}
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--text-dim)' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stop Detail Flyout Modal */}
      {activeModalStop && (
        <div className="modal-overlay" onClick={() => setActiveModalStop(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '480px', padding: '1.5rem' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} style={{ color: 'var(--accent-cyan)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Stop Details</h3>
              </div>
              <button onClick={() => setActiveModalStop(null)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                STOP #{activeModalStop.sequence} OF {stops.length}
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '4px 0 8px 0' }}>
                {activeModalStop.name}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                📍 Landmark: {activeModalStop.landmark}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ background: 'var(--bg-glass-strong)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Scheduled Departure</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {activeModalStop.scheduledTime}
                </div>
              </div>

              <div style={{ background: 'var(--bg-glass-strong)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Distance from Origin</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                  {activeModalStop.distanceFromStart}
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(0,0,0,0.4)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.5rem',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              Coordinates: {activeModalStop.lat.toFixed(5)}°N, {activeModalStop.lng.toFixed(5)}°E
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  jumpToStop(activeModalStop.sequence - 1);
                  toast.info(`Simulated bus jumped to ${activeModalStop.name}`);
                  setActiveModalStop(null);
                }}
                className="btn btn-secondary"
                style={{ flex: 1, fontSize: '0.82rem' }}
              >
                Teleport Bus Here
              </button>
              <button
                onClick={() => handleSetAsPickup(activeModalStop)}
                className="btn btn-primary"
                style={{ flex: 1, fontSize: '0.82rem' }}
              >
                Set as My Pickup Stop
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
