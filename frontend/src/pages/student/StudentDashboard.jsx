import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// Components
import BusHeroStatusCard from '../../components/tracking/BusHeroStatusCard';
import InteractiveMapView from '../../components/tracking/InteractiveMapView';
import LiveTelemetryCard from '../../components/tracking/LiveTelemetryCard';
import SimulationControls from '../../components/tracking/SimulationControls';
import BusDetailsCard from '../../components/tracking/BusDetailsCard';
import VerticalRouteTimeline from '../../components/route/VerticalRouteTimeline';
import PickupStopModal from '../../components/tracking/PickupStopModal';

import {
  MapPin,
  Clock,
  Radio,
  Navigation,
  RefreshCw,
  User,
  Sparkles,
  Route,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  const {
    activeBus,
    selectedPickupStop,
    currentStop,
    nextStop,
    etaMinutesToPickup,
    pickupStatus,
    stops
  } = useSimulation();

  const toast = useToast();
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isBusDetailModalOpen, setIsBusDetailModalOpen] = useState(false);
  const [selectedMapStop, setSelectedMapStop] = useState(null);

  return (
    <div className="main-content" style={{ maxWidth: '1440px', padding: '1.25rem 1.5rem 3rem' }}>
      {/* Top Welcome / Status Strip */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Transit Command Radar
            </h1>
            <div className="live-indicator">
              <span className="live-dot"></span>
              LIVE GPS
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
            Sri Shakthi Institute of Engineering & Technology — Bus 12 Express Corridor
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Pickup Stop Pill */}
          <button
            onClick={() => setIsPickupModalOpen(true)}
            className="btn btn-secondary"
            style={{
              padding: '0.45rem 0.95rem',
              fontSize: '0.82rem',
              borderColor: 'var(--border-purple)',
              background: 'rgba(168, 85, 247, 0.1)'
            }}
          >
            <MapPin size={14} style={{ color: 'var(--accent-magenta-light)' }} />
            <span>
              Pickup: <strong>{selectedPickupStop?.name}</strong> ({selectedPickupStop?.scheduledTime})
            </span>
          </button>

          <Link
            to="/student/route"
            className="btn btn-secondary"
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
          >
            <Route size={14} /> Full Route Timeline
          </Link>
        </div>
      </div>

      {/* Main Bus Hero Status Card */}
      <div style={{ marginBottom: '1.25rem' }}>
        <BusHeroStatusCard
          onOpenPickupModal={() => setIsPickupModalOpen(true)}
          onOpenBusModal={() => setIsBusDetailModalOpen(true)}
        />
      </div>

      {/* Simulation Controls Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <SimulationControls />
      </div>

      {/* Grid: Map Area (Center Left) + Telemetry & Fleet HUD (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
          gap: '1.25rem',
          marginBottom: '1.5rem'
        }}
      >
        {/* Left: Interactive Real Vector Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <InteractiveMapView
            height="580px"
            onSelectStop={(stop) => setSelectedMapStop(stop)}
          />

          {/* Quick Route Corridor Mini Timeline Preview */}
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
                <Route size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                  Active Route Corridor Progress
                </h3>
              </div>
              <Link
                to="/student/route"
                style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}
              >
                View all {stops.length} stops →
              </Link>
            </div>

            <VerticalRouteTimeline maxStops={6} />
          </div>
        </div>

        {/* Right Column: Telemetry & Vehicle Details Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <LiveTelemetryCard />
          <BusDetailsCard />
        </div>
      </div>

      {/* Pickup Stop Modal */}
      <PickupStopModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
      />
    </div>
  );
}
