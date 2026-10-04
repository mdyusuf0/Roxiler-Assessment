import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { FiGithub, FiExternalLink, FiShield, FiHeart, FiCheckCircle } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer
      style={{
        width: '100%',
        marginTop: 'auto',
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(226, 232, 240, 0.8)',
        position: 'relative',
        zIndex: 10,
        boxShadow: '0 -10px 30px rgba(15, 23, 42, 0.02)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 30px' }}>
        {/* Top Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand Info */}
          <div style={{ maxWidth: '320px' }}>
            <Logo size="md" />
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginTop: '16px',
                marginBottom: '20px',
              }}
            >
              The community-driven store discovery & rating platform. Transparent evaluations, verified rater metrics, and authentic consumer trust.
            </p>

            {/* Live Health Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                fontSize: '12px',
                fontWeight: 600,
                color: '#059669',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                  display: 'inline-block',
                }}
              />
              All Systems Operational
            </div>
          </div>

          {/* Column 1: Platform */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li>
                <Link to="/user" style={{ color: 'var(--text-secondary)' }}>Browse All Stores</Link>
              </li>
              <li>
                <Link to="/signup" style={{ color: 'var(--text-secondary)' }}>Create Account</Link>
              </li>
              <li>
                <Link to="/login" style={{ color: 'var(--text-secondary)' }}>Log In</Link>
              </li>
              <li>
                <a href="#how-it-works" style={{ color: 'var(--text-secondary)' }}>How Rating Works</a>
              </li>
            </ul>
          </div>

          {/* Column 2: Role Portals */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Role Portals
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li>
                <Link to="/admin" style={{ color: 'var(--text-secondary)' }}>System Administrator</Link>
              </li>
              <li>
                <Link to="/owner" style={{ color: 'var(--text-secondary)' }}>Store Owner Portal</Link>
              </li>
              <li>
                <Link to="/user" style={{ color: 'var(--text-secondary)' }}>Normal User Portal</Link>
              </li>
              <li>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Single Rating Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Roxiler Assessment */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Challenge Specs
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiCheckCircle size={15} color="#10b981" />
                <span>Roxiler FSDI Assessment</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiShield size={15} color="#6366f1" />
                <span>Anti-Spam Unique Ratings</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiExternalLink size={15} color="#ff6b35" />
                <a
                  href="https://github.com/mdyusuf0/Roxiler-Assessment"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--primary)', fontWeight: 600 }}
                >
                  GitHub Repository
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid rgba(226, 232, 240, 0.6)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} <strong>StoreRate</strong>. Crafted for Roxiler Systems Coding Challenge.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <a
              href="https://github.com/mdyusuf0/Roxiler-Assessment"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FiGithub size={16} /> GitHub Source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
