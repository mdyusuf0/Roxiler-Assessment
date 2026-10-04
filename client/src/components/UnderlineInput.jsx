import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';

/**
 * UnderlineInput - Clean underline text input matching the reference video
 */
const UnderlineInput = ({
  label,
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  placeholder,
  showPasswordToggle = false,
  isPasswordVisible = false,
  onPasswordToggle,
  required = false,
  name,
  id,
  autoComplete,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'relative' }}>
      {label && (
        <label
          htmlFor={id || name}
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: error ? '#ef4444' : isFocused ? '#111827' : '#4b5563',
            marginBottom: '6px',
            transition: 'color 0.2s ease',
          }}
        >
          {label}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: `1.5px solid ${error ? '#ef4444' : '#e5e7eb'}`,
            padding: '10px 0',
            paddingRight: showPasswordToggle ? '36px' : '0',
            fontSize: '15px',
            color: '#111827',
            outline: 'none',
            fontWeight: 500,
            transition: 'border-color 0.2s ease',
          }}
        />

        {/* Animated Active Focus Underline Bar */}
        <motion.div
          initial={false}
          animate={{
            scaleX: isFocused ? 1 : 0,
            backgroundColor: error ? '#ef4444' : '#111827',
          }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            transformOrigin: 'left',
            pointerEvents: 'none',
          }}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={onPasswordToggle}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              transition: 'color 0.15s ease',
            }}
          >
            {isPasswordVisible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <span
          style={{
            fontSize: '12px',
            color: '#ef4444',
            marginTop: '5px',
            fontWeight: 500,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default UnderlineInput;
