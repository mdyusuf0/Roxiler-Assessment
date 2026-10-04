import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <GlassCard
        style={{
          maxWidth: '480px',
          textAlign: 'center',
          padding: '48px 32px',
        }}
      >
        <div style={{ fontSize: '64px', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>
          404
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '16px 0 8px', color: 'var(--text-primary)' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary">Return Home</Button>
        </Link>
      </GlassCard>
    </div>
  );
};

export default NotFound;
