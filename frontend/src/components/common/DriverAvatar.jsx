import React, { useState } from 'react';
import { User } from 'lucide-react';

export default function DriverAvatar({ src, alt, size = 54, style = {}, iconSize, className = '' }) {
  const [imgError, setImgError] = useState(false);

  // If no photo or image failed to load, display the neutral profile icon
  if (!src || imgError) {
    const calcIconSize = iconSize || Math.max(16, Math.round(size * 0.5));
    return (
      <div
        className={`driver-avatar-placeholder ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          minHeight: `${size}px`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(139, 92, 246, 0.14)',
          color: 'var(--text-muted)',
          border: '2px solid var(--border-color)',
          boxSizing: 'border-box',
          flexShrink: 0,
          ...style
        }}
        title={alt || 'Driver Profile'}
        aria-label={alt || 'Driver Profile'}
      >
        <User size={calcIconSize} strokeWidth={2} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || 'Driver Profile'}
      onError={() => setImgError(true)}
      className={`driver-avatar-img ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '50%',
        objectFit: 'cover',
        display: 'block',
        boxSizing: 'border-box',
        flexShrink: 0,
        ...style
      }}
    />
  );
}
