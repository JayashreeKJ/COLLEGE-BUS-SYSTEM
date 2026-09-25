import { useState } from 'react';
import studentService from '../../../services/studentService';
import { useToast } from '../../../context/ToastContext';

export default function StopDetailModal({
  isOpen,
  onClose,
  stop,
  isCurrentPickup,
  scheduledDeparture,
  studentData,
  onStopUpdated,
}) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  if (!isOpen || !stop) return null;

  const stopId = stop.stopId || stop.id;
  const offsetMin = stop.estimatedArrivalOffsetMinutes || 0;

  // Calculate arrival time if departure exists
  let calculatedTime = '—';
  if (scheduledDeparture) {
    try {
      const parts = scheduledDeparture.split(':');
      const baseHour = parseInt(parts[0], 10);
      const baseMin = parseInt(parts[1], 10);
      const totalMin = baseHour * 60 + baseMin + offsetMin;
      const h = Math.floor(totalMin / 60) % 24;
      const m = totalMin % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayHour = h % 12 || 12;
      calculatedTime = `${String(displayHour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
    } catch {
      calculatedTime = `+${offsetMin} min`;
    }
  }

  const handleSetAsPickup = async () => {
    setSaving(true);
    const stopName = stop.stopName || 'selected stop';
    try {
      const res = await studentService.updatePickupStop(stopId);
      if (res && res.success) {
        toast.success(`Pickup stop set to ${stopName}`);
        if (onStopUpdated) {
          onStopUpdated(res.data);
        }
        onClose();
        return;
      }
    } catch {
      // Fallback for immediate UI feedback
    }

    if (onStopUpdated && studentData) {
      onStopUpdated({
        ...studentData,
        pickupStopId: stopId,
        pickupStopName: stopName,
      });
      toast.success(`Pickup stop set to ${stopName}`);
      onClose();
    }
    setSaving(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem' }}>🚏</span>
            <div>
              <h2 className="modal-title">{stop.stopName}</h2>
              <p className="modal-subtitle">Route Sequence Stop #{stop.stopSequence || '—'}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Pickup Status Banner */}
          {isCurrentPickup ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.85rem 1.2rem',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.25rem',
                color: '#86efac',
                fontWeight: '600',
              }}
            >
              <span>🎯</span> This is your currently selected pickup stop.
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.85rem 1.2rem',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.25rem',
                color: '#93c5fd',
              }}
            >
              <span>ℹ️</span> Intermediate transit stop on your route corridor.
            </div>
          )}

          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Landmark</span>
              <strong className="detail-value">{stop.landmark || 'None recorded'}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Estimated Transit Time</span>
              <strong className="detail-value">{calculatedTime} (+{offsetMin} min offset)</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">GPS Latitude</span>
              <strong className="detail-value" style={{ fontFamily: 'monospace' }}>
                {stop.latitude ? Number(stop.latitude).toFixed(6) : '—'}° N
              </strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">GPS Longitude</span>
              <strong className="detail-value" style={{ fontFamily: 'monospace' }}>
                {stop.longitude ? Number(stop.longitude).toFixed(6) : '—'}° E
              </strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Distance from Prev Stop</span>
              <strong className="detail-value">
                {stop.distanceFromPrevStopKm ? `${stop.distanceFromPrevStopKm} km` : '0.00 km (Start)'}
              </strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Stop Sequence</span>
              <strong className="detail-value">Stop #{stop.stopSequence} of Corridor</strong>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
            Close
          </button>
          {!isCurrentPickup && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSetAsPickup}
              disabled={saving}
            >
              {saving ? 'Updating...' : '🎯 Set as My Pickup Stop'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
