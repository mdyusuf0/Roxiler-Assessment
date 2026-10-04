import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

const RatingStars = ({
  rating = 0,
  maxRating = 5,
  isInteractive = false,
  onChange,
  size = 20,
  showValue = true,
  disabled = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating > 0 ? hoverRating : rating;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {Array.from({ length: maxRating }, (_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= displayRating;

          return (
            <motion.button
              key={starNumber}
              type="button"
              disabled={!isInteractive || disabled}
              onClick={() => isInteractive && onChange && onChange(starNumber)}
              onMouseEnter={() => isInteractive && setHoverRating(starNumber)}
              onMouseLeave={() => isInteractive && setHoverRating(0)}
              whileHover={isInteractive ? { scale: 1.25 } : {}}
              whileTap={isInteractive ? { scale: 0.9 } : {}}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '2px',
                cursor: isInteractive && !disabled ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isFilled ? '#f59e0b' : 'rgba(255, 255, 255, 0.2)',
                filter: isFilled ? 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.45))' : 'none',
                transition: 'color var(--transition-fast)',
              }}
              aria-label={`Rate ${starNumber} stars out of ${maxRating}`}
            >
              <FiStar
                size={size}
                style={{
                  fill: isFilled ? '#f59e0b' : 'transparent',
                  strokeWidth: 2,
                }}
              />
            </motion.button>
          );
        })}
      </div>

      {showValue && (
        <span
          style={{
            fontSize: `${Math.max(size * 0.7, 12)}px`,
            fontWeight: 700,
            color: rating > 0 ? '#fbbf24' : 'var(--text-muted)',
            minWidth: '24px',
          }}
        >
          {rating > 0 ? parseFloat(rating).toFixed(1) : '—'}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
