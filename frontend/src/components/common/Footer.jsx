import React from 'react';
import { Link } from 'react-router-dom';
import { useSimulation } from '../../context/SimulationContext';
import SmartBusLogo from './SmartBusLogo';
import { Bus, MapPin, Phone, Shield, Radio, Heart } from 'lucide-react';

export default function Footer() {
  const { collegeInfo, backendOnline } = useSimulation();

  return (
    <footer
      style={{
        background: 'rgba(6, 8, 14, 0.95)',
        borderTop: '1px solid var(--border-color)',
        padding: '2.5rem 1.5rem 1.5rem',
        marginTop: 'auto',
        color: 'var(--text-muted)'
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}
      >
        {/* Column 1: College & System */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <SmartBusLogo size={32} showText={true} />
          </div>
          <p style={{ fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
            {collegeInfo.tagline} Real-time intelligent fleet tracking platform for Sri Shakthi Institute of Engineering & Technology (SIET), Coimbatore.
          </p>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            📍 {collegeInfo.address}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.85rem' }}>
            Campus Transit
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
            <li>
              <Link to="/student" style={{ color: 'var(--text-muted)' }}>
                Live Transit Radar
              </Link>
            </li>
            <li>
              <Link to="/student/route" style={{ color: 'var(--text-muted)' }}>
                Coimbatore Corridor Stops
              </Link>
            </li>
            <li>
              <Link to="/student/schedule" style={{ color: 'var(--text-muted)' }}>
                Timetables & Shifts
              </Link>
            </li>
            <li>
              <Link to="/admin" style={{ color: 'var(--text-muted)' }}>
                Fleet Admin Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Emergency & Helpline */}
        <div>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.85rem' }}>
            Transit Emergency Contacts
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
            <div>
              <div style={{ color: 'var(--text-dim)' }}>Campus Control Helpline:</div>
              <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                {collegeInfo.helpline}
              </strong>
            </div>
            <div>
              <div style={{ color: 'var(--text-dim)' }}>Transport Officer In-charge:</div>
              <strong style={{ color: 'var(--text-main)' }}>{collegeInfo.transportIncharge}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span className="live-dot" style={{ width: '6px', height: '6px' }}></span>
              <span style={{ fontSize: '0.75rem', color: backendOnline ? 'var(--primary)' : 'var(--warning)' }}>
                {backendOnline ? 'Spring Boot API Online' : 'Local Autonomous Simulation Mode'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.78rem',
          color: 'var(--text-dim)'
        }}
      >
        <div>
          © {new Date().getFullYear()} Sri Shakthi Institute of Engineering and Technology (SIET). All rights reserved.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          Crafted for Coimbatore Campus Transportation
        </div>
      </div>
    </footer>
  );
}
