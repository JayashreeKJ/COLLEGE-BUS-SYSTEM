import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import SmartBusLogo from '../components/common/SmartBusLogo';
import {
  Bus,
  MapPin,
  Radio,
  Navigation,
  Shield,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Compass,
  Cpu
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { stops, collegeInfo, activeBus, currentLocation, progressPercent } = useSimulation();

  return (
    <div className="main-content" style={{ maxWidth: '1360px', padding: '1rem 1.5rem 3rem' }}>
      {/* Hero Section */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
          padding: '2.5rem 0 3.5rem',
          position: 'relative'
        }}
      >
        {/* Left Column: Hero Text & Call to Action */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-dim)',
              border: '1px solid var(--primary-glow)',
              marginBottom: '1.5rem'
            }}
          >
            <span className="live-dot" style={{ width: '8px', height: '8px' }}></span>
            <span
              style={{
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--primary)',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}
            >
              REAL-TIME CAMPUS TRANSIT RADAR
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <SmartBusLogo size={56} />
            <h1
              style={{
                fontSize: '3.4rem',
                lineHeight: 1,
                letterSpacing: '-0.03em',
                fontWeight: 900,
                margin: 0
              }}
            >
              SMART<span style={{ color: 'var(--primary)' }}>BUS</span>
            </h1>
          </div>

          <div
            style={{
              fontSize: '1.3rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              marginBottom: '0.75rem',
              letterSpacing: '-0.01em'
            }}
          >
            College Bus Tracking & Management System
          </div>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '560px'
            }}
          >
            "Your campus. Your route. Your bus — live." Track your college bus in real-time along the Coimbatore corridor, receive precision arrival alerts for your stop, and reach Sri Shakthi Institute safely.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <Link
              to="/student"
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.85rem', fontSize: '1rem', gap: '0.6rem' }}
            >
              <Radio size={18} /> Track My Bus
            </Link>

            <Link
              to="/student/route"
              className="btn btn-secondary"
              style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', gap: '0.6rem' }}
            >
              View Routes & Stops →
            </Link>

            <Link
              to="/login"
              className="btn btn-secondary"
              style={{ padding: '0.85rem 1.5rem', fontSize: '1rem' }}
            >
              Student Portal
            </Link>
          </div>

          {/* Real Coimbatore Highlights */}
          <div
            style={{
              display: 'flex',
              gap: '1.75rem',
              flexWrap: 'wrap',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1.5rem'
            }}
          >
            <div>
              <div className="telemetry-num telemetry-glow" style={{ fontSize: '1.5rem' }}>
                25 Stops
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Coimbatore Corridor</div>
            </div>

            <div>
              <div className="telemetry-num" style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
                45.2 km
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pappampatti → SIET</div>
            </div>

            <div>
              <div className="telemetry-num" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
                40 km/h
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Governor Controlled</div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Miniature Radar Map Preview */}
        <div>
          <div
            className="card glow-border"
            style={{
              padding: '1.5rem',
              background: 'linear-gradient(145deg, rgba(13, 17, 26, 0.95), rgba(7, 9, 14, 0.98))',
              position: 'relative'
            }}
          >
            {/* Live Radar Top Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="live-indicator">
                  <span className="live-dot"></span>
                  LIVE TELEMETRY
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>BUS 12</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                COIMBATORE CORRIDOR
              </span>
            </div>

            {/* Simulated Animated Mini Radar Display */}
            <div
              style={{
                position: 'relative',
                height: '240px',
                background: 'rgba(0, 0, 0, 0.6)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.25rem'
              }}
            >
              {/* Grid Lines Pattern */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'radial-gradient(circle, rgba(0,255,102,0.12) 1px, transparent 1px), linear-gradient(rgba(0,255,102,0.04) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                  pointerEvents: 'none'
                }}
              />

              {/* Waypoint Route Line in Mini HUD */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '10%',
                  right: '10%',
                  height: '3px',
                  background: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-50%)'
                }}
              >
                {/* Active Glowing Segment */}
                <div
                  style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: 'var(--primary)',
                    boxShadow: '0 0 12px var(--primary-glow)',
                    position: 'relative'
                  }}
                >
                  {/* Moving Bus Pin */}
                  <div
                    style={{
                      position: 'absolute',
                      right: '-16px',
                      top: '-15px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      color: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      boxShadow: '0 0 16px var(--primary)',
                      border: '2px solid #ffffff'
                    }}
                  >
                    <Bus size={18} color="#000000" />
                  </div>
                </div>
              </div>

              {/* Top HUD Stats */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  position: 'relative',
                  zIndex: 2,
                  fontSize: '0.78rem'
                }}
              >
                <div>
                  <div style={{ color: 'var(--text-dim)' }}>ORIGIN</div>
                  <strong style={{ color: 'var(--text-main)' }}>Pappampatti (6:20 AM)</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--text-dim)' }}>CAMPUS DESTINATION</div>
                  <strong style={{ color: '#ef4444' }}>SIET (8:13 AM)</strong>
                </div>
              </div>

              {/* Bottom HUD Active Coordinates */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>CURRENT SPEED</div>
                  <div className="telemetry-num telemetry-glow" style={{ fontSize: '1.3rem' }}>
                    {currentLocation.speed} <span style={{ fontSize: '0.75rem' }}>km/h</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  GPS: {currentLocation.lat.toFixed(4)}°N, {currentLocation.lng.toFixed(4)}°E
                </div>
              </div>
            </div>

            {/* Quick Launch Track Banner */}
            <div
              style={{
                marginTop: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Open Live Command Radar</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Full self-contained vector map + stop sequencer
                </div>
              </div>
              <button
                onClick={() => navigate('/student')}
                className="btn btn-primary"
                style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}
              >
                Launch Map →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ marginTop: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            Futuristic Transit Technology for Campus Fleet
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto' }}>
            Built specifically for Sri Shakthi Institute of Engineering and Technology (SIET) students, faculty, and administrators.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {/* Card 1 */}
          <div className="card">
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 255, 102, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Radio size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Live Satellite GPS</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Real-time vehicle telemetry along Coimbatore arteries with speed governor monitoring, distance tickers, and dynamic heading calculation.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card">
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <MapPin size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Personal Pickup Alerts</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Select your pickup stop from Singanallur, Gandhipuram, Ondipudur, or other 22 stops to receive precision proximity countdown alerts.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card">
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(245, 158, 11, 0.12)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Capacity & Driver Info</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Inspect live passenger occupancy counters, driver credentials, emergency contact intercoms, and safety gear verification.
            </p>
          </div>

          {/* Card 4 */}
          <div className="card">
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Fleet Command Center</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Administrative dispatch management for route scheduling, driver assignment, delay analytics, and trip coordination.
            </p>
          </div>
        </div>
      </section>

      {/* College Campus Info Banner */}
      <section
        className="card"
        style={{
          marginTop: '3rem',
          background: 'linear-gradient(135deg, rgba(13, 17, 26, 0.95), rgba(20, 26, 40, 0.95))',
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          padding: '1.75rem 2rem'
        }}
      >
        <div>
          <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
            Official Transit Hub
          </span>
          <h3 style={{ fontSize: '1.3rem', margin: '4px 0 6px 0' }}>{collegeInfo.name}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '650px' }}>
            📍 {collegeInfo.address}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link
            to="/student"
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
          >
            Open Live Map
          </Link>
        </div>
      </section>
    </div>
  );
}
