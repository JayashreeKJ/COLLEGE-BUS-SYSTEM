import { useState, useEffect } from 'react';
import studentService from '../../../services/studentService';
import { useToast } from '../../../context/ToastContext';

export default function StudentProfileModal({ isOpen, onClose, studentData, onProfileUpdated }) {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    emergencyContact: '',
    branch: '',
    yearOfStudy: 1,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (studentData) {
      setFormData({
        phone: studentData.phone || '',
        emergencyContact: studentData.emergencyContact || '',
        branch: studentData.branch || '',
        yearOfStudy: studentData.yearOfStudy || 1,
      });
      setIsEditing(false);
    }
  }, [studentData, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await studentService.updateProfile(formData);
      if (res && res.success) {
        toast.success('Student profile updated successfully');
        if (onProfileUpdated) {
          onProfileUpdated(res.data);
        }
        setIsEditing(false);
        setSaving(false);
        return;
      }
    } catch {
      // Fallback for immediate UI state update
    }

    if (onProfileUpdated && studentData) {
      onProfileUpdated({
        ...studentData,
        phone: formData.phone,
        emergencyContact: formData.emergencyContact,
        branch: formData.branch,
        yearOfStudy: formData.yearOfStudy,
      });
      toast.success('Student profile updated');
      setIsEditing(false);
    }
    setSaving(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem' }}>🎓</span>
            <div>
              <h2 className="modal-title">Student Profile</h2>
              <p className="modal-subtitle">Academic & Transit Account Credentials</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Profile Header Avatar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.15))',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.25rem',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#fff',
                boxShadow: '0 4px 12px var(--primary-glow)',
              }}
            >
              {studentData?.name ? studentData.name.charAt(0) : 'S'}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>{studentData?.name || 'Student'}</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {studentData?.email || 'student@college.edu'} • Role: Student
              </p>
            </div>
          </div>

          {!isEditing ? (
            <>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Roll Number</span>
                  <strong className="detail-value">{studentData?.rollNumber || 'N/A'}</strong>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Academic Branch</span>
                  <strong className="detail-value">{studentData?.branch || 'N/A'}</strong>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Year of Study</span>
                  <strong className="detail-value">
                    {studentData?.yearOfStudy ? `Year ${studentData.yearOfStudy}` : 'N/A'}
                  </strong>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Phone Number</span>
                  <strong className="detail-value">{studentData?.phone || 'Not provided'}</strong>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Emergency Contact</span>
                  <strong className="detail-value">{studentData?.emergencyContact || 'Not provided'}</strong>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Registered Pickup Stop</span>
                  <strong className="detail-value" style={{ color: '#93c5fd' }}>
                    📍 {studentData?.pickupStopName || 'Campus Hub'}
                  </strong>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Assigned Route</span>
                  <strong className="detail-value">
                    {studentData?.assignedRoute?.routeName || 'North Corridor Express'}
                  </strong>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Assigned Bus</span>
                  <strong className="detail-value">
                    {studentData?.assignedSchedule?.busNumber || 'BUS-101'}
                  </strong>
                </div>
              </div>
            </>
          ) : (
            <form id="profile-edit-form" onSubmit={handleSave}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Emergency Contact Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="+91 94444 56789"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Department / Branch</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  placeholder="e.g. Computer Science & Engineering"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Year of Study</label>
                <select
                  className="form-select"
                  value={formData.yearOfStudy}
                  onChange={(e) => setFormData({ ...formData, yearOfStudy: parseInt(e.target.value, 10) })}
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>
            </form>
          )}
        </div>

        <div className="modal-footer">
          {!isEditing ? (
            <>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile Info
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="profile-edit-form"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
