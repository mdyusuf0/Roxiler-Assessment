import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { loginUser } from '../services/authService';
import Input from '../components/Input';
import Button from '../components/Button';
import DoodleCharacters from '../components/DoodleCharacters';
import { FiMail, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [charState, setCharState] = useState('idle'); // 'idle' | 'typing' | 'password' | 'success' | 'error'
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleEmailFocus = () => {
    setCharState(email.length > 0 ? 'typing' : 'idle');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setCharState('typing');
    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
  };

  const handlePasswordFocus = () => {
    setCharState('password');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setCharState('password');
    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
  };

  const handleBlur = () => {
    setCharState('idle');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setCharState('error');
      setTimeout(() => setCharState('idle'), 1500);
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginUser({ email, password });
      const { user, accessToken } = response.data.data;

      setCharState('success');
      dispatch(setCredentials({ user, accessToken }));
      toast.success(`Welcome back, ${user.name}!`);

      // Wait a moment for celebration animation before redirecting
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
      }, 700);
    } catch (err) {
      setCharState('error');
      const msg = err.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
      setErrors({ form: msg });
      setTimeout(() => setCharState('idle'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: '960px',
          minHeight: '560px',
          background: 'rgba(235, 238, 242, 0.97)',
          borderRadius: '32px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          overflow: 'hidden',
        }}
      >
        {/* Left Side: Doodle Mascot Stage */}
        <div
          style={{
            background: '#e3e7ed',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '40px 24px 20px',
            position: 'relative',
            minHeight: '380px',
          }}
        >
          <div style={{ position: 'absolute', top: '32px', left: '36px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#4b5563', letterSpacing: '0.05em' }}>
              STORE RATING PLATFORM
            </span>
          </div>

          <DoodleCharacters
            state={charState}
            inputLength={email.length}
            isPeeking={showPassword}
          />
        </div>

        {/* Right Side: Login Form (Clean White Panel matching Screenshot) */}
        <div
          style={{
            background: '#ffffff',
            padding: '48px 44px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: '#111827',
          }}
        >
          {/* Logo icon */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                margin: '0 auto 16px',
                borderRadius: '50%',
                background: '#111827',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '20px',
              }}
            >
              ✦
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
              Welcome back!
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '6px' }}>
              Please enter your details to sign in
            </p>
          </div>

          {errors.form && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: '#fee2e2',
                color: '#dc2626',
                fontSize: '13px',
                marginBottom: '16px',
                border: '1px solid #fecaca',
              }}
            >
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <Input
                label="Email"
                type="email"
                icon={FiMail}
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                onFocus={handleEmailFocus}
                onBlur={handleBlur}
                error={errors.email}
                required
                style={{
                  background: '#f9fafb',
                  color: '#111827',
                  border: '1px solid #e5e7eb',
                }}
              />
            </div>

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={FiLock}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={handlePasswordFocus}
                onBlur={handleBlur}
                error={errors.password}
                showPasswordToggle
                isPasswordVisible={showPassword}
                onPasswordToggle={() => setShowPassword(!showPassword)}
                required
                style={{
                  background: '#f9fafb',
                  color: '#111827',
                  border: '1px solid #e5e7eb',
                }}
              />
            </div>

            <Button
              type="submit"
              variant="dark"
              size="lg"
              isLoading={isLoading}
              style={{
                borderRadius: '12px',
                marginTop: '10px',
                background: '#111827',
                color: '#ffffff',
                fontWeight: 600,
              }}
            >
              Log In
            </Button>
          </form>

          {/* Seed demo quick logins */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>Quick Demo Accounts:</span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@storerating.com');
                  setPassword('Admin@123');
                }}
                style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  background: '#f3f4f6',
                  color: '#374151',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                }}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('owner@store1.com');
                  setPassword('Owner@123');
                }}
                style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  background: '#f3f4f6',
                  color: '#374151',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                }}
              >
                Store Owner
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('user@example.com');
                  setPassword('User@1234');
                }}
                style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  background: '#f3f4f6',
                  color: '#374151',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                }}
              >
                Normal User
              </button>
            </div>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#111827', fontWeight: 700 }}>
              Sign Up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
