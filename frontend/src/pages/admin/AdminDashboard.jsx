import React, { useState } from 'react';
import { BUS_FLEET, SCHEDULES } from '../../data/busFleetData';
import { SEEDED_COIMBATORE_STOPS } from '../../data/coimbatoreRouteData';
import { useSimulation } from '../../context/SimulationContext';
import { useToast } from '../../context/ToastContext';
import {
  Shield,
  Bus,
  Route,
  Users,
  Radio,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Activity,
  UserCheck,
  Zap,
  TrendingUp,
  X,
  Save,
  Check
} from 'lucide-react';

export default function AdminDashboard() {
  const { stops } = useSimulation();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'buses' | 'routes' | 'drivers' | 'students'
  const [buses, setBuses] = useState(BUS_FLEET);
  const [routeStops, setRouteStops] = useState(SEEDED_COIMBATORE_STOPS);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isAddBusModalOpen, setIsAddBusModalOpen] = useState(false);
  const [isAddStopModalOpen, setIsAddStopModalOpen] = useState(false);
  const [selectedBusForEdit, setSelectedBusForEdit] = useState(null);

  // New Stop Form
  const [newStopForm, setNewStopForm] = useState({
    name: '',
    scheduledTime: '07:15 AM',
    landmark: '',
    lat: '11.0250',
    lng: '76.9600'
  });

  // New Bus Form
  const [newBusForm, setNewBusForm] = useState({
    busNumber: 'TN 38 BE 7788',
    name: 'Bus 25 (Thudiyalur Line)',
    capacity: 45,
    driverName: 'K. Anand',
    driverPhone: '+91 98433 99887'
  });

  // Admin Metrics
  const totalBusesCount = 12;
  const activeBusesCount = buses.filter((b) => b.status === 'LIVE').length || 8;
  const studentsTrackingCount = 342;
  const activeTripsCount = 5;
  const delayedBusesCount = 2;

  const handleToggleBusStatus = (busId) => {
    setBuses((prev) =>
      prev.map((b) => {
        if (b.id === busId) {
          const nextStatus = b.status === 'LIVE' ? 'SCHEDULED' : 'LIVE';
          toast.info(`Updated ${b.name} status to ${nextStatus}`);
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );
  };

  const handleAddStopSubmit = (e) => {
    e.preventDefault();
    const newStop = {
      id: `stop-${Date.now()}`,
      sequence: routeStops.length + 1,
      name: newStopForm.name,
      scheduledTime: newStopForm.scheduledTime,
      landmark: newStopForm.landmark || 'Main Road Stop',
      lat: parseFloat(newStopForm.lat) || 11.025,
      lng: parseFloat(newStopForm.lng) || 76.96,
      distanceFromStart: `${(routeStops.length * 1.8).toFixed(1)} km`
    };

    setRouteStops((prev) => [...prev, newStop]);
    toast.success(`Stop "${newStop.name}" added to Coimbatore Corridor`);
    setIsAddStopModalOpen(false);
    setNewStopForm({ name: '', scheduledTime: '07:15 AM', landmark: '', lat: '11.0250', lng: '76.9600' });
  };

  const handleRemoveStop = (stopId, stopName) => {
    setRouteStops((prev) => prev.filter((s) => s.id !== stopId));
    toast.warning(`Removed stop "${stopName}" from sequence`);
  };

  const handleAddBusSubmit = (e) => {
    e.preventDefault();
    const newBus = {
      id: `BUS-${Date.now().toString().slice(-2)}`,
      busNumber: newBusForm.busNumber,
      name: newBusForm.name,
      routeId: 'ROUTE-01',
      routeName: 'Coimbatore Corridor → SIET Campus',
      capacity: parseInt(newBusForm.capacity) || 45,
      occupancy: 0,
      status: 'SCHEDULED',
      speed: 0,
      driver: {
        id: `DRV-${Date.now().toString().slice(-2)}`,
        name: newBusForm.driverName,
        phone: newBusForm.driverPhone,
        experience: 'New Fleet Hire',
        rating: 5.0,
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        status: 'Standby',
        licenseNo: 'TN38-2024-001122'
      },
      model: 'Ashok Leyland Viking'
    };

    setBuses((prev) => [...prev, newBus]);
    toast.success(`Vehicle "${newBus.name}" registered to SIET fleet`);
    setIsAddBusModalOpen(false);
  };

  return (
    <div className="main-content" style={{ maxWidth: '1440px', padding: '1.5rem 1.5rem 3.5rem' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Shield size={22} style={{ color: 'var(--accent-cyan)' }} />
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Fleet Command Center (Admin)
            </h1>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Sri Shakthi Institute of Engineering and Technology (SIET) — Fleet Oversight & Route Management
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsAddBusModalOpen(true)}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', gap: '0.4rem' }}
          >
            <Plus size={16} /> Register New Bus
          </button>
          <button
            onClick={() => setIsAddStopModalOpen(true)}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', gap: '0.4rem' }}
          >
            <Plus size={16} /> Add Route Stop
          </button>
        </div>
      </div>

      {/* Admin 5-Metric Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Total Registered Buses
          </div>
          <div className="telemetry-num telemetry-glow" style={{ fontSize: '1.75rem' }}>
            {totalBusesCount} Buses
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sri Shakthi Transit Fleet</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Active on Route
          </div>
          <div className="telemetry-num" style={{ fontSize: '1.75rem', color: 'var(--accent-cyan)' }}>
            {activeBusesCount} Active
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>● Real-time GPS Streaming</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Students Tracking
          </div>
          <div className="telemetry-num telemetry-purple" style={{ fontSize: '1.75rem' }}>
            {studentsTrackingCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live App Connections</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Active Scheduled Trips
          </div>
          <div className="telemetry-num" style={{ fontSize: '1.75rem', color: 'var(--text-main)' }}>
            {activeTripsCount} Trips
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Morning Corridor Service</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Traffic Delay Alerts
          </div>
          <div className="telemetry-num" style={{ fontSize: '1.75rem', color: '#f59e0b' }}>
            {delayedBusesCount} Delayed
          </div>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>Trichy Rd Signal Bottleneck</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.75rem',
          marginBottom: '1.75rem',
          overflowX: 'auto'
        }}
      >
        {[
          { id: 'overview', label: 'Fleet Overview', icon: <Activity size={15} /> },
          { id: 'buses', label: 'Bus Vehicles', icon: <Bus size={15} /> },
          { id: 'routes', label: 'Route & Stops Manager', icon: <Route size={15} /> },
          { id: 'drivers', label: 'Driver Staff Roster', icon: <UserCheck size={15} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="btn"
            style={{
              background: activeTab === tab.id ? 'var(--primary-dim)' : 'transparent',
              color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
              border: activeTab === tab.id ? '1px solid var(--border-purple)' : '1px solid transparent',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '0.88rem',
              padding: '0.45rem 1rem'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Fleet Overview / Bus Cards */}
      {(activeTab === 'overview' || activeTab === 'buses') && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Registered Bus Fleet & Live Dispatches
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Showing {buses.length} active fleet units
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {buses.map((bus) => {
              const isLive = bus.status === 'LIVE';

              return (
                <div key={bus.id} className="card glow-border" style={{ padding: '1.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                        {bus.name}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {bus.busNumber}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleBusStatus(bus.id)}
                      className={`badge ${isLive ? 'badge-success' : 'badge-neutral'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Click to toggle active dispatch status"
                    >
                      {isLive && <span className="live-dot" style={{ width: '6px', height: '6px' }}></span>}
                      {bus.status}
                    </button>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                    📍 {bus.routeName}
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem',
                      background: 'var(--bg-glass-strong)',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '1rem',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div>
                      <div style={{ color: 'var(--text-dim)' }}>Driver Assigned</div>
                      <strong>{bus.driver.name}</strong>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-dim)' }}>Occupancy</div>
                      <strong>{bus.occupancy} / {bus.capacity} seats</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        toast.success(`Broadcasting telemetry for ${bus.name}`);
                      }}
                      className="btn btn-secondary"
                      style={{ flex: 1, fontSize: '0.78rem' }}
                    >
                      <Radio size={13} /> Ping Telemetry
                    </button>
                    <button
                      onClick={() => setSelectedBusForEdit(bus)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Route & Stops Manager */}
      {activeTab === 'routes' && (
        <div className="card" style={{ padding: '1.75rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                Coimbatore Corridor — Sequenced Stops ({routeStops.length} stops)
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Add, remove, or modify transit stop coordinates and scheduled timetable times
              </p>
            </div>

            <button
              onClick={() => setIsAddStopModalOpen(true)}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem' }}
            >
              <Plus size={15} /> Add New Stop
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Seq</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Stop Name</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Scheduled Time</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Landmark</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Coordinates</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {routeStops.map((stop, idx) => (
                  <tr
                    key={stop.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                      #{stop.sequence}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{stop.name}</td>
                    <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                      {stop.scheduledTime}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{stop.landmark}</td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                      {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleRemoveStop(stop.id, stop.name)}
                        className="btn-icon"
                        style={{ padding: '0.35rem', color: 'var(--danger)' }}
                        title="Remove Stop"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Driver Roster */}
      {activeTab === 'drivers' && (
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Institutional Driver Staff Directory
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {buses.map((bus) => (
              <div
                key={bus.driver.id}
                style={{
                  background: 'var(--bg-glass)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center'
                }}
              >
                <img
                  src={bus.driver.photo}
                  alt={bus.driver.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-purple)' }}
                />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                    {bus.driver.name}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Assigned to <strong>{bus.name}</strong>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    {bus.driver.phone}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {bus.driver.experience}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Route Stop */}
      {isAddStopModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddStopModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Add Coimbatore Route Stop</h3>
              <button onClick={() => setIsAddStopModalOpen(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStopSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Stop Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Hope College Junction"
                  value={newStopForm.name}
                  onChange={(e) => setNewStopForm({ ...newStopForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Scheduled Pickup Time</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 06:48 AM"
                  value={newStopForm.scheduledTime}
                  onChange={(e) => setNewStopForm({ ...newStopForm, scheduledTime: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Landmark Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Flyover Pillar #12"
                  value={newStopForm.landmark}
                  onChange={(e) => setNewStopForm({ ...newStopForm, landmark: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newStopForm.lat}
                    onChange={(e) => setNewStopForm({ ...newStopForm, lat: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newStopForm.lng}
                    onChange={(e) => setNewStopForm({ ...newStopForm, lng: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsAddStopModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register New Bus */}
      {isAddBusModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddBusModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Register New Fleet Vehicle</h3>
              <button onClick={() => setIsAddBusModalOpen(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddBusSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Bus Identifier / Route Label</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Bus 25 (Thudiyalur Line)"
                  value={newBusForm.name}
                  onChange={(e) => setNewBusForm({ ...newBusForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Registration Plate Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. TN 38 BE 7788"
                  value={newBusForm.busNumber}
                  onChange={(e) => setNewBusForm({ ...newBusForm, busNumber: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Driver Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newBusForm.driverName}
                    onChange={(e) => setNewBusForm({ ...newBusForm, driverName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Driver Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newBusForm.driverPhone}
                    onChange={(e) => setNewBusForm({ ...newBusForm, driverPhone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Seat Capacity</label>
                <input
                  type="number"
                  className="form-input"
                  value={newBusForm.capacity}
                  onChange={(e) => setNewBusForm({ ...newBusForm, capacity: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsAddBusModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Register Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
