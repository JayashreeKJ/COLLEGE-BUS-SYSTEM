import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { checkBackendHealth } from '../../services/healthService';

export default function Header() {
  const [backendStatus, setBackendStatus] = useState({ checked: false, online: false });

  useEffect(() => {
    let isMounted = true;
    checkBackendHealth().then((res) => {
      if (isMounted) {
        setBackendStatus({ checked: true, online: res.success });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="site-header">
      <div className="nav-container">
        <Link to="/" className="brand">
          <span className="brand-icon">🚌</span>
          <span>SmartBus</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/student" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Student
              </NavLink>
            </li>
            <li>
              <NavLink to="/driver" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Driver
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Admin
              </NavLink>
            </li>
            <li>
              {backendStatus.checked ? (
                <span
                  className={`badge ${backendStatus.online ? 'badge-success' : 'badge-danger'}`}
                  title={backendStatus.online ? 'Spring Boot Backend Connected' : 'Backend Offline'}
                >
                  <span className="status-dot"></span>
                  {backendStatus.online ? 'API Online' : 'API Offline'}
                </span>
              ) : (
                <span className="badge badge-warning">
                  <span className="status-dot"></span>
                  Checking API...
                </span>
              )}
            </li>
            <li>
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                Sign In
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
