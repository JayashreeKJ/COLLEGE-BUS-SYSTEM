import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setNotice(
      `Phase 1 Foundation: Authentication UI shell active. Role "${selectedRole}" selected. (Full JWT authentication will be integrated in Phase 2).`
    );
  };

  return (
    <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 220px)' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚌</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>SmartBus Sign In</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Select your role to access your dedicated dashboard
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {['STUDENT', 'DRIVER', 'ADMIN'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className="btn"
              style={{
                fontSize: '0.8rem',
                padding: '0.5rem 0.25rem',
                background: selectedRole === role ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'var(--bg-glass)',
                color: selectedRole === role ? '#ffffff' : 'var(--text-muted)',
                border: selectedRole === role ? 'none' : '1px solid var(--border-color)',
              }}
            >
              {role.charAt(0) + role.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {notice && (
          <div style={{ padding: '0.75rem', marginBottom: '1.25rem', background: 'var(--primary-glow)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#bfdbfe' }}>
            {notice}
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder={`e.g. ${selectedRole.toLowerCase()}@college.edu`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Sign In as {selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
          <p>Direct Placeholder Links:</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
            <a href="/student" style={{ color: 'var(--accent)' }}>Student Area</a> •
            <a href="/driver" style={{ color: 'var(--accent)' }}>Driver Area</a> •
            <a href="/admin" style={{ color: 'var(--accent)' }}>Admin Area</a>
          </div>
        </div>
      </div>
    </div>
  );
}
