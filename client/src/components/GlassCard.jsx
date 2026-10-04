import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({
  children,
  className = '',
  hoverEffect = false,
  style = {},
  onClick,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, boxShadow: '0 12px 30px -6px rgba(0, 0, 0, 0.45)' } : {}}
      transition={{ duration: 0.2 }}
      className={`glass-panel ${className}`}
      style={{
        padding: '24px',
        ...style,
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
