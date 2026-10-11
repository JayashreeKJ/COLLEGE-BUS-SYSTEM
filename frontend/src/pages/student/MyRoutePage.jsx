import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { useToast } from '../../context/ToastContext';
import VerticalRouteTimeline from '../../components/route/VerticalRouteTimeline';
import PickupStopModal from '../../components/tracking/PickupStopModal';
import {
  Route,
  MapPin,
  Search,
  Navigation,
  Clock,
  CheckCircle2,
  Sparkles,
  Compass,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyRoutePage() {
  const {
    availableBuses = [],
    selectedBusId,
    setSelectedBusId,
    stops,
    collegeInfo,
    activeBus,
    selectedPickupStop,
    totalRouteKm,
    progressIndex
  } = useSimulation();

  const [searchTerm, setSearchTerm] = useState('');
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);

  return (
    <div className="main-content" style={{ maxWidth: '1100px', padding: '1.5rem 1.5rem 3.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to={`/student?bus=${activeBus?.id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '0.75rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Live Radar Dashboard
        </Link>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              {activeBus?.name} Route Corridor
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Sri Shakthi Transit corridor from <strong>{stops[0]?.name} ({stops[0]?.scheduledTime})</strong> to <strong>{stops[stops.length - 1]?.name} ({stops[stops.length - 1]?.scheduledTime})</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsPickupModalOpen(true)}
              className="btn btn-primary"
              style={{ fontSize: '0.88rem', padding: '0.55rem 1.1rem' }}
            >
              <MapPin size={16} /> Change My Pickup Stop
            </button>
            <Link
              to={`/student?bus=${activeBus?.id}`}
              className="btn btn-secondary"
              style={{ fontSize: '0.88rem', padding: '0.55rem 1.1rem' }}
            >
              <Navigation size={16} /> Track on Map →
            </Link>
          </div>
        </div>
      </div>

      {/* Compact Quick Bus Corridor Switcher */}
      <div
        className="card"
        style={{
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          overflowX: 'auto',
          background: 'rgba(11, 10, 22, 0.85)'
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
          Select Bus:
        </span>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {availableBuses.map((bus) => {
            const isSel = bus.id === selectedBusId;
            return (
              <button
                key={bus.id}
                onClick={() => setSelectedBusId(bus.id)}
                className="btn"
                style={{
                  padding: '0.35rem 0.7rem',
                  fontSize: '0.78rem',
                  whiteSpace: 'nowrap',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: isSel ? 800 : 500,
                  background: isSel ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  color: isSel ? '#000000' : 'var(--text-muted)',
                  border: isSel ? '1px solid var(--primary)' : '1px solid var(--border-color)'
                }}
              >
                Bus {bus.id.replace('BUS-', '')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Total Stops Sequenced
          </div>
          <div className="telemetry-num telemetry-glow" style={{ fontSize: '1.6rem' }}>
            {stops.length} Stops
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeBus?.routeName}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Corridor Distance
          </div>
          <div className="telemetry-num" style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>
            {totalRouteKm} km
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Origin to SIET Campus</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Your Pickup Location
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-magenta-light)' }}>
            {selectedPickupStop?.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Scheduled: {selectedPickupStop?.scheduledTime}
          </div>
        </div>
      </div>

      {/* Full Vertical Route Timeline Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.75rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '1rem'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Complete Timetable & Stop Sequencer
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Click any stop to inspect coordinates, scheduled departure, or set as your preferred stop
            </p>
          </div>
          <div className="live-indicator">
            <span className="live-dot"></span>
            LIVE TIMETABLE
          </div>
        </div>

        <VerticalRouteTimeline />
      </div>

      {/* Pickup Stop Modal */}
      <PickupStopModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
      />
    </div>
  );
}
