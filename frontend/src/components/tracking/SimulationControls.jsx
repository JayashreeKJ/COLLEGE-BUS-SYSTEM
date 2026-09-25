import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { useToast } from '../../context/ToastContext';
import { Play, Pause, RotateCcw, FastForward, StepForward, Activity, Sparkles, Cpu } from 'lucide-react';

export default function SimulationControls() {
  const {
    isPlaying,
    togglePlay,
    resetSimulation,
    stepForward,
    speedMultiplier,
    setSpeedMultiplier,
    backendOnline
  } = useSimulation();

  const toast = useToast();

  const handleTogglePlay = () => {
    togglePlay();
    if (isPlaying) {
      toast.warning('GPS simulation paused');
    } else {
      toast.success('Live GPS simulation resumed');
    }
  };

  const handleSpeedChange = (spd) => {
    setSpeedMultiplier(spd);
    toast.info(`Simulation speed adjusted to ${spd}x`);
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1rem 1.25rem'
      }}
    >
      {/* Left: Mode Badge & Description */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.7rem',
            borderRadius: 'var(--radius-full)',
            background: backendOnline ? 'var(--success-bg)' : 'rgba(245, 158, 11, 0.15)',
            border: backendOnline ? '1px solid var(--border-cyan)' : '1px solid rgba(245, 158, 11, 0.4)',
            color: backendOnline ? 'var(--accent-cyan)' : 'var(--warning)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 700
          }}
        >
          <Cpu size={14} />
          {backendOnline ? 'LIVE BACKEND ACTIVE' : 'TELEMETRY SIMULATOR'}
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {isPlaying ? 'Autonomous satellite waypoint tracking running' : 'Tracking stream paused'}
        </span>
      </div>

      {/* Right: Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className={`btn ${isPlaying ? 'btn-secondary' : 'btn-primary'}`}
          style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
          title={isPlaying ? 'Pause tracking simulation' : 'Resume live tracking'}
        >
          {isPlaying ? (
            <>
              <Pause size={15} /> Pause
            </>
          ) : (
            <>
              <Play size={15} /> Resume
            </>
          )}
        </button>

        {/* Step Forward */}
        <button
          onClick={stepForward}
          className="btn btn-secondary"
          style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
          title="Jump to next sequential stop"
        >
          <StepForward size={15} /> Next Stop
        </button>

        {/* Speed Multipliers */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-glass-strong)',
            padding: '2px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)'
          }}
        >
          {[1, 2, 5].map((spd) => (
            <button
              key={spd}
              onClick={() => handleSpeedChange(spd)}
              style={{
                background: speedMultiplier === spd ? 'var(--accent-cyan)' : 'transparent',
                color: speedMultiplier === spd ? '#070711' : 'var(--text-muted)',
                border: 'none',
                padding: '0.35rem 0.65rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                transition: 'all 0.15s ease'
              }}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Reset / Refresh */}
        <button
          onClick={resetSimulation}
          className="btn btn-icon"
          title="Reset simulation to Stop 1 (Pappampatti Pirivu)"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
}
