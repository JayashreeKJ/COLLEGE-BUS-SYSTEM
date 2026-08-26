export default function Footer() {
  return (
    <footer className="site-footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
          SmartBus – College Bus Management & Tracking System
        </p>
        <p style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          Built with React, Vite, Spring Boot, MySQL & Google Maps Platform
        </p>
        <p style={{ marginTop: '0.2rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          Phase 1 Foundation • © {new Date().getFullYear()} SmartBus Team
        </p>
      </div>
    </footer>
  );
}
