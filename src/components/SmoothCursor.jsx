import React, { useEffect, useRef, useState } from 'react';

const SmoothCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const canvasRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  // Position references (avoid react state rerenders for 144Hz performance)
  const mousePos = useRef({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const prevMousePos = useRef({ x: -200, y: -200 });
  const isMouseDown = useRef(false);
  const particles = useRef([]);
  const shockwaves = useRef([]);
  const rafId = useRef(null);

  useEffect(() => {
    // Suppress custom cursor on coarse touch screens
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Palette for Agni (Fire & Plasma Ember Trail)
    const AGNI_COLORS = [
      'rgba(249, 115, 22, ',  // Bright Orange
      'rgba(245, 158, 11, ',  // Warm Amber / Gold
      'rgba(239, 68, 68, ',   // Deep Flame Red
      'rgba(6, 182, 212, ',   // Electric Cyan Spark
      'rgba(129, 140, 248, ', // Plasma Violet
    ];

    // High performance pointer tracking - ZERO latency
    const onMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Instant hardware-accelerated positioning of central crosshair (0ms lag)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Calculate speed of mouse movement to spawn dynamic ember trail
      const dx = e.clientX - prevMousePos.current.x;
      const dy = e.clientY - prevMousePos.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Spawn Agni flame embers when moving
      if (speed > 1.5 && particles.current.length < 50) {
        const count = Math.min(3, Math.floor(speed / 8) + 1);
        for (let i = 0; i < count; i++) {
          const colorBase = AGNI_COLORS[Math.floor(Math.random() * AGNI_COLORS.length)];
          particles.current.push({
            x: e.clientX + (Math.random() - 0.5) * 6,
            y: e.clientY + (Math.random() - 0.5) * 6,
            vx: -dx * 0.12 + (Math.random() - 0.5) * 1.5,
            vy: -dy * 0.12 - Math.random() * 1.2, // Thermal upward draft
            size: Math.random() * 4 + 2,
            maxLife: Math.floor(Math.random() * 15 + 18),
            life: 0,
            colorBase,
            rotation: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 0.15,
          });
        }
      }

      prevMousePos.current.x = e.clientX;
      prevMousePos.current.y = e.clientY;
    };

    // Press Time Effect: Shockwave + Radial Sparks Burst
    const onMouseDown = (e) => {
      isMouseDown.current = true;
      setIsPressed(true);

      const x = e.clientX;
      const y = e.clientY;

      // 1. Expanding Sharp Diamond Shockwave
      shockwaves.current.push({
        x,
        y,
        radius: 8,
        maxRadius: 65,
        alpha: 1,
        color: 'rgba(34, 211, 238, ', // Glowing Cyan shockwave
        lineWidth: 2.5,
      });

      // 2. Burst of 14 Sharp Geometric Sparks
      const sparkCount = 14;
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.35;
        const velocity = Math.random() * 4.5 + 2.5;
        const colorBase = Math.random() > 0.4 ? 'rgba(34, 211, 238, ' : 'rgba(249, 115, 22, ';

        particles.current.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          size: Math.random() * 5 + 3,
          maxLife: Math.floor(Math.random() * 16 + 20),
          life: 0,
          colorBase,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.25,
        });
      }
    };

    const onMouseUp = () => {
      isMouseDown.current = false;
      setIsPressed(false);
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => {
      setIsVisible(false);
      isMouseDown.current = false;
      setIsPressed(false);
    };

    // Detect clickable / interactive elements for hover scale
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('.cursor-pointer') ||
        target.closest('[role="button"]')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    // Ultra-smooth 144Hz render loop with ZERO trailing sluggishness
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fast, responsive lerp (0.65 = snappy, immediate, zero drag lag)
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.65;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.65;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      ctx.save();
      ctx.globalCompositeOperation = 'lighter'; // Agni flame luminescence

      // Render & Update Expanding Sharp Diamond Shockwaves
      for (let i = shockwaves.current.length - 1; i >= 0; i--) {
        const sw = shockwaves.current[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.22 + 1.2;
        sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);

        if (sw.alpha <= 0.02 || sw.radius >= sw.maxRadius) {
          shockwaves.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(sw.x, sw.y);
        ctx.rotate(Math.PI / 4); // Sharp 45deg Diamond
        ctx.strokeStyle = `${sw.color}${sw.alpha})`;
        ctx.lineWidth = sw.lineWidth * sw.alpha;
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 12;
        ctx.strokeRect(-sw.radius / 2, -sw.radius / 2, sw.radius, sw.radius);
        ctx.restore();
      }

      // Render & Update Agni Embers / Sparks (Sharp Diamonds)
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.life++;

        if (p.life >= p.maxLife) {
          particles.current.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94; // Air friction
        p.vy *= 0.94;
        p.rotation += p.rotSpeed;

        const progress = p.life / p.maxLife;
        const alpha = (1 - progress) * 0.85;
        const currentSize = p.size * (1 - progress * 0.7);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = `${p.colorBase}${alpha})`;
        ctx.shadowColor = p.colorBase.includes('211') ? '#22d3ee' : '#f97316';
        ctx.shadowBlur = 8;
        // Sharp diamond ember
        ctx.fillRect(-currentSize / 2, -currentSize / 2, currentSize, currentSize);
        ctx.restore();
      }

      ctx.restore();

      rafId.current = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    rafId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  if (isTouchDevice) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-150 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* 144Hz Canvas for Smooth Agni Flame Trails & Click Sparks */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 w-full h-full"
      />

      {/* Outer Sharp Precision Geometric Reticle (Zero lag, snappy follow) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
        style={{
          transform: 'translate3d(-200px, -200px, 0)',
        }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 border border-cyan-400/80 shadow-[0_0_14px_rgba(34,211,238,0.4)] ${
            isPressed
              ? 'w-6 h-6 scale-75 bg-cyan-500/30 border-amber-400 rotate-45 shadow-[0_0_24px_rgba(245,158,11,0.9)]'
              : isHovered
              ? 'w-10 h-10 scale-110 bg-indigo-500/15 border-cyan-300 rotate-0 shadow-[0_0_18px_rgba(99,102,241,0.6)]'
              : 'w-7 h-7 scale-100 bg-transparent border-cyan-400/70 rotate-0'
          }`}
          style={{
            borderRadius: '0px', // Strictly sharp brutalist reticle
            transition: 'width 0.1s ease-out, height 0.1s ease-out, transform 0.08s ease-out, border-color 0.1s ease-out',
          }}
        >
          {/* Sharp Corner Reticle Brackets */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 border-cyan-300" />
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2 border-cyan-300" />
          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-2 border-l-2 border-cyan-300" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 border-cyan-300" />
        </div>
      </div>

      {/* Central Precision Crosshair Dot (Instantaneous 1:1 hardware tracked) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
        style={{
          transform: 'translate3d(-200px, -200px, 0)',
        }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 ${
            isPressed
              ? 'w-2 h-2 bg-amber-400 scale-150 shadow-[0_0_12px_#f59e0b]'
              : isHovered
              ? 'w-1.5 h-1.5 bg-cyan-300 scale-125 shadow-[0_0_10px_#22d3ee]'
              : 'w-1.5 h-1.5 bg-cyan-400 scale-100 shadow-[0_0_8px_#38bdf8]'
          }`}
          style={{
            borderRadius: '0px', // Strictly sharp crosshair point
            transition: 'transform 0.06s ease-out, background-color 0.08s ease-out',
          }}
        />
      </div>
    </div>
  );
};

export default SmoothCursor;
