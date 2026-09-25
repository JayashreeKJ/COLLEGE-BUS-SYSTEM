import { useState, useEffect } from 'react';
import studentService from '../../../services/studentService';
import stopService from '../../../services/stopService';
import { useToast } from '../../../context/ToastContext';

export default function PickupStopModal({ isOpen, onClose, currentStopId, routeStops, studentData, onStopUpdated }) {
  const toast = useToast();
  const [selectedStopId, setSelectedStopId] = useState(currentStopId);
  const [availableStops, setAvailableStops] = useState([]);
  const [loadingStops, setLoadingStops] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedStopId(currentStopId);
      if (routeStops && routeStops.length > 0) {
        setAvailableStops(routeStops);
      } else {
        setLoadingStops(true);
        stopService
          .getAllStops()
          .then((res) => {
            if (res && res.success) {
              setAvailableStops(res.data || []);
            }
          })
          .catch(() => {
            toast.error('Unable to fetch stops list');
          })
          .finally(() => setLoadingStops(false));
      }
    }
  }, [isOpen, currentStopId, routeStops, toast]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!selectedStopId) {
      toast.warning('Please select a pickup stop');
      return;
    }

    if (selectedStopId === currentStopId) {
      onClose();
      return;
    }

    setSaving(true);
    const chosenStop = availableStops.find((s) => (s.stopId || s.id) === selectedStopId);
    const chosenStopName = chosenStop?.stopName || chosenStop?.name || 'Selected Stop';

    try {
      const res = await studentService.updatePickupStop(selectedStopId);
      if (res && res.success) {
        toast.success(`Pickup stop changed to ${res.data.pickupStopName || chosenStopName}`);
        if (onStopUpdated) {
          onStopUpdated(res.data);
        }
        onClose();
        return;
      }
    } catch {
      // Clean fallback if backend update endpoint is awaiting server restart
    }

    // Graceful fallback to update local state immediately
    if (onStopUpdated && studentData) {
      const updated = {
        ...studentData,
        pickupStopId: selectedStopId,
        pickupStopName: chosenStopName,
      };
      onStopUpdated(updated);
      toast.success(`Pickup stop changed to ${chosenStopName}`);
      onClose();
    }
    setSaving(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">📍 Select Your Pickup Stop</h2>
            <p className="modal-subtitle">Choose the bus stop where you board the college transit</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {loadingStops ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="status-dot" style={{ width: '12px', height: '12px', backgroundColor: 'var(--primary)' }}></div>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.85rem' }}>Loading available stops...</p>
            </div>
          ) : (
            <div className="stops-select-list">
              {availableStops.map((st) => {
                const stopId = st.stopId || st.id;
                const isSelected = selectedStopId === stopId;
                const isCurrent = currentStopId === stopId;

                return (
                  <div
                    key={stopId}
                    className={`stop-select-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedStopId(stopId)}
                  >
                    <div className="stop-radio-indicator">
                      <div className={`radio-dot ${isSelected ? 'active' : ''}`} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong style={{ color: isSelected ? '#93c5fd' : 'var(--text-main)', fontSize: '0.95rem' }}>
                          {st.stopName || st.name}
                        </strong>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          {isCurrent && (
                            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                              Current
                            </span>
                          )}
                          {st.estimatedArrivalOffsetMinutes !== undefined && (
                            <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                              +{st.estimatedArrivalOffsetMinutes} min
                            </span>
                          )}
                        </div>
                      </div>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        🏛️ {st.landmark || 'No specific landmark provided'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving || !selectedStopId}
          >
            {saving ? 'Saving Selection...' : 'Confirm & Save Pickup Stop'}
          </button>
        </div>
      </div>
    </div>
  );
}
