import { useState, useEffect, useRef } from 'react';

/**
 * useCharacterMood - State machine & physical tracking engine for Login Characters
 * Moods: 'idle' | 'email' | 'password' | 'passwordVisible' | 'error' | 'success'
 */
export const useCharacterMood = () => {
  const [mood, setMood] = useState('idle');
  const [isBlinking, setIsBlinking] = useState(false);
  const [caretOffset, setCaretOffset] = useState(0); // 0 to 1 based on text length

  // Target and current smoothed eye coordinates (-1 to 1)
  const targetEye = useRef({ x: 0, y: 0 });
  const currentEye = useRef({ x: 0, y: 0 });
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });

  // Natural random blinking timer
  useEffect(() => {
    let blinkTimeout;
    const scheduleNextBlink = () => {
      const delay = Math.random() * 3200 + 2500; // 2.5s to 5.7s
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 160);
      }, delay);
    };

    scheduleNextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Mouse tracking across full window with lerp smoothing in requestAnimationFrame
  useEffect(() => {
    const handleMouseMove = (e) => {
      // If user is currently focused on password, eyes ignore mouse and look away
      if (mood === 'password') {
        targetEye.current = { x: -0.85, y: -0.6 }; // look away (up and left)
        return;
      }
      if (mood === 'passwordVisible') {
        targetEye.current = { x: 0.1, y: -0.7 }; // look straight up awkwardly
        return;
      }
      if (mood === 'email') {
        // Look towards the form on the right, modulated by typing caret progress
        const caretShift = (caretOffset - 0.5) * 0.4;
        targetEye.current = { x: 0.9 + caretShift, y: 0.15 };
        return;
      }

      // Idle mouse follow: compute vector relative to the character group's actual position
      const isMobile = window.innerWidth <= 820;
      const charCenterX = isMobile ? window.innerWidth * 0.5 : window.innerWidth * 0.25;
      const charCenterY = isMobile ? window.innerHeight * 0.28 : window.innerHeight * 0.72;

      const deltaX = e.clientX - charCenterX;
      const deltaY = e.clientY - charCenterY;

      // Higher sensitivity reach
      const reachX = isMobile ? window.innerWidth * 0.4 : window.innerWidth * 0.32;
      const reachY = isMobile ? window.innerHeight * 0.35 : window.innerHeight * 0.35;

      const normX = deltaX / reachX;
      const normY = deltaY / reachY;

      targetEye.current = {
        x: Math.max(-1, Math.min(1, normX)),
        y: Math.max(-1, Math.min(1, normY)),
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animId;
    const updatePhysics = () => {
      // Snappier, highly alert lerp tracking factor (0.18)
      currentEye.current.x += (targetEye.current.x - currentEye.current.x) * 0.18;
      currentEye.current.y += (targetEye.current.y - currentEye.current.y) * 0.18;

      setEyePos({
        x: currentEye.current.x,
        y: currentEye.current.y,
      });

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [mood, caretOffset]);

  // Sync mood override targets
  useEffect(() => {
    if (mood === 'password') {
      targetEye.current = { x: -0.85, y: -0.6 };
    } else if (mood === 'passwordVisible') {
      targetEye.current = { x: 0.1, y: -0.7 };
    } else if (mood === 'error') {
      targetEye.current = { x: -0.2, y: 0.4 }; // glance down/worried
    } else if (mood === 'success') {
      targetEye.current = { x: 0, y: -0.1 };
    }
  }, [mood]);

  return {
    mood,
    setMood,
    isBlinking,
    eyePos,
    setCaretOffset,
  };
};

export default useCharacterMood;
