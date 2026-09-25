import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../context/SimulationContext';
import { useToast } from '../../context/ToastContext';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  MapPin,
  Save,
  CheckCircle2,
  Shield,
  Award,
  HeartPulse
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { stops, selectedPickupStopId, setSelectedPickupStopId } = useSimulation();
  const toast = useToast();

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('smartbus_student_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      name: user?.name || 'Jayashree K.',
      regNo: '714022104055',
      dept: 'B.E. Computer Science & Engineering',
      year: 'III Year (2022 - 2026)',
      email: user?.email || 'student@college.edu',
      phone: '+91 98401 23456',
      bloodGroup: 'O+ve',
      emergencyContactName: 'K. Rajendran (Father)',
      emergencyContactPhone: '+91 94433 11223',
      busPassId: 'SIET-BP-2026-8891'
    };
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('smartbus_student_profile', JSON.stringify(profile));
    toast.success('Student transit profile updated successfully');
    setIsEditing(false);
  };

  return (
    <div className="main-content" style={{ maxWidth: '900px', padding: '1.5rem 1.5rem 3.5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <User size={22} style={{ color: 'var(--accent-cyan)' }} />
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Student Transit Profile
            </h1>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Sri Shakthi Institute of Engineering and Technology (SIET) — Transportation Pass & Registry
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
          style={{ fontSize: '0.88rem' }}
        >
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      <form onSubmit={handleSave}>
        {/* Main Identity Card */}
        <div className="card glow-border" style={{ marginBottom: '1.5rem', padding: '1.75rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '1.5rem',
              marginBottom: '1.5rem'
            }}
          >
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-cyan))',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 900,
                boxShadow: '0 0 20px var(--primary-glow)'
              }}
            >
              🎓
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                  {profile.name}
                </h2>
                <span className="badge badge-success">ACTIVE TRANSIT PASS</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0', fontFamily: 'var(--font-mono)' }}>
                Reg: {profile.regNo} • Pass #{profile.busPassId}
              </p>
            </div>
          </div>

          {/* Grid of Profile Fields */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem'
            }}
          >
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                disabled={!isEditing}
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Register Number</label>
              <input
                type="text"
                className="form-input"
                disabled={!isEditing}
                value={profile.regNo}
                onChange={(e) => setProfile({ ...profile, regNo: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-input"
                disabled={!isEditing}
                value={profile.dept}
                onChange={(e) => setProfile({ ...profile, dept: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Year of Study</label>
              <input
                type="text"
                className="form-input"
                disabled={!isEditing}
                value={profile.year}
                onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                disabled={!isEditing}
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Phone</label>
              <input
                type="text"
                className="form-input"
                disabled={!isEditing}
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Transit & Emergency Settings */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Transit & Safety Preferences
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem'
            }}
          >
            <div className="form-group">
              <label className="form-label">Default Morning Pickup Stop</label>
              <select
                className="form-select"
                disabled={!isEditing}
                value={selectedPickupStopId}
                onChange={(e) => setSelectedPickupStopId(e.target.value)}
              >
                {stops.map((stop) => (
                  <option key={stop.id} value={stop.id}>
                    {stop.sequence}. {stop.name} ({stop.scheduledTime})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <input
                type="text"
                className="form-input"
                disabled={!isEditing}
                value={profile.bloodGroup}
                onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Contact Name</label>
              <input
                type="text"
                className="form-input"
                disabled={!isEditing}
                value={profile.emergencyContactName}
                onChange={(e) => setProfile({ ...profile, emergencyContactName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Contact Phone</label>
              <input
                type="text"
                className="form-input"
                disabled={!isEditing}
                value={profile.emergencyContactPhone}
                onChange={(e) => setProfile({ ...profile, emergencyContactPhone: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ gap: '0.5rem' }}>
              <Save size={16} /> Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
