// oneko.js — Interactive Desktop Cat with Drag & Place and Click to Stop / Sleep
// Based on adryd325/oneko.js with custom controls for drag-and-drop & pause
(function oneko() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  const nekoEl = document.createElement("div");
  let persistPosition = true;
  let nekoFile = "./assets/oneko.gif";

  let nekoPosX = 64;
  let nekoPosY = 120;
  
  let mousePosX = nekoPosX;
  let mousePosY = nekoPosY;

  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;

  // Custom Controls State
  let isStopped = false; // When true, stays resting/sleeping where placed
  let isDragging = false;
  let hasDragged = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let activeBalloon = null;
  let balloonTimeout = null;

  const nekoSpeed = 10;
  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    scratchWallN: [
      [0, 0],
      [0, -1],
    ],
    scratchWallS: [
      [-7, -1],
      [-6, -2],
    ],
    scratchWallE: [
      [-2, -2],
      [-2, -3],
    ],
    scratchWallW: [
      [-4, 0],
      [-4, -1],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ],
    N: [
      [-1, -2],
      [-1, -3],
    ],
    NE: [
      [0, -2],
      [0, -3],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    SE: [
      [-5, -1],
      [-5, -2],
    ],
    S: [
      [-6, -3],
      [-7, -2],
    ],
    SW: [
      [-5, -3],
      [-6, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
    NW: [
      [-1, 0],
      [-1, -1],
    ],
  };

  /* ── Tactile Audio Feedback ───────────────────────────────── */
  function playSfx(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      window.__onekoAudioCtx = window.__onekoAudioCtx || new AudioCtx();
      const ctx = window.__onekoAudioCtx;
      if (ctx.state === "suspended") ctx.resume();

      const tones = {
        pickup: { f1: 440, f2: 780, dur: 0.1, type: "sine" },
        drop:   { f1: 480, f2: 290, dur: 0.18, type: "triangle" },
        sleep:  { f1: 480, f2: 290, dur: 0.18, type: "triangle" },
        wake:   { f1: 587, f2: 880, dur: 0.14, type: "sine" }
      }[type];
      if (!tones) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = tones.type;
      osc.frequency.setValueAtTime(tones.f1, now);
      osc.frequency.exponentialRampToValueAtTime(tones.f2, now + tones.dur * 0.8);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + tones.dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + tones.dur);
    } catch (_) {}
  }

  /* ── Retro Floating Balloon ──────────────────────────────── */
  function showBalloon(text) {
    if (activeBalloon) {
      activeBalloon.remove();
      activeBalloon = null;
    }
    clearTimeout(balloonTimeout);

    const balloon = document.createElement("div");
    balloon.className = "oneko-balloon";
    balloon.textContent = text;
    balloon.style.left = `${nekoPosX}px`;
    balloon.style.top = `${nekoPosY - 20}px`;
    document.body.appendChild(balloon);
    activeBalloon = balloon;

    balloonTimeout = setTimeout(() => {
      if (activeBalloon === balloon) {
        balloon.style.transition = "opacity 0.25s ease, transform 0.25s ease";
        balloon.style.opacity = "0";
        balloon.style.transform = "translate(-50%, -120%) scale(0.9)";
        setTimeout(() => {
          balloon.remove();
          if (activeBalloon === balloon) activeBalloon = null;
        }, 250);
      }
    }, 1800);
  }

  /* ── Initialization ───────────────────────────────────────── */
  function init() {
    // Restore persistent state if available
    if (persistPosition) {
      try {
        const stored = JSON.parse(window.localStorage.getItem("oneko_state"));
        if (stored) {
          if (typeof stored.nekoPosX === "number") nekoPosX = stored.nekoPosX;
          if (typeof stored.nekoPosY === "number") nekoPosY = stored.nekoPosY;
          if (typeof stored.isStopped === "boolean") isStopped = stored.isStopped;
        }
      } catch (_) {}
    }

    nekoEl.id = "oneko";
    nekoEl.setAttribute("aria-label", "Oneko desktop cat companion. Drag to place, click to sleep or wake.");
    nekoEl.setAttribute("role", "button");
    nekoEl.setAttribute("tabindex", "0");
    nekoEl.style.width = "32px";
    nekoEl.style.height = "32px";
    nekoEl.style.position = "fixed";
    nekoEl.style.pointerEvents = "auto";
    nekoEl.style.cursor = "grab";
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    nekoEl.style.zIndex = "2147483647";
    nekoEl.style.backgroundImage = `url(${nekoFile})`;
    nekoEl.style.backgroundRepeat = "no-repeat";

    document.body.appendChild(nekoEl);

    // Initial state
    if (isStopped) {
      setSprite("sleeping", 0);
    } else {
      setSprite("idle", 0);
    }

    /* ── Mouse & Drag Event Listeners ────────────────────────── */
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchmove", onPointerMove, { passive: false });

    nekoEl.addEventListener("mousedown", onPointerDown);
    nekoEl.addEventListener("touchstart", onPointerDown, { passive: false });

    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchend", onPointerUp);

    // Keyboard accessibility (Space/Enter to toggle sleep/wake)
    nekoEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleStop();
      }
    });

    if (persistPosition) {
      window.addEventListener("beforeunload", () => {
        try {
          window.localStorage.setItem(
            "oneko_state",
            JSON.stringify({
              nekoPosX,
              nekoPosY,
              isStopped,
            })
          );
        } catch (_) {}
      });
    }

    window.requestAnimationFrame(onAnimationFrame);
  }

  /* ── Drag & Placement Controls ───────────────────────────── */
  function onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();

    isDragging = true;
    hasDragged = false;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    dragStartX = clientX;
    dragStartY = clientY;

    dragOffsetX = clientX - nekoPosX;
    dragOffsetY = clientY - nekoPosY;

    nekoEl.classList.add("dragging");
    nekoEl.style.cursor = "grabbing";
    setSprite("alert", 0);

    playSfx("pickup");
  }

  function onPointerMove(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    mousePosX = clientX;
    mousePosY = clientY;

    if (isDragging) {
      if (e.cancelable) e.preventDefault();

      const dist = Math.hypot(clientX - dragStartX, clientY - dragStartY);
      if (dist > 5) {
        hasDragged = true;
      }

      nekoPosX = Math.min(Math.max(16, clientX - dragOffsetX), window.innerWidth - 16);
      nekoPosY = Math.min(Math.max(16, clientY - dragOffsetY), window.innerHeight - 16);

      nekoEl.style.left = `${nekoPosX - 16}px`;
      nekoEl.style.top = `${nekoPosY - 16}px`;

      // Wiggle dangling paws while being dragged
      const dragFrames = [
        [-1, 0],
        [-1, -2],
        [-3, 0],
        [-4, -2],
      ];
      const frameIdx = Math.floor(Date.now() / 120) % dragFrames.length;
      const sprite = dragFrames[frameIdx];
      nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;

      if (activeBalloon) {
        activeBalloon.style.left = `${nekoPosX}px`;
        activeBalloon.style.top = `${nekoPosY - 20}px`;
      }
    }
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    nekoEl.classList.remove("dragging");
    nekoEl.style.cursor = "grab";

    if (hasDragged) {
      // Placed at new location: stop and sleep right here
      isStopped = true;
      idleAnimation = "sleeping";
      idleAnimationFrame = 0;
      setSprite("sleeping", 0);
      showBalloon("Zzz... (Placed)");
      playSfx("drop");
    } else {
      // Clicked without dragging: toggle stop/sleep vs wake/chase
      toggleStop();
    }
  }

  function toggleStop() {
    isStopped = !isStopped;
    if (isStopped) {
      idleAnimation = "sleeping";
      idleAnimationFrame = 0;
      setSprite("sleeping", 0);
      showBalloon("Zzz... (Sleeping)");
      playSfx("sleep");
    } else {
      idleAnimation = null;
      idleTime = 0;
      setSprite("alert", 0);
      showBalloon("Meow! (Following)");
      playSfx("wake");
    }
  }

  /* ── Animation Loop ───────────────────────────────────────── */
  let lastFrameTimestamp;

  function onAnimationFrame(timestamp) {
    if (!nekoEl.isConnected) return;

    if (document.hidden) {
      window.requestAnimationFrame(onAnimationFrame);
      return;
    }

    if (!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
    }

    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp;
      frame();
    }

    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    // Random idle behaviours every ~15 seconds
    if (idleTime > 10 && Math.floor(Math.random() * 200) === 0 && idleAnimation == null) {
      let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
      if (nekoPosX < 32) avalibleIdleAnimations.push("scratchWallW");
      if (nekoPosY < 32) avalibleIdleAnimations.push("scratchWallN");
      if (nekoPosX > window.innerWidth - 32) avalibleIdleAnimations.push("scratchWallE");
      if (nekoPosY > window.innerHeight - 32) avalibleIdleAnimations.push("scratchWallS");
      idleAnimation =
        avalibleIdleAnimations[Math.floor(Math.random() * avalibleIdleAnimations.length)];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function frame() {
    // If currently being dragged, dragging routine controls position & sprite
    if (isDragging) return;

    // If user clicked or dragged to place the cat, keep it sleeping where placed
    if (isStopped) {
      idleAnimationFrame += 1;
      setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
      nekoEl.style.left = `${nekoPosX - 16}px`;
      nekoEl.style.top = `${nekoPosY - 16}px`;
      return;
    }

    frameCount += 1;
    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.hypot(diffX, diffY);

    if (distance < nekoSpeed || distance < 48) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    let direction = "";
    direction += diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    if (direction === "") direction = "idle";

    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;

    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
  }

  // Initialize once DOM is ready or immediately
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
