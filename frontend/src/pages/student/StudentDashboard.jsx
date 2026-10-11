import React, { useState, useMemo } from 'react';
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
  ArrowRight,
  Bus,
  Search,
  ChevronDown,
  Check,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  const {
    availableBuses = [],
    selectedBusId,
    setSelectedBusId,
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

  // Bus selector state
  const [busSearchTerm, setBusSearchTerm] = useState('');
  const [isBusDropdownOpen, setIsBusDropdownOpen] = useState(false);

  const filteredBuses = useMemo(() => {
    if (!busSearchTerm) return availableBuses;
    const term = busSearchTerm.toLowerCase();
    return availableBuses.filter((b) =>
      b.name.toLowerCase().includes(term) ||
      b.busNumber.toLowerCase().includes(term) ||
      b.routeName.toLowerCase().includes(term) ||
      b.id.toLowerCase().includes(term)
    );
  }, [availableBuses, busSearchTerm]);

  const handleSelectBus = (busId) => {
    setSelectedBusId(busId);
    setIsBusDropdownOpen(false);
    toast.success(`Active map isolated to Bus ${busId.replace('BUS-', '')}'s dedicated corridor`);
  };

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
              {activeBus?.isVerified ? 'LIVE GPS' : 'RADAR ACTIVE'}
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
            Sri Shakthi Institute of Engineering & Technology — <strong>{activeBus?.name}</strong>
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
            <Route size={14} /> Full Route Timeline ({stops.length} stops)
          </Link>
        </div>
      </div>

      {/* DEDICATED BUS SELECTOR CONTROL (BUS 01 THROUGH BUS 16) */}
      <div
        className="card glow-border"
        style={{
          marginBottom: '1.25rem',
          padding: '1rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(17, 16, 29, 0.95), rgba(11, 10, 22, 0.98))',
          border: '1px solid var(--border-purple)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(34, 211, 238, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)'
              }}
            >
              <Bus size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                Isolated Bus Fleet Tracking
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f5f3ff' }}>
                Select Your College Bus: <span style={{ color: 'var(--accent-cyan)' }}>{activeBus?.name}</span>
              </div>
            </div>
          </div>

          {/* Search Input for buses */}
          <div style={{ position: 'relative', minWidth: '240px', flex: '1', maxWidth: '340px' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-dim)'
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '32px', paddingRight: '10px', paddingTop: '0.4rem', paddingBottom: '0.4rem', fontSize: '0.82rem' }}
              placeholder="Search bus #, corridor, area..."
              value={busSearchTerm}
              onChange={(e) => setBusSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Bus Selector Buttons (Bus 01 to Bus 16 + Fleet) */}
        <div
          style={{
            display: 'flex',
            gap: '0.45rem',
            overflowX: 'auto',
            paddingBottom: '0.4rem',
            scrollbarWidth: 'thin'
          }}
        >
          {filteredBuses.map((bus) => {
            const isSelected = bus.id === selectedBusId;
            const busNumStr = bus.id.replace('BUS-', '');
            return (
              <button
                key={bus.id}
                onClick={() => handleSelectBus(bus.id)}
                className="btn"
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.82rem',
                  whiteSpace: 'nowrap',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: isSelected ? 800 : 600,
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.35), rgba(34, 211, 238, 0.25))'
                    : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  border: isSelected
                    ? '1.5px solid var(--accent-cyan)'
                    : '1px solid var(--border-color)',
                  boxShadow: isSelected ? '0 0 14px rgba(34, 211, 238, 0.3)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
                title={`${bus.name} — ${bus.routeName}`}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: isSelected
                      ? 'var(--accent-cyan)'
                      : bus.status === 'LIVE'
                      ? '#22c55e'
                      : '#94a3b8'
                  }}
                />
                <span>Bus {busNumStr}</span>
              </button>
            );
          })}
        </div>

        {/* Corridor Context & Verification Notice Strip */}
        <div
          style={{
            marginTop: '0.65rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            fontSize: '0.78rem'
          }}
        >
          <div style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Route size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span>
              Corridor: <strong>{activeBus?.routeName}</strong> ({stops.length} stops)
            </span>
          </div>

          <div>
            {activeBus?.isVerified ? (
              <span style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <ShieldCheck size={14} /> Official GPS Transponder Verified
              </span>
            ) : (
              <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <AlertCircle size={14} /> Realistic Corridor Route (Simulation mode — Verification pending)
              </span>
            )}
          </div>
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
