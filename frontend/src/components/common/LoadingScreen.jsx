import React, { useState, useEffect } from 'react';
import SmartBusLogo from './SmartBusLogo';
import { Radio, Shield, CheckCircle2 } from 'lucide-react';

export default function LoadingScreen({ onComplete }) {
  const [stage, setStage] = useState(0); // 0: connecting, 1: calibrating, 2: online

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 600);
    const t2 = setTimeout(() => setStage(2), 1200);
    const t3 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#06080e',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      <div style={{ marginBottom: '1.5rem', animation: 'pulse-glow 1.5s infinite' }}>
        <SmartBusLogo size={64} />
      </div>

      <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.25rem', color: '#ffffff' }}>
        SMART<span style={{ color: 'var(--primary)' }}>BUS</span>
      </h1>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>
        SRI SHAKTHI INSTITUTE OF ENGINEERING & TECHNOLOGY (SIET)
      </p>

      {/* Progress Line */}
      <div
        style={{
          width: '240px',
          height: '4px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '9999px',
          overflow: 'hidden',
          marginBottom: '1.25rem'
        }}
      >
        <div
          style={{
            height: '100%',
            width: stage === 0 ? '35%' : stage === 1 ? '75%' : '100%',
            background: 'var(--primary)',
            boxShadow: '0 0 12px var(--primary-glow)',
            transition: 'width 0.5s ease'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
        {stage < 2 ? (
          <>
            <span className="live-dot" style={{ width: '6px', height: '6px' }}></span>
            <span style={{ color: 'var(--text-muted)' }}>
              {stage === 0 ? 'Connecting to campus transportation...' : 'Calibrating Coimbatore corridor waypoints...'}
            </span>
          </>
        ) : (
          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
            ● SYSTEM ONLINE — TRANSIT READY
          </span>
        )}
      </div>
    </div>
  );
}
