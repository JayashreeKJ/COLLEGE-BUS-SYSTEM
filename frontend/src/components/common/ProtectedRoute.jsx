import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, token, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="status-dot" style={{ width: '16px', height: '16px', backgroundColor: 'var(--primary)', margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'var(--text-muted)' }}>Validating session...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0) {
    const isAllowed = allowedRoles.some((role) => hasRole(role));
    if (!isAllowed) {
      // Redirect to user's authorized dashboard if logged in with different role
      if (hasRole('STUDENT')) return <Navigate to="/student" replace />;
      if (hasRole('DRIVER')) return <Navigate to="/driver" replace />;
      if (hasRole('ADMIN')) return <Navigate to="/admin" replace />;
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
