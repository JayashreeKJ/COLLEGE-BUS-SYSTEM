import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { useToast } from '../../context/ToastContext';
import { Bus, User, Phone, ShieldCheck, Users, Flame, Star, Award, CheckCircle } from 'lucide-react';

export default function BusDetailsCard() {
  const { activeBus } = useSimulation();
  const toast = useToast();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  const occupancyRatio = (activeBus.occupancy / activeBus.capacity) * 100;

  const handleCallDriver = () => {
    setIsCallModalOpen(true);
  };

  const handleInitiateDemoCall = () => {
    toast.info(`Connecting transit intercom to Driver ${activeBus.driver.name}...`);
    setTimeout(() => {
      toast.success(`Intercom connected with ${activeBus.driver.name} (${activeBus.driver.phone})`);
      setIsCallModalOpen(false);
    }, 1200);
  };

  return (
    <>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Section 1: Bus Fleet Spec */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bus size={18} style={{ color: 'var(--accent-cyan)' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Fleet Information</h3>
            </div>
            <span className="badge badge-success" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
              ● RUNNING
            </span>
          </div>

          <div
            style={{
              background: 'var(--bg-glass)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem',
              border: '1px solid var(--border-color)',
              marginBottom: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Registration Number
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                  {activeBus.busNumber}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Model Specs
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {activeBus.model}
                </div>
              </div>
            </div>

            {/* Occupancy bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={13} /> Passenger Occupancy
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                  {activeBus.occupancy} / {activeBus.capacity} seats ({occupancyRatio.toFixed(0)}%)
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '7px',
                  background: 'var(--bg-glass-strong)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${occupancyRatio}%`,
                    height: '100%',
                    background: occupancyRatio > 85 ? 'var(--warning)' : 'linear-gradient(90deg, var(--accent), var(--accent-cyan))',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Driver Profile Card */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Driver Profile</h3>
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                color: 'var(--accent-cyan)',
                fontWeight: 600
              }}
            >
              <span className="live-dot" style={{ width: '6px', height: '6px' }}></span>
              {activeBus.driver.status}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'var(--bg-glass)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)'
            }}
          >
            <img
              src={activeBus.driver.photo}
              alt={activeBus.driver.name}
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--accent)'
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                  {activeBus.driver.name}
                </h4>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontSize: '0.72rem',
                    color: '#f59e0b',
                    fontWeight: 700
                  }}
                >
                  <Star size={12} fill="#f59e0b" /> {activeBus.driver.rating}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 6px' }}>
                {activeBus.driver.experience} • Lic: {activeBus.driver.licenseNo}
              </p>
              <button
                onClick={handleCallDriver}
                className="btn btn-secondary"
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  gap: '0.35rem',
                  borderColor: 'var(--border-purple)',
                  color: 'var(--accent-cyan)'
                }}
              >
                <Phone size={13} />
                Contact Driver Intercom
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Contact Intercom Modal */}
      {isCallModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCallModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px', textAlign: 'center', padding: '1.75rem' }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(168, 85, 247, 0.15)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}
            >
              <Phone size={28} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Transit Emergency Intercom
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Direct bridge to Driver <strong>{activeBus.driver.name}</strong> on Bus 12
            </p>

            <div
              style={{
                background: 'var(--bg-glass-strong)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-purple)',
                marginBottom: '1.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--accent-cyan)'
              }}
            >
              {activeBus.driver.phone}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setIsCallModalOpen(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleInitiateDemoCall}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <Phone size={15} /> Dial Intercom
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
