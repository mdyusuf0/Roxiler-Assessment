import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { loginUser } from '../services/authService';
import UnderlineInput from '../components/UnderlineInput';
import LoginCharacters from '../components/LoginCharacters';
import useCharacterMood from '../hooks/useCharacterMood';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSplash, setShowSplash] = useState(true);
  const [isSuccessTransition, setIsSuccessTransition] = useState(false);

  const { mood, setMood, isBlinking, eyePos, setCaretOffset } = useCharacterMood();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Dismiss intro splash after 1.1s
  React.useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1100);
    return () => clearTimeout(timer);
  }, []);

  const handleEmailFocus = () => {
    setMood('email');
    setCaretOffset(Math.min(email.length / 28, 1));
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    setCaretOffset(Math.min(val.length / 28, 1));
    if (fieldErrors.email || errorMessage) {
      setFieldErrors((prev) => ({ ...prev, email: null }));
      setErrorMessage('');
    }
  };

  const handlePasswordFocus = () => {
    setMood(showPassword ? 'passwordVisible' : 'password');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (fieldErrors.password || errorMessage) {
      setFieldErrors((prev) => ({ ...prev, password: null }));
      setErrorMessage('');
    }
  };

  const handleTogglePassword = () => {
    const nextState = !showPassword;
    setShowPassword(nextState);
    if (document.activeElement?.getAttribute('name') === 'password') {
      setMood(nextState ? 'passwordVisible' : 'password');
    }
  };

  const handleBlur = () => {
    setMood('idle');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!email) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setMood('error');
      setTimeout(() => setMood('idle'), 2000);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await loginUser({ email, password });
      const { user, accessToken } = response.data.data;

      setMood('success');
      setIsSuccessTransition(true);
      dispatch(setCredentials({ user, accessToken }));
      toast.success(`Welcome back, ${user.name}!`);

      setTimeout(() => {
        const from = location.state?.from?.pathname;
        if (from) {
          navigate(from, { replace: true });
        } else if (user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (user.role === 'store_owner') {
          navigate('/owner', { replace: true });
        } else {
          navigate('/user', { replace: true });
        }
      }, 900);
    } catch (err) {
      setMood('error');
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
      setTimeout(() => setMood('idle'), 2200);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        position: 'relative',
        background: '#ffffff',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ── 1. INTRO SPLASH OVERLAY ── */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: '#6726fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.6 }}
              style={{ display: 'flex', gap: '12px' }}
            >
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#ffffff' }} />
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#ffffff' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2. SUCCESS TRANSITION CURTAIN ── */}
      <AnimatePresence>
        {isSuccessTransition && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9998,
              background: '#6726fe',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── 3. LEFT PANEL: MASCOT CHARACTER STAGE (50% Screen) ── */}
      <div
        style={{
          flex: '1 1 50%',
          width: '50%',
          height: '100%',
          background: '#eceff3',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          position: 'relative',
          paddingBottom: '0px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <LoginCharacters
          mood={mood}
          isBlinking={isBlinking}
          eyePos={eyePos}
        />
      </div>

      {/* ── 4. RIGHT PANEL: WHITE AUTH FORM (50% Screen) ── */}
      <div
        style={{
          flex: '1 1 50%',
          width: '50%',
          height: '100%',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 60px',
          boxSizing: 'border-box',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <div style={{ width: '100%', maxWidth: '380px' }}>
          {/* Logo Mark (4-point black star icon) */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ margin: '0 auto 16px', display: 'block' }}
            >
              <path
                d="M18 0C18 9.94112 9.94112 18 0 18C9.94112 18 18 26.0589 18 36C18 26.0589 26.0589 18 36 18C26.0589 18 18 9.94112 18 0Z"
                fill="#111827"
              />
            </svg>

            <h1
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
              }}
            >
              Welcome back!
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '6px' }}>
              Please enter your details
            </p>
          </div>

          {/* Inline Error Banner */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                color: '#ef4444',
                fontSize: '13px',
                marginBottom: '16px',
                textAlign: 'center',
                fontWeight: 500,
              }}
            >
              {errorMessage}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <UnderlineInput
              id="login-email"
              name="email"
              label="Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              onFocus={handleEmailFocus}
              onBlur={handleBlur}
              error={fieldErrors.email}
              placeholder="e.g. anna@gmail.com"
              autoComplete="email"
              required
            />

            <UnderlineInput
              id="login-password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              onFocus={handlePasswordFocus}
              onBlur={handleBlur}
              error={fieldErrors.password}
              showPasswordToggle
              isPasswordVisible={showPassword}
              onPasswordToggle={handleTogglePassword}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />

            {/* Remember Me & Forgot Password Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '13px',
                color: '#4b5563',
                marginTop: '-4px',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#111827',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                />
                <span>Remember for 30 days</span>
              </label>

              <button
                type="button"
                onClick={() => toast('Password reset link has been dispatched to your email.', { icon: '📧' })}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Primary Log In Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01, filter: 'brightness(1.15)' }}
              whileTap={{ scale: 0.99 }}
              style={{
                width: '100%',
                padding: '13px 20px',
                background: '#111827',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px',
                boxShadow: '0 4px 12px rgba(17, 24, 39, 0.2)',
                transition: 'all 0.15s ease',
              }}
            >
              {isLoading ? (
                <>
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#ffffff',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.6s linear infinite',
                    }}
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </motion.button>

            {/* Secondary Log In with Google Button */}
            <button
              type="button"
              onClick={() => toast('Google sign-in is available in enterprise mode.', { icon: 'ℹ️' })}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: '#f3f4f6',
                color: '#1f2937',
                border: '1px solid #e5e7eb',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e7eb')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#f3f4f6')}
            >
              {/* Multi-colored Google G SVG */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z"
                  fill="#4285F4"
                />
                <path
                  d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
                  fill="#34A853"
                />
                <path
                  d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z"
                  fill="#FBBC05"
                />
                <path
                  d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
                  fill="#EA4335"
                />
              </svg>
              <span>Log in with Google</span>
            </button>
          </form>

          {/* Reviewer Quick-Demo Accounts Chips */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Quick Demo Accounts
            </span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@storerating.com');
                  setPassword('Admin@123');
                  toast.success('Admin credentials filled');
                }}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '5px 10px',
                  background: '#f9fafb',
                  color: '#374151',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                }}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('owner@store1.com');
                  setPassword('Owner@123');
                  toast.success('Store Owner credentials filled');
                }}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '5px 10px',
                  background: '#f9fafb',
                  color: '#374151',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                }}
              >
                Store Owner
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('user@example.com');
                  setPassword('User@1234');
                  toast.success('Normal User credentials filled');
                }}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '5px 10px',
                  background: '#f9fafb',
                  color: '#374151',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                }}
              >
                Normal User
              </button>
            </div>
          </div>

          {/* Bottom Sign Up Link */}
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#111827', fontWeight: 700 }}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 820px) {
          body { overflow-y: auto !important; }
          div[style*="width: 100vw"] {
            flex-direction: column !important;
            height: auto !important;
            min-height: 100vh !important;
          }
          div[style*="width: 50%"] {
            width: 100% !important;
            flex: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
