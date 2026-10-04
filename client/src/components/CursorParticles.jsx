import React, { useEffect, useRef } from 'react';

const COLORS = [
  'rgba(99, 102, 241, ',   // Primary purple
  'rgba(139, 92, 246, ',  // Indigo
  'rgba(255, 107, 53, ',  // Brand orange
  'rgba(243, 198, 35, ',  // Brand yellow
];

const CursorParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    // Check if touch device only
    if ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles = [];
    const MAX_PARTICLES = 65;

    class Particle {
      constructor(x, y, isBurst = false) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = isBurst ? Math.random() * 3 + 1.5 : Math.random() * 1.2 + 0.3;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 0.4; // slight float up
        this.size = isBurst ? Math.random() * 4 + 2 : Math.random() * 3.5 + 1.5;
        this.alpha = 1;
        this.decay = isBurst ? Math.random() * 0.02 + 0.015 : Math.random() * 0.025 + 0.02;
        this.colorPrefix = COLORS[Math.floor(Math.random() * COLORS.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.size *= 0.96;
        this.alpha -= this.decay;
      }

      draw(c) {
        if (this.alpha <= 0) return;
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, Math.max(this.size, 0.5), 0, Math.PI * 2);
        c.fillStyle = `${this.colorPrefix}${Math.max(this.alpha * 0.7, 0)})`;
        c.shadowBlur = 8;
        c.shadowColor = `${this.colorPrefix}0.5)`;
        c.fill();
        c.restore();
      }
    }

    let lastSpawn = 0;
    const handleMouseMove = (e) => {
      const now = performance.now();
      if (now - lastSpawn < 30) return; // throttle 30ms
      lastSpawn = now;

      if (particles.length < MAX_PARTICLES) {
        particles.push(new Particle(e.clientX, e.clientY));
      }
    };

    const handleClick = (e) => {
      const burstCount = 10;
      for (let i = 0; i < burstCount; i++) {
        if (particles.length < MAX_PARTICLES + 15) {
          particles.push(new Particle(e.clientX, e.clientY, true));
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0 || p.size <= 0.4) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default CursorParticles;
