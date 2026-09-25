import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { useToast } from '../../context/ToastContext';
import {
  Bus,
  Play,
  Square,
  Navigation,
  CheckCircle2,
  Users,
  Radio,
  Clock,
  MapPin,
  ShieldCheck,
  Plus,
  Minus
} from 'lucide-react';

export default function DriverDashboard() {
  const { stops, activeBus, currentLocation, isPlaying, togglePlay } = useSimulation();
  const toast = useToast();

  const [tripStarted, setTripStarted] = useState(true);
  const [passengerCount, setPassengerCount] = useState(31);
  const [completedStopIndices, setCompletedStopIndices] = useState([0, 1, 2, 3, 4]);

  const handleToggleTrip = () => {
    const nextState = !tripStarted;
    setTripStarted(nextState);
    if (nextState) {
      toast.success('Trip commenced: Broadcasting live GPS coordinates from vehicle unit');
      if (!isPlaying) togglePlay();
    } else {
      toast.warning('Trip concluded: Bus marked as arrived at depot/campus');
      if (isPlaying) togglePlay();
    }
  };

  const handleMarkStopReached = (idx, stopName) => {
    if (!completedStopIndices.includes(idx)) {
      setCompletedStopIndices([...completedStopIndices, idx]);
      toast.success(`Broadcasted arrival at Stop #${idx + 1}: ${stopName}`);
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: '1200px', padding: '1.5rem 1.5rem 3.5rem' }}>
      {/* Driver Cockpit Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bus size={22} style={{ color: 'var(--primary)' }} />
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Driver Cockpit & GPS Broadcaster
            </h1>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Driver: <strong>{activeBus.driver.name}</strong> • Bus: <strong>{activeBus.name}</strong> ({activeBus.busNumber})
          </p>
        </div>

        <button
          onClick={handleToggleTrip}
          className={`btn ${tripStarted ? 'btn-secondary' : 'btn-primary'}`}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '0.95rem',
            borderColor: tripStarted ? 'var(--danger)' : 'var(--primary)',
            color: tripStarted ? '#fca5a5' : '#ffffff'
          }}
        >
          {tripStarted ? (
            <>
              <Square size={16} fill="#ef4444" /> Conclude Active Trip
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" /> Start Morning Trip
            </>
          )}
        </button>
      </div>

      {/* 3 Cockpit Action Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        {/* GPS Broadcast HUD */}
        <div className="card glow-border">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Radio size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                Satellite GPS Broadcast
              </h3>
            </div>
            <div className="live-indicator">
              <span className="live-dot"></span>
              {tripStarted ? 'ON AIR' : 'STANDBY'}
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-glass-strong)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>VEHICLE SPEED</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
                <ShieldCheck size={13} style={{ display: 'inline' }} /> Safety Limit OK
              </span>
            </div>
            <div className="telemetry-num telemetry-glow" style={{ fontSize: '2rem' }}>
              {currentLocation.speed} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>km/h</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              Coords: {currentLocation.lat.toFixed(5)}°N, {currentLocation.lng.toFixed(5)}°E
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Broadcasting directly to Sri Shakthi Institute transit server and student apps at 1-second intervals.
          </p>
        </div>

        {/* Passenger Occupancy Counter */}
        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} style={{ color: '#38bdf8' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                Passenger Counter
              </h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Cap: {activeBus.capacity} seats
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              margin: '1.25rem 0'
            }}
          >
            <button
              onClick={() => {
                if (passengerCount > 0) {
                  setPassengerCount(passengerCount - 1);
                  toast.info(`Passenger count updated: ${passengerCount - 1}`);
                }
              }}
              className="btn btn-secondary"
              style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0 }}
            >
              <Minus size={20} />
            </button>

            <div style={{ textAlign: 'center' }}>
              <div className="telemetry-num" style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>
                {passengerCount}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Students On Board
              </span>
            </div>

            <button
              onClick={() => {
                if (passengerCount < activeBus.capacity) {
                  setPassengerCount(passengerCount + 1);
                  toast.info(`Passenger count updated: ${passengerCount + 1}`);
                }
              }}
              className="btn btn-primary"
              style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0 }}
            >
              <Plus size={20} />
            </button>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            {activeBus.capacity - passengerCount} vacant seats available
          </div>
        </div>
      </div>

      {/* Route Stops Sequence Checklist */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Stop Arrival Check-ins ({completedStopIndices.length} / {stops.length} Complete)
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Tap "Mark Reached" as you approach each stop along the Coimbatore corridor to trigger student notifications
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {stops.map((stop, idx) => {
            const isReached = completedStopIndices.includes(idx);

            return (
              <div
                key={stop.id}
                style={{
                  padding: '0.85rem 1.2rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isReached ? 'rgba(139, 92, 246, 0.12)' : 'var(--bg-glass)',
                  border: isReached
                    ? '1px solid var(--primary-glow)'
                    : '1px solid var(--border-color)',
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
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isReached ? 'var(--primary)' : 'var(--bg-glass-strong)',
                      color: isReached ? '#ffffff' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    {isReached ? <CheckCircle2 size={16} strokeWidth={3} /> : stop.sequence}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                      {stop.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      📍 {stop.landmark} • Scheduled: {stop.scheduledTime}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleMarkStopReached(idx, stop.name)}
                  className={`btn ${isReached ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.8rem' }}
                  disabled={isReached}
                >
                  {isReached ? '✓ Stop Logged' : 'Mark Reached'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
