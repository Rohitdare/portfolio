'use client';

import { useState, useEffect, useCallback } from 'react';
import { SectionId, SECTIONS } from '@/types/portfolio';
import { playBeep } from '@/lib/audio';

export function useSectionRouter() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  const navigateToSection = useCallback((targetId: string, playSound = true) => {
    const cleanId = (targetId || 'home').replace('#', '').toLowerCase() as SectionId;
    const index = SECTIONS.indexOf(cleanId);
    if (index === -1) return;

    setActiveSection(cleanId);

    if (playSound) {
      playBeep(440 + index * 80, 0.05, 'triangle');
    }

    // Reset internal section container scroll
    const container = document.querySelector('.card-section-container');
    if (container) {
      container.scrollTop = 0;
    }

    // Scroll window back up to card stage if scrolled down
    if (window.scrollY > 100) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || '#home';
      navigateToSection(hash, false);
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);

    // Global listener for internal CTA anchors with href="#..."
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a[href^="#"]');
      if (target) {
        const href = target.getAttribute('href');
        if (href && href.length > 1 && !href.startsWith('#final-battle')) {
          e.preventDefault();
          const id = href.replace('#', '');
          window.location.hash = id;
          navigateToSection(id, true);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [navigateToSection]);

  const currentIndex = SECTIONS.indexOf(activeSection);
  const telemetryNumber = String(currentIndex + 1).padStart(2, '0');
  const progressPercent = ((currentIndex + 1) / SECTIONS.length) * 100;

  return {
    activeSection,
    currentIndex,
    telemetryNumber,
    progressPercent,
    navigateToSection: (id: string) => {
      window.location.hash = id;
      navigateToSection(id, true);
    },
  };
}
