import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

const Unauthorized = () => {
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
          border: '1px solid rgba(244, 63, 94, 0.3)',
        }}
      >
        <div style={{ fontSize: '54px', marginBottom: '12px' }}>🚫</div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '8px 0', color: 'var(--accent-rose)' }}>
          Access Denied
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
          You do not have the required permissions to access this page with your current role.
        </p>
        <Link to="/">
          <Button variant="secondary">Go to Your Dashboard</Button>
        </Link>
      </GlassCard>
    </div>
  );
};

export default Unauthorized;
