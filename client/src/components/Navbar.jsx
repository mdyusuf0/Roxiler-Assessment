import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCredentials } from '../store/authSlice';
import { logoutUser } from '../services/authService';
import Button from './Button';
import Modal from './Modal';
import ChangePasswordForm from './ChangePasswordForm';
import { FiLogOut, FiKey, FiUser, FiShoppingBag, FiUsers, FiGrid } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore
    } finally {
      dispatch(clearCredentials());
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'System Admin', bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
      case 'store_owner':
        return { label: 'Store Owner', bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
      default:
        return { label: 'Normal User', bg: 'rgba(99, 102, 241, 0.15)', text: '#818cf8', border: 'rgba(99, 102, 241, 0.3)' };
    }
  };

  const badge = user ? getRoleBadge(user.role) : null;

  return (
    <>
      <header
        className="glass-panel"
        style={{
          position: 'sticky',
          top: '16px',
          zIndex: 100,
          margin: '16px 24px',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand / Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6726FE 0%, #FF6B35 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(103, 38, 254, 0.4)',
            }}
          >
            <span style={{ fontSize: '18px' }}>⭐</span>
          </div>
          <div>
            <span style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Store<span style={{ color: 'var(--primary)' }}>Rate</span>
            </span>
          </div>
        </Link>

        {/* Navigation Links based on role */}
        {user && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {user.role === 'admin' && (
              <>
                <Link to="/admin">
                  <Button variant="ghost" size="sm">
                    <FiGrid size={15} /> Dashboard
                  </Button>
                </Link>
                <Link to="/admin/users">
                  <Button variant="ghost" size="sm">
                    <FiUsers size={15} /> Users
                  </Button>
                </Link>
                <Link to="/admin/stores">
                  <Button variant="ghost" size="sm">
                    <FiShoppingBag size={15} /> Stores
                  </Button>
                </Link>
              </>
            )}

            {user.role === 'user' && (
              <Link to="/user">
                <Button variant="ghost" size="sm">
                  <FiShoppingBag size={15} /> Browse Stores
                </Button>
              </Link>
            )}

            {user.role === 'store_owner' && (
              <Link to="/owner">
                <Button variant="ghost" size="sm">
                  <FiGrid size={15} /> My Store
                </Button>
              </Link>
            )}
          </nav>
        )}

        {/* User Info & Actions */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user.name}
                </span>
                {badge && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: badge.bg,
                      color: badge.text,
                      border: `1px solid ${badge.border}`,
                    }}
                  >
                    {badge.label}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPasswordModalOpen(true)}
              title="Change Password"
            >
              <FiKey size={15} /> Password
            </Button>

            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
              title="Log Out"
            >
              <FiLogOut size={15} /> Logout
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login">
              <Button variant="secondary" size="sm">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </header>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Update Your Password"
      >
        <ChangePasswordForm onSuccess={() => setIsPasswordModalOpen(false)} />
      </Modal>
    </>
  );
};

export default Navbar;
