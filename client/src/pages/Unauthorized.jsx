import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCredentials } from '../store/authSlice';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { FiAlertTriangle, FiLogOut, FiHome } from 'react-icons/fi';

const Unauthorized = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSwitchAccount = () => {
    dispatch(clearCredentials());
    navigate('/login', { replace: true });
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'store_owner':
        return '/owner';
      default:
        return '/user';
    }
  };

  return (
    <div
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <GlassCard
        style={{
          maxWidth: '520px',
          textAlign: 'center',
          padding: '48px 36px',
          border: '1px solid rgba(244, 63, 94, 0.35)',
          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.08) 0%, rgba(18, 24, 38, 0.95) 100%)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'var(--accent-rose)',
          }}
        >
          <FiAlertTriangle size={32} />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0', color: 'var(--text-primary)' }}>
          Access Denied
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.5, marginBottom: '20px' }}>
          You do not have the required permissions to access this page with your current role.
        </p>

        {user && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '28px',
              fontSize: '13px',
              color: 'var(--text-muted)',
            }}
          >
            Currently signed in as: <strong style={{ color: 'var(--text-primary)' }}>{user.name}</strong>{' '}
            <span
              style={{
                marginLeft: '6px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {user.role?.replace('_', ' ')}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to={getDashboardPath()}>
            <Button variant="primary">
              <FiHome size={15} /> Go to Your Dashboard
            </Button>
          </Link>
          <Button variant="secondary" onClick={handleSwitchAccount}>
            <FiLogOut size={15} /> Switch / Log In
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};

export default Unauthorized;
