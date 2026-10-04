import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { signupUser } from '../services/authService';
import UnderlineInput from '../components/UnderlineInput';
import LoginCharacters from '../components/LoginCharacters';
import useCharacterMood from '../hooks/useCharacterMood';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSuccessTransition, setIsSuccessTransition] = useState(false);

  const { mood, setMood, isBlinking, eyePos, setCaretOffset } = useCharacterMood();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setCaretOffset(Math.min(value.length / 35, 1));
    if (fieldErrors[field] || errorMessage) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
      setErrorMessage('');
    }
  };

  const handleFocusField = (field) => {
    if (field === 'password') {
      setMood(showPassword ? 'passwordVisible' : 'password');
    } else {
      setMood('email');
    }
  };

  const handleTogglePassword = () => {
    const nextState = !showPassword;
    setShowPassword(nextState);
    if (document.activeElement?.getAttribute('name') === 'password') {
      setMood(nextState ? 'passwordVisible' : 'password');
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.name) {
      errors.name = 'Full Name is required';
    } else if (formData.name.trim().length < 20 || formData.name.trim().length > 60) {
      errors.name = `Name must be 20 to 60 characters (currently ${formData.name.trim().length})`;
    }

    if (!formData.email) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.address) {
      errors.address = 'Address is required';
    } else if (formData.address.length > 400) {
      errors.address = `Address must be at most 400 characters (currently ${formData.address.length})`;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else {
      if (formData.password.length < 8 || formData.password.length > 16) {
        errors.password = 'Password must be 8 to 16 characters';
      } else if (!/[A-Z]/.test(formData.password)) {
        errors.password = 'Must contain at least one uppercase letter';
      } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
        errors.password = 'Must contain at least one special character';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setMood('error');
      setTimeout(() => setMood('idle'), 2200);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await signupUser(formData);
      const { user, accessToken } = response.data.data;

      setMood('success');
      setIsSuccessTransition(true);
      dispatch(setCredentials({ user, accessToken }));
      toast.success('Account created! Welcome to StoreRate 🎉');

      setTimeout(() => {
        navigate('/user', { replace: true });
      }, 900);
    } catch (err) {
      setMood('error');
      const msg = err.response?.data?.message || 'Failed to create account. Please check your details.';
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
      {/* Success Curtain Transition */}
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

      {/* Left Panel: Character Stage */}
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

      {/* Right Panel: Registration Form */}
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
          padding: '30px 60px',
          boxSizing: 'border-box',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Logo Mark */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
              }}
            >
              Create Account
            </h1>
            <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>
              Join the community to discover and rate registered stores
            </p>
          </div>

          {/* Inline Error Message */}
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <UnderlineInput
              id="signup-name"
              name="name"
              label="Full Name (20–60 characters)"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onFocus={() => handleFocusField('name')}
              onBlur={() => setMood('idle')}
              error={fieldErrors.name}
              placeholder="e.g. Christopher Alexander Nolan"
              required
            />

            <UnderlineInput
              id="signup-email"
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onFocus={() => handleFocusField('email')}
              onBlur={() => setMood('idle')}
              error={fieldErrors.email}
              placeholder="name@example.com"
              required
            />

            <UnderlineInput
              id="signup-address"
              name="address"
              label="Address (max 400 characters)"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              onFocus={() => handleFocusField('address')}
              onBlur={() => setMood('idle')}
              error={fieldErrors.address}
              placeholder="Street, City, Country"
              required
            />

            <UnderlineInput
              id="signup-password"
              name="password"
              label="Password (8–16 chars, 1 uppercase, 1 special char)"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onFocus={() => handleFocusField('password')}
              onBlur={() => setMood('idle')}
              error={fieldErrors.password}
              showPasswordToggle
              isPasswordVisible={showPassword}
              onPasswordToggle={handleTogglePassword}
              placeholder="••••••••"
              required
            />

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
                marginTop: '10px',
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </motion.button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#111827', fontWeight: 700 }}>
              Log In
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

export default Signup;
