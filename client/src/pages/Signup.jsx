import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { signupUser } from '../services/authService';
import Input from '../components/Input';
import Button from '../components/Button';
import DoodleCharacters from '../components/DoodleCharacters';
import { FiUser, FiMail, FiMapPin, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [charState, setCharState] = useState('idle');
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    // Name: 20 to 60 characters
    if (!formData.name) {
      newErrors.name = 'Full Name is required';
    } else if (formData.name.trim().length < 20 || formData.name.trim().length > 60) {
      newErrors.name = `Name must be 20 to 60 characters (currently ${formData.name.trim().length})`;
    }

    // Email
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Address: max 400 characters
    if (!formData.address) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length > 400) {
      newErrors.address = `Address must be at most 400 characters (currently ${formData.address.length})`;
    }

    // Password: 8-16 characters, uppercase + special character
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      if (formData.password.length < 8 || formData.password.length > 16) {
        newErrors.password = 'Password must be 8 to 16 characters';
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Must contain at least one uppercase letter';
      } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
        newErrors.password = 'Must contain at least one special character';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setCharState('error');
      setTimeout(() => setCharState('idle'), 1500);
      return;
    }

    setIsLoading(true);
    try {
      const response = await signupUser(formData);
      const { user, accessToken } = response.data.data;

      setCharState('success');
      dispatch(setCredentials({ user, accessToken }));
      toast.success('Account created! Welcome to StoreRate 🎉');

      setTimeout(() => {
        navigate('/user', { replace: true });
      }, 700);
    } catch (err) {
      setCharState('error');
      const msg = err.response?.data?.message || 'Failed to create account';
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
          maxWidth: '980px',
          minHeight: '620px',
          background: 'rgba(235, 238, 242, 0.97)',
          borderRadius: '32px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          overflow: 'hidden',
        }}
      >
        {/* Left Side: Mascot Stage */}
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
              JOIN THE COMMUNITY
            </span>
          </div>

          <DoodleCharacters
            state={charState}
            inputLength={formData.name.length || formData.email.length}
            isPeeking={showPassword}
          />
        </div>

        {/* Right Side: Registration Form */}
        <div
          style={{
            background: '#ffffff',
            padding: '40px 44px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: '#111827',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
              Create an Account
            </h1>
            <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>
              Rate and discover the best registered stores
            </p>
          </div>

          {errors.form && (
            <div
              style={{
                padding: '10px 14px',
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input
              label="Full Name"
              icon={FiUser}
              placeholder="e.g. Christopher Alexander Nolan (20-60 chars)"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onFocus={() => setCharState('typing')}
              onBlur={() => setCharState('idle')}
              error={errors.name}
              helperText={`${formData.name.length}/60`}
              required
              style={{ background: '#f9fafb', color: '#111827', border: '1px solid #e5e7eb' }}
            />

            <Input
              label="Email Address"
              type="email"
              icon={FiMail}
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onFocus={() => setCharState('typing')}
              onBlur={() => setCharState('idle')}
              error={errors.email}
              required
              style={{ background: '#f9fafb', color: '#111827', border: '1px solid #e5e7eb' }}
            />

            <Input
              label="Address"
              as="textarea"
              rows={2}
              icon={FiMapPin}
              placeholder="Street, City, Country (max 400 chars)"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              onFocus={() => setCharState('typing')}
              onBlur={() => setCharState('idle')}
              error={errors.address}
              helperText={`${formData.address.length}/400`}
              required
              style={{ background: '#f9fafb', color: '#111827', border: '1px solid #e5e7eb' }}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={FiLock}
              placeholder="8-16 chars, 1 uppercase, 1 special char"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onFocus={() => setCharState('password')}
              onBlur={() => setCharState('idle')}
              error={errors.password}
              showPasswordToggle
              isPasswordVisible={showPassword}
              onPasswordToggle={() => setShowPassword(!showPassword)}
              required
              style={{ background: '#f9fafb', color: '#111827', border: '1px solid #e5e7eb' }}
            />

            <Button
              type="submit"
              variant="dark"
              size="lg"
              isLoading={isLoading}
              style={{
                borderRadius: '12px',
                marginTop: '12px',
                background: '#111827',
                color: '#ffffff',
                fontWeight: 600,
              }}
            >
              Sign Up
            </Button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#111827', fontWeight: 700 }}>
              Log In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
