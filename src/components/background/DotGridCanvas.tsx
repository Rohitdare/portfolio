'use client';

import { useEffect, useRef } from 'react';

const CFG = {
  darkColor:    { r: 42, g: 42, b: 43 },
  darkHover:    { r: 230, g: 57, b: 70 },
  lightColor:   { r: 200, g: 190, b: 175 },
  lightHover:   { r: 230, g: 57, b: 70 },
  dotSize:      2.5,
  dotSpacing:   28,
  orbitSpeed:   1.6,
  impactRadius: 110,
  scaleOnHover: 2.2,
  enableRevolve: true,
};

function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

interface Dot {
  bx: number;
  by: number;
  inclination: number;
  ascension: number;
  phase: number;
  speedMult: number;
}

export default function DotGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let dpr = window.devicePixelRatio || 1;
    const mouse = { x: -9999, y: -9999 };
    let hovering = false;
    let leaveTs = 0;
    let prevTs = 0;
    let globalAngle = 0;
    let dots: Dot[] = [];
    let isLoopRunning = false;
    let animId: number;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function buildDots() {
      dots = [];
      const sp = CFG.dotSpacing;
      const cols = Math.ceil(W / sp) + 3;
      const rows = Math.ceil(H / sp) + 3;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            bx: (c - 1) * sp,
            by: (r - 1) * sp,
            inclination: Math.random() * Math.PI,
            ascension: Math.random() * Math.PI * 2,
            phase: Math.random() * Math.PI * 2,
            speedMult: 0.7 + Math.random() * 0.6,
          });
        }
      }
    }

    function resize() {
      if (!canvas || !ctx) return;
      W = window.innerWidth;
      H = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots();
    }

    function wakeLoop() {
      if (!isLoopRunning) {
        isLoopRunning = true;
        animId = requestAnimationFrame(loop);
      }
    }

    function loop(ts: number) {
      if (document.hidden) {
        isLoopRunning = false;
        return;
      }

      const dt = Math.min((ts - (prevTs || ts)) / 1000, 0.05);
      prevTs = ts;

      globalAngle += CFG.orbitSpeed * dt;
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      const isLight = document.documentElement.classList.contains('light');
      const restColor = isLight ? CFG.lightColor : CFG.darkColor;
      const hoverColor = isLight ? CFG.lightHover : CFG.darkHover;

      const mx = mouse.x;
      const my = mouse.y;
      const timeSinceLeave = hovering ? 0 : Math.max(0, ts - leaveTs) / 1000;
      const decay = hovering ? 1 : smoothstep(Math.max(0, 1 - timeSinceLeave * 1.5));

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const dx = d.bx - mx;
        const dy = d.by - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const inRange = dist < CFG.impactRadius && dist > 0;

        let x = d.bx;
        let y = d.by;
        let scale = 1;
        let cr = restColor.r;
        let cg = restColor.g;
        let cb = restColor.b;
        let alpha = isLight ? 0.35 : 0.28;

        if (inRange) {
          const t = dist / CFG.impactRadius;
          const inf = smoothstep(1 - t) * decay;

          cr = Math.round(restColor.r + (hoverColor.r - restColor.r) * inf);
          cg = Math.round(restColor.g + (hoverColor.g - restColor.g) * inf);
          cb = Math.round(restColor.b + (hoverColor.b - restColor.b) * inf);

          if (CFG.enableRevolve && !prefersReducedMotion.matches) {
            const orbitR = (1 - t) * CFG.dotSpacing * 0.75 * inf;
            const theta = globalAngle * d.speedMult + d.phase;

            const cosA = Math.cos(d.ascension);
            const sinA = Math.sin(d.ascension);
            const cosI = Math.cos(d.inclination);
            const sinI = Math.sin(d.inclination);

            const lx = Math.cos(theta);
            const ly = Math.sin(theta) * cosI;
            const lz = Math.sin(theta) * sinI;

            const ox = (lx * cosA - ly * sinA) * orbitR;
            const oy = (lx * sinA + ly * cosA) * orbitR;

            x = d.bx + ox;
            y = d.by + oy;

            const depthScale = 0.75 + 0.35 * ((lz + 1) * 0.5);
            scale = (1 + (CFG.scaleOnHover - 1) * inf) * depthScale;
            alpha = (0.3 + 0.7 * inf) * depthScale;
          } else {
            scale = 1 + (CFG.scaleOnHover - 1) * inf;
            alpha = 0.3 + 0.7 * inf;
          }
        }

        const radius = (CFG.dotSize / 2) * scale;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.fill();
      }

      if (!hovering && decay <= 0.001) {
        isLoopRunning = false;
        return;
      }

      animId = requestAnimationFrame(loop);
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      hovering = true;
      wakeLoop();
    };

    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      hovering = false;
      leaveTs = performance.now();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        mouse.x = t.clientX;
        mouse.y = t.clientY;
        hovering = true;
        wakeLoop();
      }
    };

    const onTouchEnd = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      hovering = false;
      leaveTs = performance.now();
    };

    const onVisibilityChange = () => {
      if (!document.hidden) wakeLoop();
    };

    const themeObserver = new MutationObserver(() => {
      wakeLoop();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    document.addEventListener('visibilitychange', onVisibilityChange);

    resize();
    wakeLoop();

    return () => {
      cancelAnimationFrame(animId);
      themeObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <div id="dot-grid-bg" className="dot-grid-bg" aria-hidden="true">
      <canvas id="dot-grid-canvas" ref={canvasRef} />
    </div>
  );
}
