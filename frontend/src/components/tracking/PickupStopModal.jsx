import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { useToast } from '../../context/ToastContext';
import { MapPin, Search, Check, X, Clock, Navigation } from 'lucide-react';

export default function PickupStopModal({ isOpen, onClose }) {
  const { stops, selectedPickupStopId, setSelectedPickupStopId } = useSimulation();
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  if (!isOpen) return null;

  const filteredStops = stops.filter(
    (stop) =>
      stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stop.landmark.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stop.scheduledTime.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectStop = (stop) => {
    setSelectedPickupStopId(stop.id);
    toast.success(`Pickup stop updated to ${stop.name} (${stop.scheduledTime})`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(168, 85, 247, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)'
              }}
            >
              <MapPin size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                Choose Your Pickup Stop
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Select from official Sri Shakthi (SIET) transit stops along the Coimbatore corridor
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Search Input */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative' }}>
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
              style={{ paddingLeft: '38px', fontSize: '0.9rem' }}
              placeholder="Search stop name, landmark, or time (e.g. Singanallur, Gandhipuram)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Stops List */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '0.75rem 1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredStops.map((stop) => {
              const isSelected = stop.id === selectedPickupStopId;

              return (
                <div
                  key={stop.id}
                  onClick={() => handleSelectStop(stop)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'rgba(168, 85, 247, 0.15)' : 'var(--bg-glass)',
                    border: isSelected
                      ? '1px solid var(--border-purple)'
                      : '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-purple)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isSelected ? 'var(--primary)' : 'var(--bg-glass-strong)',
                        color: isSelected ? '#ffffff' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      {stop.sequence}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {stop.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        📍 {stop.landmark} • {stop.distanceFromStart}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: isSelected ? 'var(--accent-magenta-light)' : 'var(--accent-cyan)',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {stop.scheduledTime}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        Scheduled
                      </div>
                    </div>

                    {isSelected && (
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'var(--accent)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredStops.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                No stops found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-dim)'
          }}
        >
          <span>Selection is automatically saved to your student profile</span>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.4rem 0.9rem' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
