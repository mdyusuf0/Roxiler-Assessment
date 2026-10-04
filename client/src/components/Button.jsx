import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-fast)',
    border: 'none',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    position: 'relative',
    userSelect: 'none',
    gap: '8px',
  };

  const sizeStyles = {
    sm: { padding: '8px 14px', fontSize: '13px' },
    md: { padding: '12px 20px', fontSize: '15px' },
    lg: { padding: '15px 28px', fontSize: '16px' },
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.08)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-glass)',
      backdropFilter: 'blur(8px)',
    },
    danger: {
      background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 15px rgba(244, 63, 94, 0.35)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
    },
    dark: {
      background: '#111827',
      color: '#f9fafb',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
  };

  return (
    <motion.button
      type={type}
      whileHover={!disabled && !isLoading ? { y: -2, filter: 'brightness(1.08)' } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
      }}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={className}
      {...props}
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
              animation: 'spin 0.7s linear infinite',
            }}
          />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.button>
  );
};

export default Button;
