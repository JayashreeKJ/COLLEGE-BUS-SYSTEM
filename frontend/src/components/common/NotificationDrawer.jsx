import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Bell, Check, Trash2, X, AlertTriangle, Info, CheckCircle2, Bus } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose }) {
  const { notifications, markAllNotificationsRead, clearNotifications } = useSimulation();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '460px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.2rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bell size={20} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Transit Notifications</h3>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Toolbar */}
        <div
          style={{
            padding: '0.6rem 1.5rem',
            background: 'var(--bg-glass-strong)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.78rem'
          }}
        >
          <button
            onClick={markAllNotificationsRead}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600
            }}
          >
            <Check size={14} /> Mark all read
          </button>

          <button
            onClick={clearNotifications}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Trash2 size={14} /> Clear all
          </button>
        </div>

        {/* Notification List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Bell size={36} style={{ opacity: 0.3, margin: '0 auto 0.75rem' }} />
              <p>No new notifications</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {notifications.map((notif) => {
                const isWarning = notif.type === 'warning';
                const isSuccess = notif.type === 'success';

                return (
                  <div
                    key={notif.id}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: notif.read ? 'var(--bg-glass)' : 'rgba(139, 92, 246, 0.08)',
                      border: notif.read
                        ? '1px solid var(--border-color)'
                        : '1px solid var(--border-purple)',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'flex-start',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div
                      style={{
                        padding: '6px',
                        borderRadius: '50%',
                        background: isWarning
                          ? 'rgba(245, 158, 11, 0.15)'
                          : isSuccess
                          ? 'var(--success-bg)'
                          : 'rgba(168, 85, 247, 0.15)',
                        color: isWarning
                          ? 'var(--warning)'
                          : isSuccess
                          ? 'var(--accent-cyan)'
                          : 'var(--accent)',
                        flexShrink: 0
                      }}
                    >
                      {isWarning ? <AlertTriangle size={15} /> : isSuccess ? <CheckCircle2 size={15} /> : <Bus size={15} />}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                          {notif.title}
                        </h4>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                          {notif.time}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                        {notif.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
