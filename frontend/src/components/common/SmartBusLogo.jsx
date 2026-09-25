import React from 'react';

export default function SmartBusLogo({ size = 32, className = '', showText = false, textClass = '' }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }} className={className}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.45))' }}
      >
        <defs>
          <linearGradient id="sb-cyan-grad" x1="6" y1="2" x2="26" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <linearGradient id="sb-violet-grad" x1="10" y1="2" x2="22" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c026d3" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        {/* Primary Angular Electric Kinetic Bolt (Electric Cyan) */}
        <path
          d="M19 2L6 17H14.5L10.5 30L26 13.5H17L21 2H19Z"
          fill="url(#sb-cyan-grad)"
        />

        {/* Angular Speed & Power Facet (Electric Violet / Magenta) */}
        <path
          d="M19 2L14.5 17H21L10.5 30L17.5 18H12L21 2H19Z"
          fill="url(#sb-violet-grad)"
          opacity="0.9"
        />

        {/* Precision Cyber Edge */}
        <path
          d="M19 2L6 17H14.5L10.5 30"
          stroke="#a5f3fc"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }} className={textClass}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: '1.25rem',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: 'var(--text-main)'
            }}
          >
            SMART<span style={{ color: 'var(--accent-cyan)' }}>BUS</span>
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase'
            }}
          >
            SIET TRANSIT
          </span>
        </div>
      )}
    </div>
  );
}
