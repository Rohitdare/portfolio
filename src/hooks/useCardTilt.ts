'use client';

import { useEffect, useRef } from 'react';

export function useCardTilt() {
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const trainerCardRef = useRef<HTMLElement>(null);
  const lanyardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cardWrapper = cardWrapperRef.current;
    const trainerCard = trainerCardRef.current;
    const lanyard = lanyardRef.current;
    if (!cardWrapper || !trainerCard) return;

    let isEntering = true;
    const entranceTimer = setTimeout(() => {
      isEntering = false;
      cardWrapper.classList.remove('badge-entering');
      if (lanyard) lanyard.classList.remove('badge-entering');
    }, 1350);

    const mouse = { targetX: 0, targetY: 0 };
    let isHovered = false;
    const restAngle = 1.8;
    let currentRotX = 0;
    let currentRotY = 0;
    let currentRotZ = restAngle;
    let lanyardRotZ = 0;
    let animFrameId: number;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateCardOrientation = () => {
      if (isEntering || document.hidden) {
        animFrameId = requestAnimationFrame(updateCardOrientation);
        return;
      }

      if (prefersReducedMotion.matches) {
        cardWrapper.style.transform = 'none';
        if (lanyard) lanyard.style.transform = 'none';
        animFrameId = requestAnimationFrame(updateCardOrientation);
        return;
      }

      if (window.scrollY > window.innerHeight * 1.2) {
        animFrameId = requestAnimationFrame(updateCardOrientation);
        return;
      }

      if (isHovered) {
        currentRotX += (mouse.targetX - currentRotX) * 0.1;
        currentRotY += (mouse.targetY - currentRotY) * 0.1;
        currentRotZ += (0 - currentRotZ) * 0.1;
        lanyardRotZ += ((mouse.targetY * 0.35) - lanyardRotZ) * 0.08;
      } else {
        const now = performance.now() * 0.0015;
        const naturalSway = Math.sin(now) * 0.6;
        currentRotX += (0 - currentRotX) * 0.06;
        currentRotY += (0 - currentRotY) * 0.06;
        currentRotZ += ((restAngle + naturalSway) - currentRotZ) * 0.06;
        lanyardRotZ += ((naturalSway * 0.4) - lanyardRotZ) * 0.06;
      }

      cardWrapper.style.transform = `rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) rotateZ(${currentRotZ.toFixed(2)}deg)`;
      if (lanyard) {
        lanyard.style.transform = `rotateZ(${lanyardRotZ.toFixed(2)}deg) rotateY(${(currentRotY * 0.35).toFixed(2)}deg)`;
      }

      animFrameId = requestAnimationFrame(updateCardOrientation);
    };

    animFrameId = requestAnimationFrame(updateCardOrientation);

    const onMouseMove = (e: MouseEvent) => {
      const rect = cardWrapper.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - cardCenterX;
      const dy = e.clientY - cardCenterY;
      const dist = Math.hypot(dx, dy);

      if (dist < 800) {
        isHovered = true;
        const factorX = dy / (window.innerHeight * 0.5);
        const factorY = dx / (window.innerWidth * 0.5);
        mouse.targetX = -Math.max(-10, Math.min(10, factorX * 9));
        mouse.targetY = Math.max(-12, Math.min(12, factorY * 11));

        const localX = ((e.clientX - rect.left) / rect.width) * 100;
        const localY = ((e.clientY - rect.top) / rect.height) * 100;
        trainerCard.style.setProperty('--mouse-x', `${localX.toFixed(1)}%`);
        trainerCard.style.setProperty('--mouse-y', `${localY.toFixed(1)}%`);
      } else {
        isHovered = false;
      }
    };

    const onMouseLeave = () => {
      isHovered = false;
    };

    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const tiltX = Math.max(-12, Math.min(12, (e.beta - 40) * 0.35));
        const tiltY = Math.max(-14, Math.min(14, e.gamma * 0.35));
        mouse.targetX = -tiltX;
        mouse.targetY = tiltY;
        isHovered = true;
      }
    };

    // Smart wheel forwarding
    const onWheel = (e: WheelEvent) => {
      const container = document.querySelector('.card-section-container');
      if (!container) return;

      const target = e.target as HTMLElement | null;
      const isOverCard = target?.closest('#trainer-card');
      if (isOverCard) {
        const maxScroll = container.scrollHeight - container.clientHeight;
        const canScrollDown = e.deltaY > 0 && container.scrollTop < maxScroll - 2;
        const canScrollUp = e.deltaY < 0 && container.scrollTop > 2;

        if (canScrollDown || canScrollUp) {
          container.scrollTop += e.deltaY;
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', onDeviceOrientation);
    }
    window.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      clearTimeout(entranceTimer);
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', onDeviceOrientation);
      }
      window.removeEventListener('wheel', onWheel);
    };
  }, []);

  return { cardWrapperRef, trainerCardRef, lanyardRef };
}
