'use client';

import { useEffect, useRef } from 'react';

const spriteSets: Record<string, [number, number][]> = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
  scratchWallN: [[0, 0], [0, -1]],
  scratchWallS: [[-7, -1], [-6, -2]],
  scratchWallE: [[-2, -2], [-2, -3]],
  scratchWallW: [[-4, 0], [-4, -1]],
  tired: [[-3, -2]],
  sleeping: [[-2, 0], [-2, -1]],
  N: [[-1, -2], [-1, -3]],
  NE: [[0, -2], [0, -3]],
  E: [[-3, 0], [-3, -1]],
  SE: [[-5, -1], [-5, -2]],
  S: [[-6, -3], [-7, -2]],
  SW: [[-5, -3], [-6, -1]],
  W: [[-4, -2], [-4, -3]],
  NW: [[-1, 0], [-1, -1]],
};

export default function OnekoCompanion() {
  const nekoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const nekoEl = nekoRef.current;
    if (!nekoEl) return;

    let nekoPosX = 64;
    let nekoPosY = 120;
    let mousePosX = nekoPosX;
    let mousePosY = nekoPosY;
    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation: string | null = null;
    let idleAnimationFrame = 0;
    let isStopped = false;
    let isDragging = false;
    let hasDragged = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let activeBalloon: HTMLDivElement | null = null;
    let balloonTimeout: NodeJS.Timeout | null = null;
    let animId: number;
    let lastFrameTimestamp = 0;
    const nekoSpeed = 10;

    // Restore persistent state
    try {
      const stored = JSON.parse(window.localStorage.getItem('oneko_state') || '');
      if (stored) {
        if (typeof stored.nekoPosX === 'number') nekoPosX = stored.nekoPosX;
        if (typeof stored.nekoPosY === 'number') nekoPosY = stored.nekoPosY;
        if (typeof stored.isStopped === 'boolean') isStopped = stored.isStopped;
      }
    } catch {
      // Ignore
    }

    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;

    function playSfx(type: 'pickup' | 'drop' | 'sleep' | 'wake') {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const windowWithCtx = window as unknown as { __onekoAudioCtx?: AudioContext };
        windowWithCtx.__onekoAudioCtx = windowWithCtx.__onekoAudioCtx || new AudioCtx();
        const ctx = windowWithCtx.__onekoAudioCtx;
        if (ctx.state === 'suspended') ctx.resume();

        const tones = {
          pickup: { f1: 440, f2: 780, dur: 0.1, type: 'sine' as OscillatorType },
          drop:   { f1: 480, f2: 290, dur: 0.18, type: 'triangle' as OscillatorType },
          sleep:  { f1: 480, f2: 290, dur: 0.18, type: 'triangle' as OscillatorType },
          wake:   { f1: 587, f2: 880, dur: 0.14, type: 'sine' as OscillatorType },
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
      } catch {
        // Audio optional
      }
    }

    function showBalloon(text: string) {
      if (activeBalloon) {
        activeBalloon.remove();
        activeBalloon = null;
      }
      if (balloonTimeout) clearTimeout(balloonTimeout);

      const balloon = document.createElement('div');
      balloon.className = 'oneko-balloon';
      balloon.textContent = text;
      balloon.style.left = `${nekoPosX}px`;
      balloon.style.top = `${nekoPosY - 20}px`;
      document.body.appendChild(balloon);
      activeBalloon = balloon;

      balloonTimeout = setTimeout(() => {
        if (activeBalloon === balloon) {
          balloon.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          balloon.style.opacity = '0';
          balloon.style.transform = 'translate(-50%, -120%) scale(0.9)';
          setTimeout(() => {
            balloon.remove();
            if (activeBalloon === balloon) activeBalloon = null;
          }, 250);
        }
      }, 1800);
    }

    function setSprite(name: string, frame: number) {
      if (!nekoEl || !spriteSets[name]) return;
      const sprite = spriteSets[name][frame % spriteSets[name].length];
      nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
    }

    function resetIdleAnimation() {
      idleAnimation = null;
      idleAnimationFrame = 0;
    }

    function idle() {
      idleTime += 1;
      if (idleTime > 10 && Math.floor(Math.random() * 200) === 0 && idleAnimation == null) {
        const avalibleIdleAnimations = ['sleeping', 'scratchSelf'];
        if (nekoPosX < 32) avalibleIdleAnimations.push('scratchWallW');
        if (nekoPosY < 32) avalibleIdleAnimations.push('scratchWallN');
        if (nekoPosX > window.innerWidth - 32) avalibleIdleAnimations.push('scratchWallE');
        if (nekoPosY > window.innerHeight - 32) avalibleIdleAnimations.push('scratchWallS');
        idleAnimation = avalibleIdleAnimations[Math.floor(Math.random() * avalibleIdleAnimations.length)];
      }

      switch (idleAnimation) {
        case 'sleeping':
          if (idleAnimationFrame < 8) {
            setSprite('tired', 0);
            break;
          }
          setSprite('sleeping', Math.floor(idleAnimationFrame / 4));
          if (idleAnimationFrame > 192) {
            resetIdleAnimation();
          }
          break;
        case 'scratchWallN':
        case 'scratchWallS':
        case 'scratchWallE':
        case 'scratchWallW':
        case 'scratchSelf':
          setSprite(idleAnimation, idleAnimationFrame);
          if (idleAnimationFrame > 9) {
            resetIdleAnimation();
          }
          break;
        default:
          setSprite('idle', 0);
          return;
      }
      idleAnimationFrame += 1;
    }

    function frame() {
      if (!nekoEl || isDragging) return;
      if (isStopped) {
        idleAnimationFrame += 1;
        setSprite('sleeping', Math.floor(idleAnimationFrame / 4));
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
        setSprite('alert', 0);
        idleTime = Math.min(idleTime, 7);
        idleTime -= 1;
        return;
      }

      let direction = '';
      direction += diffY / distance > 0.5 ? 'N' : '';
      direction += diffY / distance < -0.5 ? 'S' : '';
      direction += diffX / distance > 0.5 ? 'W' : '';
      direction += diffX / distance < -0.5 ? 'E' : '';
      if (direction === '') direction = 'idle';

      setSprite(direction, frameCount);

      nekoPosX -= (diffX / distance) * nekoSpeed;
      nekoPosY -= (diffY / distance) * nekoSpeed;
      nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
      nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

      nekoEl.style.left = `${nekoPosX - 16}px`;
      nekoEl.style.top = `${nekoPosY - 16}px`;
    }

    function onAnimationFrame(timestamp: number) {
      if (!nekoEl) return;
      if (document.hidden) {
        animId = requestAnimationFrame(onAnimationFrame);
        return;
      }

      if (!lastFrameTimestamp) lastFrameTimestamp = timestamp;

      if (timestamp - lastFrameTimestamp > 100) {
        lastFrameTimestamp = timestamp;
        frame();
      }

      animId = requestAnimationFrame(onAnimationFrame);
    }

    function toggleStop() {
      isStopped = !isStopped;
      if (isStopped) {
        idleAnimation = 'sleeping';
        idleAnimationFrame = 0;
        setSprite('sleeping', 0);
        showBalloon('Zzz... (Sleeping)');
        playSfx('sleep');
      } else {
        idleAnimation = null;
        idleTime = 0;
        setSprite('alert', 0);
        showBalloon('Meow! (Following)');
        playSfx('wake');
      }
    }

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if ('button' in e && e.button !== 0) return;
      e.preventDefault();
      isDragging = true;
      hasDragged = false;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      dragStartX = clientX;
      dragStartY = clientY;
      dragOffsetX = clientX - nekoPosX;
      dragOffsetY = clientY - nekoPosY;

      nekoEl.classList.add('dragging');
      nekoEl.style.cursor = 'grabbing';
      setSprite('alert', 0);
      playSfx('pickup');
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      mousePosX = clientX;
      mousePosY = clientY;

      if (isDragging) {
        if (e.cancelable) e.preventDefault();
        const dist = Math.hypot(clientX - dragStartX, clientY - dragStartY);
        if (dist > 5) hasDragged = true;

        nekoPosX = Math.min(Math.max(16, clientX - dragOffsetX), window.innerWidth - 16);
        nekoPosY = Math.min(Math.max(16, clientY - dragOffsetY), window.innerHeight - 16);
        nekoEl.style.left = `${nekoPosX - 16}px`;
        nekoEl.style.top = `${nekoPosY - 16}px`;

        const dragFrames = [[-1, 0], [-1, -2], [-3, 0], [-4, -2]];
        const frameIdx = Math.floor(Date.now() / 120) % dragFrames.length;
        const sprite = dragFrames[frameIdx];
        nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;

        if (activeBalloon) {
          activeBalloon.style.left = `${nekoPosX}px`;
          activeBalloon.style.top = `${nekoPosY - 20}px`;
        }
      }
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      nekoEl.classList.remove('dragging');
      nekoEl.style.cursor = 'grab';

      if (hasDragged) {
        isStopped = true;
        idleAnimation = 'sleeping';
        idleAnimationFrame = 0;
        setSprite('sleeping', 0);
        showBalloon('Zzz... (Placed)');
        playSfx('drop');
      } else {
        toggleStop();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleStop();
      }
    };

    const onBeforeUnload = () => {
      try {
        window.localStorage.setItem('oneko_state', JSON.stringify({ nekoPosX, nekoPosY, isStopped }));
      } catch {
        // Ignore
      }
    };

    if (isStopped) {
      setSprite('sleeping', 0);
    } else {
      setSprite('idle', 0);
    }

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    nekoEl.addEventListener('mousedown', onPointerDown);
    nekoEl.addEventListener('touchstart', onPointerDown, { passive: false });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);
    nekoEl.addEventListener('keydown', onKeyDown);
    window.addEventListener('beforeunload', onBeforeUnload);

    animId = requestAnimationFrame(onAnimationFrame);

    return () => {
      cancelAnimationFrame(animId);
      if (activeBalloon) activeBalloon.remove();
      if (balloonTimeout) clearTimeout(balloonTimeout);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      nekoEl.removeEventListener('mousedown', onPointerDown);
      nekoEl.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
      nekoEl.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('beforeunload', onBeforeUnload);
      onBeforeUnload();
    };
  }, []);

  return (
    <div
      id="oneko"
      ref={nekoRef}
      aria-label="Oneko desktop cat companion. Drag to place, click to sleep or wake."
      role="button"
      tabIndex={0}
      style={{
        width: '32px',
        height: '32px',
        position: 'fixed',
        pointerEvents: 'auto',
        cursor: 'grab',
        imageRendering: 'pixelated',
        zIndex: 2147483647,
        backgroundImage: 'url(/assets/oneko.gif)',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}
