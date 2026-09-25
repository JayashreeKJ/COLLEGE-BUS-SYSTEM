import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import SmartBusLogo from '../common/SmartBusLogo';
import { MapPin, Navigation, Clock, Gauge, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BusHeroStatusCard({ onOpenPickupModal, onOpenBusModal }) {
  const {
    activeBus,
    currentStop,
    nextStop,
    currentLocation,
    etaMinutesToDestination,
    etaMinutesToPickup,
    selectedPickupStop,
    pickupStatus,
    distanceRemainingKm,
    progressPercent
  } = useSimulation();

  return (
    <div
      className="card glow-border"
      style={{
        background: 'linear-gradient(135deg, rgba(17, 16, 29, 0.95), rgba(11, 10, 22, 0.98))',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background atmospheric ambient light */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <SmartBusLogo size={36} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                {activeBus.name}
              </h2>
              <div className="live-indicator">
                <span className="live-dot"></span>
                LIVE
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {activeBus.busNumber} • {activeBus.routeName}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenBusModal}
          className="btn btn-secondary"
          style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}
        >
          Vehicle Details →
        </button>
      </div>

      {/* 4-Stat Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}
      >
        {/* Current Location */}
        <div
          style={{
            background: 'var(--bg-glass-strong)',
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <MapPin size={14} style={{ color: 'var(--accent)' }} />
            Current Location
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentStop?.name || 'In Transit'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Stop #{currentStop?.sequence || 1}
          </div>
        </div>

        {/* Next Stop */}
        <div
          style={{
            background: 'var(--bg-glass-strong)',
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <Navigation size={14} style={{ color: 'var(--accent-cyan)' }} />
            Next Stop
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {nextStop?.name || 'SIET Campus'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {nextStop?.scheduledTime || '08:13 AM'}
          </div>
        </div>

        {/* ETA */}
        <div
          style={{
            background: 'var(--bg-glass-strong)',
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <Clock size={14} style={{ color: '#f59e0b' }} />
            ETA (SIET Campus)
          </div>
          <div className="telemetry-num telemetry-glow" style={{ fontSize: '1.25rem' }}>
            {etaMinutesToDestination} min
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {distanceRemainingKm} km remaining
          </div>
        </div>

        {/* Speed */}
        <div
          style={{
            background: 'var(--bg-glass-strong)',
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <Gauge size={14} style={{ color: 'var(--accent-cyan)' }} />
            Live Speed
          </div>
          <div className="telemetry-num telemetry-purple" style={{ fontSize: '1.25rem' }}>
            {currentLocation.speed} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>km/h</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
            ● Normal Cruising
          </div>
        </div>
      </div>

      {/* Student Pickup Stop Highlight Strip */}
      <div
        style={{
          background: 'rgba(168, 85, 247, 0.08)',
          border: '1px solid var(--border-purple)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(168, 85, 247, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)'
            }}
          >
            <MapPin size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Your Morning Pickup Stop
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f5f3ff' }}>
              {selectedPickupStop?.name} <span style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600 }}>({selectedPickupStop?.scheduledTime})</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ETA to your stop</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: pickupStatus === 'PASSED' ? 'var(--text-dim)' : 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              {pickupStatus === 'PASSED' ? 'Departed' : pickupStatus === 'ARRIVING' ? 'Arriving Now' : `${etaMinutesToPickup} min`}
            </div>
          </div>
          <button
            onClick={onOpenPickupModal}
            className="btn btn-secondary"
            style={{
              fontSize: '0.78rem',
              padding: '0.4rem 0.8rem',
              borderColor: 'var(--border-purple)',
              color: 'var(--accent-cyan)'
            }}
          >
            Change Stop
          </button>
        </div>
      </div>
    </div>
  );
}
