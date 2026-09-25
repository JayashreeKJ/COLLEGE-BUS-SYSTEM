import React, { useState, useRef, useMemo } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { useTheme } from '../../context/ThemeContext';
import SmartBusLogo from '../common/SmartBusLogo';
import { Locate, Maximize2, Compass, Layers, MapPin, Navigation, Bus, ZoomIn, ZoomOut, RotateCcw, Crosshair } from 'lucide-react';

export default function InteractiveMapView({ onSelectStop, height = '560px' }) {
  const {
    stops,
    currentLocation,
    currentStop,
    nextStop,
    progressIndex,
    selectedPickupStopId,
    collegeInfo,
    activeBus
  } = useSimulation();

  const { isDark } = useTheme();

  // Map viewport pan & zoom state
  const [zoomLevel, setZoomLevel] = useState(1); // 1 to 2.5
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedStopPopup, setSelectedStopPopup] = useState(null);
  const [mapMode, setMapMode] = useState('tactical'); // 'tactical' | 'grid'

  const containerRef = useRef(null);

  // Projection logic: Converts Coimbatore Lat/Lng coordinates into SVG canvas (1000x680)
  const mapWidth = 1000;
  const mapHeight = 680;
  const padding = 70;

  // Exact Bounding box for Coimbatore Route
  const bounds = useMemo(() => {
    let minLat = 10.975;
    let maxLat = 11.200;
    let minLng = 76.920;
    let maxLng = 77.095;
    return { minLat, maxLat, minLng, maxLng };
  }, []);

  const projectPoint = (lat, lng) => {
    const xRatio = (lng - bounds.minLng) / (bounds.maxLng - bounds.minLng);
    const yRatio = (lat - bounds.minLat) / (bounds.maxLat - bounds.minLat);

    const x = padding + xRatio * (mapWidth - 2 * padding);
    const y = mapHeight - (padding + yRatio * (mapHeight - 2 * padding));
    return { x, y };
  };

  // Projected positions for all stops
  const projectedStops = useMemo(() => {
    return stops.map((stop) => {
      const { x, y } = projectPoint(stop.lat, stop.lng);
      return { ...stop, x, y };
    });
  }, [stops, mapWidth, mapHeight, padding]);

  // Projected position for current animated bus
  const projectedBus = useMemo(() => {
    return projectPoint(currentLocation.lat, currentLocation.lng);
  }, [currentLocation.lat, currentLocation.lng]);

  // Generate SVG polyline path string
  const routePathString = useMemo(() => {
    if (projectedStops.length === 0) return '';
    return projectedStops.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  }, [projectedStops]);

  // Major Coimbatore Road Vectors for visual context
  const majorRoads = useMemo(() => {
    // 1. Trichy Road (Pappampatti -> Singanallur -> Ramanathapuram -> Lakshmi Mills)
    const trichyRd = [
      projectPoint(10.9852, 77.0864),
      projectPoint(10.9978, 77.0421),
      projectPoint(11.0038, 77.0182),
      projectPoint(11.0012, 76.9924),
      projectPoint(11.0112, 76.9791)
    ];

    // 2. Avinashi Road (Lakshmi Mills -> Hope College -> Chinniyampalayam -> SIET Bypass)
    const avinashiRd = [
      projectPoint(11.0112, 76.9791),
      projectPoint(11.0250, 77.0000),
      projectPoint(11.0350, 77.0350),
      projectPoint(11.0337, 77.0784)
    ];

    // 3. Mettupalayam Road (Gandhipuram -> Saibaba Colony -> Thudiyalur -> Press Colony -> Mathampalayam)
    const metupalayamRd = [
      projectPoint(11.0178, 76.9672),
      projectPoint(11.0335, 76.9458),
      projectPoint(11.0725, 76.9351),
      projectPoint(11.1465, 76.9291),
      projectPoint(11.1892, 76.9251)
    ];

    // 4. L&T Bypass Corridor
    const ltBypass = [
      projectPoint(10.9800, 77.0500),
      projectPoint(11.0100, 77.0700),
      projectPoint(11.0337, 77.0784),
      projectPoint(11.0850, 77.0250)
    ];

    return { trichyRd, avinashiRd, metupalayamRd, ltBypass };
  }, [mapWidth, mapHeight]);

  const pathToD = (pts) => pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

  // Viewport Control Handlers
  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.5, z + 0.3));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(1, z - 0.3));
  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedStopPopup(null);
  };

  const handleFocusBus = () => {
    setZoomLevel(1.6);
    const cx = mapWidth / 2 - projectedBus.x * 1.6;
    const cy = mapHeight / 2 - projectedBus.y * 1.6;
    setPanOffset({ x: cx, y: cy });
  };

  const handleFocusPickup = () => {
    const pStop = projectedStops.find((s) => s.id === selectedPickupStopId);
    if (pStop) {
      setZoomLevel(1.6);
      const cx = mapWidth / 2 - pStop.x * 1.6;
      const cy = mapHeight / 2 - pStop.y * 1.6;
      setPanOffset({ x: cx, y: cy });
    }
  };

  const handleStopClick = (stop) => {
    setSelectedStopPopup(stop);
    if (onSelectStop) onSelectStop(stop);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-purple)',
        boxShadow: 'var(--shadow-card)',
        background: '#070711'
      }}
    >
      {/* Self-Contained SVG Map Canvas */}
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          cursor: 'grab',
          position: 'relative'
        }}
      >
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          style={{
            width: '100%',
            height: '100%',
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <defs>
            {/* Cyberpunk Atmospheric Background Gradients */}
            <radialGradient id="map-bg-glow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#171526" stopOpacity="0.4" />
              <stop offset="40%" stopColor="#11101d" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#070711" stopOpacity="0.98" />
            </radialGradient>

            <linearGradient id="route-glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#c026d3" />
            </linearGradient>

            <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="bus-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Canvas Dark Background Base */}
          <rect width={mapWidth} height={mapHeight} fill="url(#map-bg-glow)" />

          {/* Futuristic Cyberpunk Grid Lines */}
          <g opacity="0.10" stroke="#8b5cf6" strokeWidth="0.6">
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1={0} x2={i * 50} y2={mapHeight} />
            ))}
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={`h-${i}`} x1={0} y1={i * 50} x2={mapWidth} y2={i * 50} />
            ))}
          </g>

          {/* Background Major Coimbatore Road Network */}
          <g stroke="rgba(255, 255, 255, 0.07)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d={pathToD(majorRoads.trichyRd)} />
            <path d={pathToD(majorRoads.avinashiRd)} />
            <path d={pathToD(majorRoads.metupalayamRd)} />
            <path d={pathToD(majorRoads.ltBypass)} />
          </g>
          <g stroke="rgba(168, 85, 247, 0.25)" strokeWidth="2" strokeDasharray="6, 4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d={pathToD(majorRoads.trichyRd)} />
            <path d={pathToD(majorRoads.avinashiRd)} />
            <path d={pathToD(majorRoads.metupalayamRd)} />
            <path d={pathToD(majorRoads.ltBypass)} />
          </g>

          {/* Major Road Map Vector Labels */}
          <g fill="#a1a1b5" fontSize="10" fontFamily="var(--font-mono)" opacity="0.65">
            <text x={majorRoads.trichyRd[1].x - 30} y={majorRoads.trichyRd[1].y + 16}>TRICHY ROAD (NH 81)</text>
            <text x={majorRoads.avinashiRd[1].x + 10} y={majorRoads.avinashiRd[1].y - 10}>AVINASHI ROAD (NH 544)</text>
            <text x={majorRoads.metupalayamRd[2].x + 10} y={majorRoads.metupalayamRd[2].y}>METTUPALAYAM RD (NH 181)</text>
            <text x={majorRoads.ltBypass[1].x + 15} y={majorRoads.ltBypass[1].y}>L&amp;T BYPASS CORRIDOR</text>
          </g>

          {/* SmartBus Active Route Outer Glow Line */}
          <path
            d={routePathString}
            fill="none"
            stroke="url(#route-glow-grad)"
            strokeWidth="8"
            strokeOpacity="0.45"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neon-glow)"
          />

          {/* SmartBus Main Active Route Polyline (Electric Cyan) */}
          <path
            d={routePathString}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8, 6"
          />

          {/* Route Stops Render */}
          {projectedStops.map((stop, index) => {
            const isCompleted = index < Math.floor(progressIndex);
            const isCurrent = Math.floor(progressIndex) === index;
            const isPickup = stop.id === selectedPickupStopId;
            const isSIET = index === projectedStops.length - 1;

            return (
              <g key={stop.id} onClick={() => handleStopClick(stop)} style={{ cursor: 'pointer' }}>
                {/* SIET Destination Landmark Badge */}
                {isSIET ? (
                  <g transform={`translate(${stop.x}, ${stop.y})`}>
                    <circle r="22" fill="rgba(192, 38, 211, 0.3)" filter="url(#neon-glow)" />
                    <circle r="14" fill="linear-gradient(135deg, #c026d3, #7c3aed)" stroke="#f5f3ff" strokeWidth="2" />
                    <text y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900" fontFamily="var(--font-heading)">
                      SIET
                    </text>
                    <g transform="translate(0, 32)">
                      <rect x="-65" y="-12" width="130" height="22" rx="6" fill="#0b0a16" stroke="#c026d3" strokeWidth="1.2" />
                      <text x="0" y="3" textAnchor="middle" fill="#e879f9" fontSize="9" fontWeight="800" fontFamily="var(--font-mono)">
                        SIET MAIN CAMPUS
                      </text>
                    </g>
                  </g>
                ) : (
                  /* Standard Stop Node */
                  <g transform={`translate(${stop.x}, ${stop.y})`}>
                    {/* Pickup stop glowing aura */}
                    {isPickup && (
                      <>
                        <circle r="16" fill="rgba(232, 121, 249, 0.3)" filter="url(#neon-glow)" />
                        <g transform="translate(0, -22)">
                          <rect x="-35" y="-10" width="70" height="16" rx="4" fill="#c026d3" />
                          <text x="0" y="2" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900" fontFamily="var(--font-mono)">
                            MY STOP
                          </text>
                        </g>
                      </>
                    )}

                    {/* Node circle */}
                    <circle
                      r={isCurrent ? 9 : isPickup ? 8 : 6}
                      fill={isCurrent ? '#ffffff' : isPickup ? '#e879f9' : isCompleted ? '#8b5cf6' : '#171526'}
                      stroke={isCurrent ? '#22d3ee' : isCompleted ? '#a855f7' : 'rgba(255,255,255,0.3)'}
                      strokeWidth={isCurrent ? 3 : 1.5}
                      filter={isCurrent || isPickup ? 'url(#neon-glow)' : 'none'}
                    />

                    {/* Stop Name Label */}
                    <text
                      y="-12"
                      textAnchor="middle"
                      fill={isCurrent ? '#22d3ee' : isPickup ? '#e879f9' : '#a1a1b5'}
                      fontSize="9"
                      fontWeight="700"
                      fontFamily="var(--font-mono)"
                    >
                      {stop.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Animated Active SmartBus Marker */}
          <g transform={`translate(${projectedBus.x}, ${projectedBus.y})`}>
            {/* Pulsing Radar Ring (Electric Cyan & Violet) */}
            <circle r="26" fill="rgba(34, 211, 238, 0.25)" filter="url(#bus-glow)">
              <animate attributeName="r" values="18;32;18" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.85;0.15;0.85" dur="2s" repeatCount="indefinite" />
            </circle>

            <circle r="16" fill="#22d3ee" stroke="#ffffff" strokeWidth="2.5" filter="url(#bus-glow)" />

            {/* Vector Bus Symbol */}
            <g transform="translate(-10, -10) scale(0.65)">
              <path
                d="M 4 8 C 4 6 6 4 9 4 L 21 4 C 24 4 26 6 26 8 L 26 22 C 26 24 24 26 21 26 L 9 26 C 6 26 4 24 4 22 Z M 7 9 L 23 9 M 7 14 L 23 14 M 8 20 A 2 2 0 1 0 8 20.1 M 22 20 A 2 2 0 1 0 22 20.1"
                stroke="#070711"
                strokeWidth="2.5"
                fill="none"
              />
            </g>

            {/* Floating Live Telemetry Badge above bus */}
            <g transform="translate(0, -32)">
              <rect x="-55" y="-12" width="110" height="20" rx="5" fill="#070711" stroke="#22d3ee" strokeWidth="1.2" />
              <text x="0" y="2" textAnchor="middle" fill="#22d3ee" fontSize="9" fontWeight="800" fontFamily="var(--font-mono)">
                BUS 12 • {currentLocation.speed} KM/H
              </text>
            </g>
          </g>
        </svg>

        {/* Selected Stop Inspection Flyout Popup */}
        {selectedStopPopup && (
          <div
            style={{
              position: 'absolute',
              top: '70px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              background: 'rgba(11, 10, 22, 0.95)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid var(--border-purple)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 18px',
              minWidth: '260px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                STOP #{selectedStopPopup.sequence} OF {stops.length}
              </div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '2px 0 3px 0', color: '#f5f3ff' }}>
                {selectedStopPopup.name}
              </h4>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                ⏰ {selectedStopPopup.scheduledTime} • 📍 {selectedStopPopup.landmark}
              </div>
            </div>
            <button
              onClick={() => setSelectedStopPopup(null)}
              className="btn-icon"
              style={{ padding: '4px', fontSize: '0.75rem' }}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Floating HUD Top Overlay - Status Pill */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 1000,
          display: 'flex',
          gap: '8px',
          pointerEvents: 'auto'
        }}
      >
        <div
          style={{
            background: 'rgba(7, 7, 17, 0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--border-purple)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
          }}
        >
          <SmartBusLogo size={22} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Coimbatore Transit Radar
              <span className="live-dot" style={{ width: '6px', height: '6px' }}></span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              25 STOPS • LIVE TELEMETRY
            </div>
          </div>
        </div>
      </div>

      {/* Floating Viewport Actions Toolbar - Bottom Left */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          zIndex: 1000,
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}
      >
        <button
          onClick={handleFocusBus}
          className="btn btn-secondary"
          style={{
            background: 'rgba(7, 7, 17, 0.9)',
            backdropFilter: 'blur(12px)',
            padding: '0.45rem 0.85rem',
            fontSize: '0.8rem',
            borderColor: 'var(--border-purple)'
          }}
          title="Center map on moving bus"
        >
          <Bus size={15} style={{ color: 'var(--accent-cyan)' }} />
          Focus Bus
        </button>

        <button
          onClick={handleFocusPickup}
          className="btn btn-secondary"
          style={{
            background: 'rgba(7, 7, 17, 0.9)',
            backdropFilter: 'blur(12px)',
            padding: '0.45rem 0.85rem',
            fontSize: '0.8rem',
            borderColor: 'var(--border-purple)'
          }}
          title="Center map on my pickup stop"
        >
          <MapPin size={15} style={{ color: 'var(--accent-magenta-light)' }} />
          My Stop
        </button>

        <button
          onClick={handleResetView}
          className="btn btn-secondary"
          style={{
            background: 'rgba(7, 7, 17, 0.9)',
            backdropFilter: 'blur(12px)',
            padding: '0.45rem 0.85rem',
            fontSize: '0.8rem',
            borderColor: 'var(--border-purple)'
          }}
          title="View full Coimbatore corridor"
        >
          <Maximize2 size={15} />
          Full Route
        </button>
      </div>

      {/* Floating Zoom & Layer Controls - Bottom Right */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(7, 7, 17, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-purple)',
          borderRadius: 'var(--radius-sm)',
          padding: '4px 8px'
        }}
      >
        <button onClick={handleZoomIn} className="btn-icon" style={{ border: 'none', padding: '4px' }} title="Zoom In">
          <ZoomIn size={16} />
        </button>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          {(zoomLevel * 100).toFixed(0)}%
        </span>
        <button onClick={handleZoomOut} className="btn-icon" style={{ border: 'none', padding: '4px' }} title="Zoom Out">
          <ZoomOut size={16} />
        </button>
      </div>
    </div>
  );
}
