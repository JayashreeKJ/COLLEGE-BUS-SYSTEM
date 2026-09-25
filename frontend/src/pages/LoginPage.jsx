import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useSimulation } from '../context/SimulationContext';
import api from '../services/api';
import SmartBusLogo from '../components/common/SmartBusLogo';
import { User, Mail, Lock, CheckCircle2, ArrowRight, ShieldCheck, UserPlus, LogIn, Wifi } from 'lucide-react';

// Helper to extract clear, specific error messages from backend responses
const getApiErrorMessage = (err, defaultFallback) => {
  if (!err) return defaultFallback;
  const resData = err.response?.data;

  // 1. Check if backend returned validation error map in `data` (e.g. { name: "...", email: "..." })
  if (resData?.data && typeof resData.data === 'object' && !Array.isArray(resData.data)) {
    const entries = Object.entries(resData.data).filter(([_, v]) => typeof v === 'string');
    if (entries.length > 0) {
      return entries.map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`).join(' • ');
    }
  }

  // 2. Check if backend returned validation error map in `errors`
  if (resData?.errors && typeof resData.errors === 'object' && !Array.isArray(resData.errors)) {
    const entries = Object.entries(resData.errors).filter(([_, v]) => typeof v === 'string');
    if (entries.length > 0) {
      return entries.map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`).join(' • ');
    }
  }

  // 3. Check for specific message string returned from backend (e.g. "An account with this email already exists")
  if (typeof resData?.message === 'string' && resData.message.trim() && resData.message !== 'Validation failed') {
    return resData.message;
  }
  if (typeof resData?.message === 'string' && resData.message.trim()) {
    return resData.message;
  }

  // 4. Raw response body if string
  if (typeof resData === 'string' && resData.trim()) {
    return resData;
  }

  // 5. Network / server offline error
  if (err.message === 'Network Error' || !err.response) {
    return 'Unable to connect to SmartBus server. Please verify your network connection or server status.';
  }

  return defaultFallback;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const { backendOnline, backendPing } = useSimulation();

  // Mode: 'signin' or 'signup'
  const [authMode, setAuthMode] = useState('signin');

  // Sign In form state
  const [selectedRole, setSelectedRole] = useState('STUDENT');
  const [loginEmail, setLoginEmail] = useState('student@college.edu');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Sign Up form state (Public registration is strictly for Students)
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Status state
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
    setSuccessMsg('');
    if (role === 'STUDENT') {
      setLoginEmail('student@college.edu');
      setLoginPassword('password123');
    } else if (role === 'DRIVER') {
      setLoginEmail('driver@college.edu');
      setLoginPassword('password123');
    } else if (role === 'ADMIN') {
      setLoginEmail('admin@college.edu');
      setLoginPassword('password123');
    }
  };

  const switchMode = (mode) => {
    setAuthMode(mode);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Sign In Handler -> POST /api/auth/login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const emailTrimmed = loginEmail.trim();
    if (!emailTrimmed) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(emailTrimmed)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);
    console.log('[SmartBus Auth] Initiating login request to:', `${api.defaults.baseURL || '/api'}/auth/login`, { email: emailTrimmed, role: selectedRole });

    try {
      const response = await api.post('/auth/login', {
        email: emailTrimmed,
        password: loginPassword,
        role: selectedRole,
      });

      console.log('[SmartBus Auth] Login HTTP Status:', response.status);
      console.log('[SmartBus Auth] Login Response Body:', response.data);

      if (response.data && response.data.success) {
        const { token, user } = response.data.data;
        login(user, token);
        toast.success(`Welcome back, ${user.name || 'User'}!`);

        const cleanRole = user.role.replace('ROLE_', '');
        if (cleanRole === 'STUDENT') navigate('/student');
        else if (cleanRole === 'DRIVER') navigate('/driver');
        else if (cleanRole === 'ADMIN') navigate('/admin');
        else navigate('/');
      } else {
        const msg = response.data?.message || 'Login failed. Please check your credentials.';
        setErrorMsg(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error('[SmartBus Auth] Login Error Object:', err);
      console.error('[SmartBus Auth] Login Response Status:', err.response?.status);
      console.error('[SmartBus Auth] Login Response Data:', err.response?.data);

      const msg = getApiErrorMessage(err, 'Unable to sign in. Please verify your credentials and selected role.');
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Handler -> POST /api/auth/register
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const nameTrimmed = signupName.trim();
    const emailTrimmed = signupEmail.trim().toLowerCase();

    // Frontend validation
    if (!nameTrimmed) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (nameTrimmed.length > 100) {
      setErrorMsg('Name must not exceed 100 characters.');
      return;
    }
    if (!emailTrimmed) {
      setErrorMsg('Please enter your college email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(emailTrimmed)) {
      setErrorMsg('Please enter a valid email address (e.g. student@college.edu).');
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter your password.');
      return;
    }

    setLoading(true);
    console.log('[SmartBus Auth] Initiating register request to:', `${api.defaults.baseURL || '/api'}/auth/register`, { name: nameTrimmed, email: emailTrimmed });

    try {
      // 1. Call POST /api/auth/register with ONLY name, email, password
      const registerPayload = {
        name: nameTrimmed,
        email: emailTrimmed,
        password: signupPassword,
      };

      const registerRes = await api.post('/auth/register', registerPayload);

      console.log('[SmartBus Auth] Register HTTP Status:', registerRes.status);
      console.log('[SmartBus Auth] Register Response Body:', registerRes.data);

      if (registerRes.data && registerRes.data.success) {
        setSuccessMsg('Account registered successfully! Authenticating into SmartBus...');
        toast.success('Registration successful! Logging you in...');

        // 2. Automatically authenticate the student with POST /api/auth/login
        try {
          const loginRes = await api.post('/auth/login', {
            email: emailTrimmed,
            password: signupPassword,
            role: 'STUDENT',
          });

          if (loginRes.data && loginRes.data.success) {
            const { token, user } = loginRes.data.data;
            login(user, token);
            toast.success(`Welcome to SmartBus, ${user.name}!`);
            navigate('/student');
            return;
          }
        } catch (loginErr) {
          // If auto-login fails, switch to sign-in tab with prefilled credentials
          setAuthMode('signin');
          setSelectedRole('STUDENT');
          setLoginEmail(emailTrimmed);
          setLoginPassword(signupPassword);
          setSuccessMsg('Account created successfully. Please sign in with your credentials.');
        }
      } else {
        const errorMsg = registerRes.data?.message || 'Registration failed. Please try again.';
        setErrorMsg(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('[SmartBus Auth] Register Error Object:', err);
      console.error('[SmartBus Auth] Register Response Status:', err.response?.status);
      console.error('[SmartBus Auth] Register Response Data:', err.response?.data);

      const msg = getApiErrorMessage(err, 'Registration failed. Please check your information.');
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="main-content"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px)',
        padding: '2rem 1.25rem 3rem'
      }}
    >
      <div
        className="card glow-border"
        style={{
          maxWidth: '480px',
          width: '100%',
          boxShadow: 'var(--shadow-card)',
          padding: '2rem 2.25rem',
          position: 'relative'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.85rem' }}>
            <SmartBusLogo size={52} />
          </div>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '0.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {authMode === 'signin' ? 'SmartBus Portal' : 'Student Registration'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', margin: 0 }}>
            Sri Shakthi Institute of Engineering & Technology (SIET)
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: backendOnline ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255, 255, 255, 0.05)', border: backendOnline ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)', color: backendOnline ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: backendOnline ? 'var(--accent-cyan)' : '#f59e0b' }} />
            {backendOnline ? `SERVER ONLINE (${backendPing ? backendPing + 'ms' : 'LIVE'})` : 'STANDBY MODE'}
          </div>
        </div>

        {/* Tab Selector: Sign In vs Create Account */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'var(--bg-glass-strong)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            gap: '4px',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-color)'
          }}
        >
          <button
            type="button"
            onClick={() => switchMode('signin')}
            style={{
              padding: '0.6rem 0.5rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: authMode === 'signin' ? 700 : 500,
              background: authMode === 'signin' ? 'var(--primary)' : 'transparent',
              color: authMode === 'signin' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              boxShadow: authMode === 'signin' ? '0 0 12px var(--primary-glow)' : 'none'
            }}
          >
            <LogIn size={15} /> Sign In
          </button>

          <button
            type="button"
            onClick={() => switchMode('signup')}
            style={{
              padding: '0.6rem 0.5rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: authMode === 'signup' ? 700 : 500,
              background: authMode === 'signup' ? 'var(--primary)' : 'transparent',
              color: authMode === 'signup' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              boxShadow: authMode === 'signup' ? '0 0 12px var(--primary-glow)' : 'none'
            }}
          >
            <UserPlus size={15} /> Create Account
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              background: 'rgba(34, 211, 238, 0.12)',
              border: '1px solid var(--accent-cyan)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.84rem',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.84rem',
              color: '#fca5a5',
              lineHeight: 1.4
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* ============================================================ */}
        {/* SIGN IN FORM                                                 */}
        {/* ============================================================ */}
        {authMode === 'signin' ? (
          <div>
            {/* Role Toggle Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-dim)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}
              >
                Select Portal Access Role
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.45rem' }}>
                {['STUDENT', 'DRIVER', 'ADMIN'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    className="btn"
                    style={{
                      fontSize: '0.8rem',
                      padding: '0.55rem 0.2rem',
                      fontWeight: selectedRole === role ? '700' : '500',
                      background:
                        selectedRole === role
                          ? 'linear-gradient(135deg, var(--primary), var(--accent-magenta))'
                          : 'var(--bg-glass)',
                      color: selectedRole === role ? '#ffffff' : 'var(--text-muted)',
                      border:
                        selectedRole === role
                          ? '1px solid rgba(255,255,255,0.3)'
                          : '1px solid var(--border-color)',
                      boxShadow: selectedRole === role ? '0 0 10px var(--primary-glow)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {role === 'STUDENT' ? '🎓 Student' : role === 'DRIVER' ? '🚍 Driver' : '⚙️ Admin'}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">College Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="form-input"
                    placeholder={`e.g. ${selectedRole.toLowerCase()}@college.edu`}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={loading}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Mail
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '0.9rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-dim)'
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={loading}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '0.9rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-dim)'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <>Authenticating...</>
                ) : (
                  <>
                    Sign In as {selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}{' '}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials */}
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-color)',
                fontSize: '0.78rem',
                color: 'var(--text-muted)'
              }}
            >
              <p style={{ marginBottom: '0.4rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                Default Seed Accounts:
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem'
                }}
              >
                <span>
                  <strong>Student:</strong> student@college.edu / password123
                </span>
                <span>
                  <strong>Driver:</strong> driver@college.edu / password123
                </span>
                <span>
                  <strong>Admin:</strong> admin@college.edu / password123
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* SIGN UP FORM (PUBLIC REGISTRATION STRICTLY FOR STUDENTS)     */
          /* ============================================================ */
          <div>
            {/* Student Registration Notice */}
            <div
              style={{
                background: 'var(--primary-dim)',
                border: '1px solid var(--primary-glow)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 0.9rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.82rem',
                color: 'var(--text-main)'
              }}
            >
              <ShieldCheck size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
              <span>
                Public registration automatically enrolls you with <strong>SIET Student</strong> transit access.
              </span>
            </div>

            <form onSubmit={handleSignUpSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Jayashree K"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                    disabled={loading}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <User
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '0.9rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-dim)'
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">College Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. student@college.edu"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    disabled={loading}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Mail
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '0.9rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-dim)'
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Password (Min. 6 characters)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Create a strong password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '0.9rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-dim)'
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Confirm your password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '0.9rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-dim)'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <>Registering Student Account...</>
                ) : (
                  <>
                    Complete Registration <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div
              style={{
                marginTop: '1.25rem',
                textAlign: 'center',
                fontSize: '0.82rem',
                color: 'var(--text-muted)'
              }}
            >
              Already registered?{' '}
              <button
                type="button"
                onClick={() => switchMode('signin')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-cyan)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Sign In to your account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
