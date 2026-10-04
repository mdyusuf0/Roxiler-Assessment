import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Input = ({
  label,
  type = 'text',
  error,
  icon: Icon,
  helperText,
  showPasswordToggle = false,
  onPasswordToggle,
  isPasswordVisible,
  onFocus,
  onBlur,
  className = '',
  rows,
  as = 'input',
  ...props
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

  const Component = as;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }} className={className}>
      {label && (
        <label
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: error ? 'var(--accent-rose)' : isFocused ? 'var(--primary)' : 'var(--text-secondary)',
            transition: 'color var(--transition-fast)',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>{label}</span>
          {helperText && <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{helperText}</span>}
        </label>
      )}

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-input)',
          border: `1px solid ${error ? 'var(--accent-rose)' : isFocused ? 'var(--border-focus)' : 'var(--border-subtle)'}`,
          borderRadius: 'var(--radius-md)',
          transition: 'all var(--transition-fast)',
          boxShadow: isFocused ? '0 0 0 3px rgba(99, 102, 241, 0.15)' : 'none',
        }}
      >
        {Icon && (
          <span style={{ paddingLeft: '14px', color: isFocused ? 'var(--primary)' : 'var(--text-muted)', display: 'flex' }}>
            <Icon size={18} />
          </span>
        )}

        <Component
          type={type}
          rows={rows}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            width: '100%',
            padding: '12px 14px',
            paddingLeft: Icon ? '10px' : '14px',
            paddingRight: showPasswordToggle ? '40px' : '14px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none',
            resize: as === 'textarea' ? 'vertical' : 'none',
          }}
          {...props}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={onPasswordToggle}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute',
              right: '12px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
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
            color: 'var(--accent-rose)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
