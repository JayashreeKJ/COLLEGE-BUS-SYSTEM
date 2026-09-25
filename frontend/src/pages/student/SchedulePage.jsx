import React, { useState } from 'react';
import { SCHEDULES, BUS_FLEET } from '../../data/busFleetData';
import { useToast } from '../../context/ToastContext';
import SmartBusLogo from '../../components/common/SmartBusLogo';
import {
  Calendar,
  Clock,
  Bus,
  Search,
  Filter,
  CheckCircle2,
  Navigation,
  ArrowRight,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SchedulePage() {
  const [selectedShift, setSelectedShift] = useState('ALL'); // 'ALL' | 'Morning' | 'Afternoon' | 'Evening'
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const filteredSchedules = SCHEDULES.filter((sched) => {
    const matchesShift = selectedShift === 'ALL' || sched.type === selectedShift;
    const matchesSearch =
      sched.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sched.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sched.shift.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesShift && matchesSearch;
  });

  return (
    <div className="main-content" style={{ maxWidth: '1200px', padding: '1.5rem 1.5rem 3.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <Calendar size={22} style={{ color: 'var(--primary)' }} />
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Campus Transit Timetable & Shifts
          </h1>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Official morning pickup, exam special, and evening drop-off timetables for Sri Shakthi (SIET) fleet
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        {/* Shift Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Shifts' },
            { id: 'Morning', label: 'Morning Pickup', icon: <Sun size={14} /> },
            { id: 'Afternoon', label: 'Afternoon Exam', icon: <Sunset size={14} /> },
            { id: 'Evening', label: 'Evening Drop-off', icon: <Moon size={14} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedShift(tab.id)}
              className="btn"
              style={{
                padding: '0.45rem 0.95rem',
                fontSize: '0.85rem',
                background: selectedShift === tab.id ? 'var(--primary)' : 'var(--bg-glass-strong)',
                color: selectedShift === tab.id ? '#000000' : 'var(--text-muted)',
                border: selectedShift === tab.id ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                fontWeight: selectedShift === tab.id ? 700 : 500
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-dim)'
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', fontSize: '0.88rem' }}
            placeholder="Search bus, route, or shift..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Schedule Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {filteredSchedules.map((sched) => {
          const isRunning = sched.status === 'Running';

          return (
            <div
              key={sched.id}
              className="card glow-border"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <SmartBusLogo size={28} />
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                        {sched.busNumber}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {sched.shift}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`badge ${isRunning ? 'badge-success' : 'badge-neutral'}`}
                    style={{ fontSize: '0.72rem' }}
                  >
                    {isRunning && <span className="live-dot" style={{ width: '6px', height: '6px' }}></span>}
                    {sched.status.toUpperCase()}
                  </span>
                </div>

                {/* Route String */}
                <div
                  style={{
                    background: 'var(--bg-glass-strong)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    fontWeight: 600,
                    marginBottom: '1rem'
                  }}
                >
                  📍 {sched.route}
                </div>

                {/* Timing Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                  }}
                >
                  <div style={{ background: 'var(--bg-glass)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      Departure
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                      {sched.departureTime}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-glass)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      Arrival SIET
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#ef4444' }}>
                      {sched.arrivalTime}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <Link
                to="/student"
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '0.85rem', justifyContent: 'center' }}
              >
                Track This Bus Live →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
