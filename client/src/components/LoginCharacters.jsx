import React from 'react';
import { motion } from 'framer-motion';

/**
 * LoginCharacters - Layered interactive SVG mascots matching Login_page_video.mp4
 * 
 * Supports:
 * - Drop & bounce intro animation on initial load
 * - Smooth cursor pupil tracking & parallax face shifts
 * - Body lean toward form when typing email/text
 * - Looking away politely when password is focused (hidden)
 * - Awkward aversion / peek when password is made visible
 * - Sad expressions & group shake on error
 * - Joyous smiles & celebratory jump on success
 */
const LoginCharacters = ({
  mood = 'idle', // 'idle' | 'email' | 'password' | 'passwordVisible' | 'error' | 'success'
  isBlinking = false,
  eyePos = { x: 0, y: 0 },
}) => {
  // Parallax offsets based on cursor
  const purpleFaceX = eyePos.x * 5;
  const purpleFaceY = eyePos.y * 4;
  const blackFaceX = eyePos.x * 4;
  const blackFaceY = eyePos.y * 3;
  const orangeFaceX = eyePos.x * 6;
  const orangeFaceY = eyePos.y * 3;
  const yellowFaceX = eyePos.x * 4;
  const yellowFaceY = eyePos.y * 3;

  // Group shake variant on error
  const containerVariants = {
    error: {
      x: [-12, 12, -9, 9, -5, 5, -2, 2, 0],
      transition: { duration: 0.55, ease: 'easeInOut' },
    },
    success: {
      y: [0, -28, 0, -14, 0],
      transition: { duration: 0.65, ease: 'easeOut' },
    },
    idle: {
      x: 0,
      y: 0,
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      animate={mood === 'error' ? 'error' : mood === 'success' ? 'success' : 'idle'}
      style={{
        width: '100%',
        maxWidth: '460px',
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
        {/* ── 1. PURPLE RECTANGLE CHARACTER (Back Left) ── */}
        <motion.g
          initial={{ y: -220, opacity: 0 }}
          animate={
            mood === 'email'
              ? { y: 0, opacity: 1, rotate: 6, skewX: -5, x: 22 }
              : mood === 'password'
              ? { y: 0, opacity: 1, rotate: -5, x: -14 }
              : mood === 'passwordVisible'
              ? { y: -8, opacity: 1, rotate: -2, x: -6 }
              : mood === 'error'
              ? { y: 6, opacity: 1, rotate: -3 }
              : mood === 'success'
              ? { y: [0, -24, 0], opacity: 1, rotate: [0, -4, 0] }
              : { y: [0, -3, 0], opacity: 1, rotate: eyePos.x * 1.5, x: eyePos.x * 2 }
          }
          transition={
            mood === 'idle'
              ? { y: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }, duration: 0.25 }
              : { type: 'spring', stiffness: 260, damping: 20 }
          }
          style={{ transformOrigin: '200px 340px' }}
        >
          {/* Main Body */}
          <rect x="135" y="80" width="130" height="260" rx="6" fill="#6726FE" />

          {/* Face Group (Eyes + Nose/Mouth) */}
          <motion.g animate={{ x: purpleFaceX, y: purpleFaceY }} transition={{ duration: 0.1 }}>
            {/* Left Eye */}
            <circle cx="176" cy="112" r="7" fill="white" />
            <motion.circle
              cx={176 + eyePos.x * 3.6}
              cy={112 + eyePos.y * 3.4}
              r="3.5"
              fill="black"
              animate={{
                scaleY: isBlinking || mood === 'success' ? 0.1 : 1,
              }}
              transition={{ duration: 0.12 }}
            />

            {/* Right Eye */}
            <circle cx="218" cy="112" r="7" fill="white" />
            <motion.circle
              cx={218 + eyePos.x * 3.6}
              cy={112 + eyePos.y * 3.4}
              r="3.5"
              fill="black"
              animate={{
                scaleY: isBlinking || mood === 'success' ? 0.1 : 1,
              }}
              transition={{ duration: 0.12 }}
            />

            {/* Mouth / Vertical Nose Slit */}
            {mood === 'error' ? (
              // Frowning sad mouth arc
              <path
                d="M 188 128 Q 197 118 206 128"
                stroke="black"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            ) : mood === 'success' ? (
              // Cheerful happy smile arc
              <path
                d="M 188 120 Q 197 132 206 120"
                stroke="black"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              // Distinctive vertical slit nose
              <line
                x1="197"
                y1="107"
                x2="197"
                y2="134"
                stroke="black"
                strokeWidth="5"
                strokeLinecap="round"
              />
            )}
          </motion.g>
        </motion.g>

        {/* ── 2. BLACK RECTANGLE CHARACTER (Middle) ── */}
        <motion.g
          initial={{ y: -340, rotate: -35, opacity: 0 }}
          animate={
            mood === 'email'
              ? { y: 0, rotate: 4, x: 14, opacity: 1 }
              : mood === 'password'
              ? { y: 0, rotate: -6, x: -10, opacity: 1 }
              : mood === 'passwordVisible'
              ? { y: 15, rotate: -2, x: 0, opacity: 1 }
              : mood === 'error'
              ? { y: 4, rotate: 2, opacity: 1 }
              : mood === 'success'
              ? { y: [0, -30, 0], rotate: [0, 5, 0], opacity: 1 }
              : { y: [0, -2, 0], rotate: 0, opacity: 1 }
          }
          transition={
            mood === 'idle'
              ? { y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' } }
              : { type: 'spring', stiffness: 280, damping: 22, delay: 0.15 }
          }
          style={{ transformOrigin: '260px 340px' }}
        >
          {/* Main Body */}
          <rect x="220" y="165" width="85" height="175" rx="4" fill="#1C1C22" />

          {/* Face Group */}
          <motion.g animate={{ x: blackFaceX, y: blackFaceY }} transition={{ duration: 0.1 }}>
            {/* Left Eye */}
            <circle cx="264" cy="192" r="8" fill="white" />
            <motion.circle
              cx={264 + eyePos.x * 3.8}
              cy={192 + eyePos.y * 3.4}
              r="4.2"
              fill="black"
              animate={{
                scaleY: isBlinking || mood === 'success' ? 0.1 : 1,
              }}
              transition={{ duration: 0.12 }}
            />

            {/* Right Eye */}
            <circle cx="288" cy="192" r="8" fill="white" />
            <motion.circle
              cx={288 + eyePos.x * 3.8}
              cy={192 + eyePos.y * 3.4}
              r="4.2"
              fill="black"
              animate={{
                scaleY: isBlinking || mood === 'success' ? 0.1 : 1,
              }}
              transition={{ duration: 0.12 }}
            />

            {/* Error or concerned mouth */}
            {mood === 'error' && (
              <path
                d="M 268 214 Q 276 206 284 214"
                stroke="white"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            )}

            {mood === 'success' && (
              <path
                d="M 268 208 Q 276 218 284 208"
                stroke="white"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            )}
          </motion.g>
        </motion.g>

        {/* ── 3. ORANGE DOME CHARACTER (Front Left Semi-Circle) ── */}
        <motion.g
          initial={{ y: 160, scaleY: 0.4, opacity: 0 }}
          animate={
            mood === 'email'
              ? { y: 0, scaleY: 1, x: 8, opacity: 1 }
              : mood === 'password'
              ? { y: 0, scaleY: 1, x: -6, opacity: 1 }
              : mood === 'error'
              ? { y: 2, scaleY: 0.95, opacity: 1 }
              : mood === 'success'
              ? { y: [0, -22, 0], scaleY: [1, 1.08, 1], opacity: 1 }
              : { y: [0, -2.5, 0], scaleY: 1, opacity: 1 }
          }
          transition={
            mood === 'idle'
              ? { y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } }
              : { type: 'spring', stiffness: 320, damping: 24, delay: 0.25 }
          }
          style={{ transformOrigin: '160px 340px' }}
        >
          {/* Half-circle Dome Body */}
          <path d="M 40 340 A 120 120 0 0 1 280 340 Z" fill="#FF6B35" />

          {/* Face Group */}
          <motion.g animate={{ x: orangeFaceX, y: orangeFaceY }} transition={{ duration: 0.1 }}>
            {/* Left Eye */}
            <motion.circle
              cx={144 + eyePos.x * 3.4}
              cy={295 + eyePos.y * 3.2}
              r="5.5"
              fill="black"
              animate={{
                scaleY: isBlinking || mood === 'success' ? 0.1 : 1,
              }}
              transition={{ duration: 0.12 }}
            />

            {/* Right Eye */}
            <motion.circle
              cx={196 + eyePos.x * 3.4}
              cy={295 + eyePos.y * 3.2}
              r="5.5"
              fill="black"
              animate={{
                scaleY: isBlinking || mood === 'success' ? 0.1 : 1,
              }}
              transition={{ duration: 0.12 }}
            />

            {/* Mouth */}
            {mood === 'error' ? (
              // Frown Arc
              <path
                d="M 162 318 Q 170 306 178 318"
                stroke="black"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            ) : mood === 'success' ? (
              // Big Open Joy Smile
              <path
                d="M 160 304 Q 170 324 180 304 Z"
                fill="black"
              />
            ) : (
              // Gentle Warm Smile
              <path
                d="M 163 306 Q 170 317 177 306 Z"
                fill="black"
              />
            )}
          </motion.g>
        </motion.g>

        {/* ── 4. YELLOW PILL ARCH CHARACTER (Front Right) ── */}
        <motion.g
          initial={{ y: 150, opacity: 0 }}
          animate={
            mood === 'email'
              ? { y: 0, x: 10, opacity: 1 }
              : mood === 'password'
              ? { y: 0, x: -8, opacity: 1 }
              : mood === 'error'
              ? { y: 2, x: 0, opacity: 1 }
              : mood === 'success'
              ? { y: [0, -25, 0], opacity: 1 }
              : { y: [0, -2, 0], opacity: 1 }
          }
          transition={
            mood === 'idle'
              ? { y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' } }
              : { type: 'spring', stiffness: 300, damping: 24, delay: 0.3 }
          }
          style={{ transformOrigin: '320px 340px' }}
        >
          {/* Rounded-top Arch Body */}
          <path d="M 270 340 L 270 240 A 50 50 0 0 1 370 240 L 370 340 Z" fill="#F3C623" />

          {/* Face Group */}
          <motion.g animate={{ x: yellowFaceX, y: yellowFaceY }} transition={{ duration: 0.1 }}>
            {/* Single Profile Eye */}
            <motion.circle
              cx={304 + eyePos.x * 3.6}
              cy={264 + eyePos.y * 3.2}
              r="5.5"
              fill="black"
              animate={{
                scaleY: isBlinking || mood === 'success' ? 0.1 : 1,
              }}
              transition={{ duration: 0.12 }}
            />

            {/* Horizontal Beak / Mouth Bar */}
            <motion.line
              x1="322"
              y1="282"
              x2="388"
              y2="282"
              stroke="black"
              strokeWidth="5"
              strokeLinecap="round"
              animate={
                mood === 'error'
                  ? { rotate: 16, originX: '322px', originY: '282px' }
                  : mood === 'success'
                  ? { rotate: -14, originX: '322px', originY: '282px' }
                  : { rotate: 0 }
              }
              transition={{ duration: 0.2 }}
            />
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
};

export default LoginCharacters;
