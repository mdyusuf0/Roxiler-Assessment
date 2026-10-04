import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * DoodleCharacters - Interactive animated brand mascots
 * States: 'idle' | 'typing' | 'password' | 'peek' | 'success' | 'error'
 */
const DoodleCharacters = ({ state = 'idle', inputLength = 0, isPeeking = false }) => {
  const [blink, setBlink] = useState(false);

  // Natural blinking interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  // Eye gaze tracking based on input length or state
  const gazeX = state === 'typing' ? Math.min(Math.max((inputLength - 15) * 0.8, -6), 8) : 0;
  const gazeY = state === 'typing' ? 3 : 0;

  // Shake variant for error
  const shakeVariant = {
    error: {
      x: [-6, 6, -5, 5, -2, 2, 0],
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    success: {
      y: [0, -16, 0, -10, 0],
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    idle: {
      x: 0,
      y: 0,
    },
  };

  return (
    <motion.div
      variants={shakeVariant}
      animate={state === 'error' ? 'error' : state === 'success' ? 'success' : 'idle'}
      style={{
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}
    >
      <svg
        viewBox="0 0 460 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        <defs>
          <clipPath id="purpleHeadClip">
            <rect x="135" y="80" width="130" height="260" rx="4" />
          </clipPath>
          <clipPath id="yellowArchClip">
            <path d="M 270 340 L 270 230 A 55 55 0 0 1 380 230 L 380 340 Z" />
          </clipPath>
          <clipPath id="orangeDomeClip">
            <path d="M 50 340 A 130 130 0 0 1 310 340 Z" />
          </clipPath>
        </defs>

        {/* ── 1. PURPLE CHARACTER (Back Left Tall Rectangle) ── */}
        <motion.g
          animate={
            state === 'success'
              ? { y: [0, -20, 0], rotate: [0, -3, 0] }
              : state === 'error'
              ? { rotate: [-2, 2, 0] }
              : { y: [0, -3, 0] }
          }
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Body */}
          <rect x="135" y="80" width="130" height="260" rx="4" fill="#6726FE" />

          {/* Left Eye */}
          <circle cx="178" cy="115" r="7" fill="white" />
          <motion.circle
            cx="178"
            cy="115"
            r="3.5"
            fill="black"
            animate={{
              x: state === 'password' && !isPeeking ? -4 : gazeX,
              y: state === 'password' && !isPeeking ? -3 : gazeY,
              scaleY: blink || (state === 'password' && !isPeeking) ? 0.1 : 1,
            }}
            transition={{ duration: 0.15 }}
          />

          {/* Right Eye */}
          <circle cx="222" cy="115" r="7" fill="white" />
          <motion.circle
            cx="222"
            cy="115"
            r="3.5"
            fill="black"
            animate={{
              x: state === 'password' && !isPeeking ? 4 : gazeX,
              y: state === 'password' && !isPeeking ? -3 : gazeY,
              scaleY: blink || (state === 'password' && !isPeeking) ? 0.1 : 1,
            }}
            transition={{ duration: 0.15 }}
          />

          {/* Nose/Mouth vertical slit */}
          <line
            x1="200"
            y1="110"
            x2="200"
            y2="138"
            stroke="black"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Purple Character Cover Hands for Password */}
          <motion.g
            initial={false}
            animate={{
              y: state === 'password' && !isPeeking ? 0 : 70,
              opacity: state === 'password' && !isPeeking ? 1 : 0,
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            <rect x="160" y="102" width="80" height="26" rx="8" fill="#521cd1" stroke="#3c139c" strokeWidth="2" />
            <circle cx="175" cy="115" r="6" fill="#3c139c" opacity="0.3" />
            <circle cx="225" cy="115" r="6" fill="#3c139c" opacity="0.3" />
          </motion.g>

          {/* Peeking eyelids when user clicks show password */}
          {state === 'password' && isPeeking && (
            <text x="186" y="100" fill="#fff" fontSize="12" fontWeight="bold">👀</text>
          )}
        </motion.g>

        {/* ── 2. BLACK CHARACTER (Middle Behind Orange/Yellow) ── */}
        <motion.g
          animate={
            state === 'success'
              ? { y: [0, -25, 0], rotate: [0, 4, 0] }
              : state === 'password' && !isPeeking
              ? { y: 25 }
              : { y: [0, -2, 0] }
          }
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Body */}
          <rect x="220" y="170" width="85" height="170" rx="3" fill="#1C1C22" />

          {/* Left Eye */}
          <circle cx="265" cy="195" r="8" fill="white" />
          <motion.circle
            cx="265"
            cy="195"
            r="4.2"
            fill="black"
            animate={{
              x: state === 'password' && !isPeeking ? 5 : gazeX * 0.7,
              y: state === 'password' && !isPeeking ? -4 : gazeY * 0.7,
              scaleY: blink ? 0.1 : 1,
            }}
            transition={{ duration: 0.15 }}
          />

          {/* Right Eye */}
          <circle cx="288" cy="195" r="8" fill="white" />
          <motion.circle
            cx="288"
            cy="195"
            r="4.2"
            fill="black"
            animate={{
              x: state === 'password' && !isPeeking ? 5 : gazeX * 0.7,
              y: state === 'password' && !isPeeking ? -4 : gazeY * 0.7,
              scaleY: blink ? 0.1 : 1,
            }}
            transition={{ duration: 0.15 }}
          />

          {/* Blushing / expression changes */}
          {state === 'error' && (
            <path d="M 268 215 Q 276 210 284 215" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}
        </motion.g>

        {/* ── 3. ORANGE CHARACTER (Front Left Semi-Circle) ── */}
        <motion.g
          animate={
            state === 'success'
              ? { y: [0, -18, 0], scaleY: [1, 1.05, 1] }
              : state === 'error'
              ? { rotate: [-1.5, 1.5, 0] }
              : { y: [0, -2, 0] }
          }
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Half circle dome */}
          <path d="M 40 340 A 120 120 0 0 1 280 340 Z" fill="#FF6B35" />

          {/* Left Eye */}
          <motion.circle
            cx="145"
            cy="295"
            r="6"
            fill="black"
            animate={{
              x: state === 'password' && !isPeeking ? -5 : gazeX,
              y: state === 'password' && !isPeeking ? 5 : gazeY,
              scaleY: blink || (state === 'password' && !isPeeking) ? 0.1 : 1,
            }}
            transition={{ duration: 0.15 }}
          />

          {/* Right Eye */}
          <motion.circle
            cx="195"
            cy="295"
            r="6"
            fill="black"
            animate={{
              x: state === 'password' && !isPeeking ? -5 : gazeX,
              y: state === 'password' && !isPeeking ? 5 : gazeY,
              scaleY: blink || (state === 'password' && !isPeeking) ? 0.1 : 1,
            }}
            transition={{ duration: 0.15 }}
          />

          {/* Mouth - Happy / Concerned */}
          {state === 'error' ? (
            <path d="M 163 316 Q 170 308 177 316" stroke="black" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M 163 306 Q 170 318 177 306 Z" fill="black" />
          )}

          {/* Orange Cover Paws */}
          <motion.g
            animate={{
              y: state === 'password' && !isPeeking ? 0 : 50,
              opacity: state === 'password' && !isPeeking ? 1 : 0,
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            <circle cx="145" cy="295" r="14" fill="#e85923" />
            <circle cx="195" cy="295" r="14" fill="#e85923" />
          </motion.g>
        </motion.g>

        {/* ── 4. YELLOW CHARACTER (Front Right Arch Pill) ── */}
        <motion.g
          animate={
            state === 'success'
              ? { y: [0, -22, 0], rotate: [0, 5, 0] }
              : state === 'error'
              ? { rotate: [1, -1, 0] }
              : { y: [0, -2.5, 0] }
          }
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Arch Body */}
          <path d="M 270 340 L 270 240 A 50 50 0 0 1 370 240 L 370 340 Z" fill="#F3C623" />

          {/* Profile Eye */}
          <motion.circle
            cx="305"
            cy="265"
            r="5.5"
            fill="black"
            animate={{
              x: state === 'password' && !isPeeking ? 6 : gazeX * 0.8,
              y: state === 'password' && !isPeeking ? -4 : gazeY * 0.8,
              scaleY: blink || (state === 'password' && !isPeeking) ? 0.1 : 1,
            }}
            transition={{ duration: 0.15 }}
          />

          {/* Horizontal Beak / Mouth protruding */}
          <motion.line
            x1="322"
            y1="282"
            x2="388"
            y2="282"
            stroke="black"
            strokeWidth="5"
            strokeLinecap="round"
            animate={
              state === 'error'
                ? { rotate: 8, originX: '322px', originY: '282px' }
                : state === 'success'
                ? { rotate: -6, originX: '322px', originY: '282px' }
                : { rotate: 0 }
            }
          />

          {/* Yellow cover wing for password */}
          <motion.g
            animate={{
              x: state === 'password' && !isPeeking ? -10 : 60,
              opacity: state === 'password' && !isPeeking ? 1 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <path d="M 330 250 Q 295 265 315 285 Z" fill="#d9ad14" />
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
};

export default DoodleCharacters;
