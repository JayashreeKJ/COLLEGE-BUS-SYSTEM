import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Activity, Radio, Compass, Wifi, Zap, Clock, ShieldCheck } from 'lucide-react';

export default function LiveTelemetryCard() {
  const {
    currentLocation,
    distanceTravelledKm,
    distanceRemainingKm,
    etaMinutesToDestination,
    progressPercent,
    backendOnline,
    backendPing
  } = useSimulation();

  return (
    <div className="card">
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
          <Activity size={18} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Live Telemetry HUD</h3>
        </div>
        <span className="badge badge-success" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
          <Radio size={12} /> SATELLITE LOCK
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Trip Progress</span>
          <span className="telemetry-num telemetry-glow" style={{ fontSize: '0.85rem' }}>
            {progressPercent.toFixed(1)}%
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            background: 'var(--bg-glass-strong)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            border: '1px solid var(--border-color)'
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent), var(--accent-cyan))',
              boxShadow: '0 0 12px var(--accent-cyan-glow)',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>

      {/* 2x2 Telemetry Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.85rem',
          marginBottom: '1.25rem'
        }}
      >
        {/* Distance Travelled */}
        <div
          style={{
            background: 'var(--bg-glass)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            Distance Covered
          </div>
          <div className="telemetry-num" style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
            {distanceTravelledKm} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>km</span>
          </div>
        </div>

        {/* Distance Remaining */}
        <div
          style={{
            background: 'var(--bg-glass)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            To SIET Campus
          </div>
          <div className="telemetry-num" style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)' }}>
            {distanceRemainingKm} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>km</span>
          </div>
        </div>

        {/* Latitude */}
        <div
          style={{
            background: 'var(--bg-glass)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            Latitude
          </div>
          <div className="telemetry-num" style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
            {currentLocation.lat.toFixed(5)}°N
          </div>
        </div>

        {/* Longitude */}
        <div
          style={{
            background: 'var(--bg-glass)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            Longitude
          </div>
          <div className="telemetry-num" style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
            {currentLocation.lng.toFixed(5)}°E
          </div>
        </div>
      </div>

      {/* GPS Status Footer Strip */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--border-color)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <ShieldCheck size={14} style={{ color: 'var(--accent-cyan)' }} />
          <span>Speed Guard Active (40km/h max)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-mono)' }}>
          <Wifi size={13} style={{ color: backendOnline ? 'var(--accent-cyan)' : '#f59e0b' }} />
          <span>{backendOnline ? `SYNC (${backendPing}ms)` : 'TELEMETRY ENGINE'}</span>
        </div>
      </div>
    </div>
  );
}
