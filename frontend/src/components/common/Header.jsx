import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSimulation } from '../../context/SimulationContext';
import { useToast } from '../../context/ToastContext';
import NotificationDrawer from './NotificationDrawer';
import SmartBusLogo from './SmartBusLogo';
import {
  Bus,
  MapPin,
  Route,
  Calendar,
  Bell,
  User,
  Sun,
  Moon,
  Shield,
  LogOut,
  Radio,
  Search,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasRole } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { notifications, backendOnline, backendPing } = useSimulation();
  const toast = useToast();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSignOut = () => {
    logout();
    toast.info('Signed out of SmartBus session');
    navigate('/login');
  };

  const getRoleLabel = () => {
    if (hasRole('STUDENT')) return 'Student';
    if (hasRole('DRIVER')) return 'Driver';
    if (hasRole('ADMIN')) return 'Admin';
    return 'Guest';
  };

  return (
    <>
      <header className="site-header">
        <div className="nav-container">
          {/* Vector Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link to="/" className="brand">
              <SmartBusLogo size={36} showText={true} />
            </Link>

            {/* Live Indicator Pill */}
            <div className="live-indicator" style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}>
              <span className="live-dot"></span>
              LIVE
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Overview
            </NavLink>

            <NavLink
              to="/student"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <Radio size={15} /> Live Tracking
            </NavLink>

            <NavLink
              to="/student/route"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <Route size={15} /> My Route
            </NavLink>

            <NavLink
              to="/student/schedule"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <Calendar size={15} /> Bus Schedule
            </NavLink>

            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <Shield size={15} /> Admin
            </NavLink>
          </nav>

          {/* Right Utilities */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Backend / Demo Indicator */}
            <div
              title={backendOnline ? `Spring Boot Server Connected (${backendPing}ms)` : 'Running in Local Demo GPS Simulation Mode'}
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                background: backendOnline ? 'rgba(0,255,102,0.1)' : 'rgba(255,255,255,0.05)',
                border: backendOnline ? '1px solid var(--primary-glow)' : '1px solid var(--border-color)',
                color: backendOnline ? 'var(--primary)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: backendOnline ? 'var(--primary)' : '#f59e0b'
                }}
              />
              {backendOnline ? 'LIVE API' : 'DEMO MODE'}
            </div>

            {/* Notification Bell Button */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="btn-icon"
              style={{ position: 'relative' }}
              title="Transit Alerts & Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '18px',
                    height: '18px',
                    background: 'var(--primary)',
                    color: '#000000',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 8px var(--primary)'
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="btn-icon"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User Profile or Sign In */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <NavLink
                  to="/student/profile"
                  className="badge badge-neutral"
                  style={{
                    padding: '0.4rem 0.75rem',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <User size={14} style={{ color: 'var(--primary)' }} />
                  <span>{user.name || 'Student'}</span>
                </NavLink>

                <button
                  onClick={handleSignOut}
                  className="btn-icon"
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="btn-icon mobile-toggle"
              style={{ display: 'none' }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
}
