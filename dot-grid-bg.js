/**
 * Trainer ID Portfolio — Interactive Dot Grid Background
 * Adapted with vermilion palette, dynamic theme switching, and global mouse tracking.
 */

(function () {
  /* ── Configuration ───────────────────────────────────────── */
  const CFG = {
    darkColor:    { r: 42, g: 42, b: 43 },      // #2a2a2b dark matrix dots
    darkHover:    { r: 230, g: 57, b: 70 },     // #e63946 vermilion glow on hover
    lightColor:   { r: 200, g: 190, b: 175 },   // #c8beaf light paper dots
    lightHover:   { r: 230, g: 57, b: 70 },     // #e63946 vermilion glow on hover
    dotSize:      2.5,     // px diameter at rest
    dotSpacing:   28,      // px between grid centres (matches 28px design system)
    orbitSpeed:   1.6,     // radians / sec multiplier
    impactRadius: 110,     // px from cursor
    scaleOnHover: 2.2,     // max scale factor
    enableRevolve: true,
  };

  /* ── Helpers ─────────────────────────────────────────────── */
  function smoothstep(t) {
    const c = Math.max(0, Math.min(1, t));
    return c * c * (3 - 2 * c);
  }

  /* ── Canvas bootstrap ────────────────────────────────────── */
  const canvas = document.getElementById("dot-grid-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let dpr = window.devicePixelRatio || 1;

  let W = 0, H = 0;
  let mouse = { x: -9999, y: -9999 };
  let hovering = false;
  let leaveTs = 0;
  let prevTs = 0;
  let globalAngle = 0;
  let dots = [];

  /* ── Build the dot grid ──────────────────────────────────── */
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

  /* ── Resize handler ──────────────────────────────────────── */
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildDots();
  }

  window.addEventListener("resize", resize);
  resize();

  let isLoopRunning = false;
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

  function wakeLoop() {
    if (!isLoopRunning) {
      isLoopRunning = true;
      requestAnimationFrame(loop);
    }
  }

  /* ── Window-wide pointer events so dots react across the page ─ */
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    hovering = true;
    wakeLoop();
  });

  document.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
    hovering = false;
    leaveTs = performance.now();
  });

  /* ── Touch support ───────────────────────────────────────── */
  window.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      const t = e.touches[0];
      mouse.x = t.clientX;
      mouse.y = t.clientY;
      hovering = true;
      wakeLoop();
    }
  }, { passive: true });

  window.addEventListener("touchend", () => {
    mouse.x = -9999;
    mouse.y = -9999;
    hovering = false;
    leaveTs = performance.now();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      wakeLoop();
    }
  });

  // Re-render when theme changes
  const themeObserver = new MutationObserver(() => {
    wakeLoop();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  /* ── Render loop ─────────────────────────────────────────── */
  function loop(ts) {
    if (document.hidden) {
      isLoopRunning = false;
      return;
    }

    const dt = Math.min((ts - (prevTs || ts)) / 1000, 0.05);
    prevTs = ts;

    globalAngle += CFG.orbitSpeed * dt;
    ctx.clearRect(0, 0, W, H);

    const isLight = document.documentElement.classList.contains("light") || document.body.classList.contains("light");
    const restColor = isLight ? CFG.lightColor : CFG.darkColor;
    const hoverColor = isLight ? CFG.lightHover : CFG.darkHover;

    const mx = mouse.x, my = mouse.y;
    const timeSinceLeave = hovering ? 0 : Math.max(0, ts - leaveTs) / 1000;
    const decay = hovering ? 1 : smoothstep(Math.max(0, 1 - timeSinceLeave * 1.5));

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      const dx = d.bx - mx;
      const dy = d.by - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const inRange = dist < CFG.impactRadius && dist > 0;

      let x = d.bx, y = d.by, scale = 1;
      let cr = restColor.r, cg = restColor.g, cb = restColor.b;
      let alpha = isLight ? 0.35 : 0.28;

      if (inRange) {
        const t = dist / CFG.impactRadius;
        const inf = smoothstep(1 - t) * decay;

        // Blend color toward hover vermilion
        cr = Math.round(restColor.r + (hoverColor.r - restColor.r) * inf);
        cg = Math.round(restColor.g + (hoverColor.g - restColor.g) * inf);
        cb = Math.round(restColor.b + (hoverColor.b - restColor.b) * inf);

        if (CFG.enableRevolve && (!prefersReducedMotion || !prefersReducedMotion.matches)) {
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

    // When completely idle and decay settled, sleep until next pointer move
    if (!hovering && decay <= 0.001) {
      isLoopRunning = false;
      return;
    }

    requestAnimationFrame(loop);
  }

  // Initial draw
  wakeLoop();
})();
