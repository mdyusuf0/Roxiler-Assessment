import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ size = 'md', showWordmark = true, to = '/' }) => {
  const dimensions = {
    sm: { icon: 28, text: '16px', star: 14 },
    md: { icon: 38, text: '19px', star: 20 },
    lg: { icon: 50, text: '26px', star: 26 },
  };

  const { icon, text } = dimensions[size] || dimensions.md;

  const content = (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size === 'lg' ? '14px' : '10px', textDecoration: 'none' }}>
      {/* Icon Badge */}
      <div
        style={{
          width: `${icon}px`,
          height: `${icon}px`,
          borderRadius: `${icon * 0.32}px`,
          background: 'linear-gradient(135deg, #6726fe 0%, #8b5cf6 50%, #ff6b35 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 20px -4px rgba(103, 38, 254, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.6)',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        {/* Geometric 4-Point Star SVG */}
        <svg
          width={icon * 0.55}
          height={icon * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <span
          style={{
            fontSize: text,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary, #0f172a)',
            lineHeight: 1,
          }}
        >
          Store<span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #ff6b35 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Rate</span>
        </span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
