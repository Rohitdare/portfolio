'use client';

import { useEffect, useState } from 'react';
import { SectionId, SECTIONS } from '@/types/portfolio';
import { playBeep } from '@/lib/audio';

interface ScrollNavArrowProps {
  activeSection: SectionId;
  onNavigate: (id: string) => void;
}

export default function ScrollNavArrow({ activeSection, onNavigate }: ScrollNavArrowProps) {
  const [isPointingUp, setIsPointingUp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom = window.scrollY > window.innerHeight * 0.4 || document.body.classList.contains('battle-mode');
      setIsPointingUp(isAtBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const handleClick = () => {
    playBeep(520, 0.05, 'triangle');
    const isAtBottom = window.scrollY > window.innerHeight * 0.4 || document.body.classList.contains('battle-mode');

    if (isAtBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onNavigate('home');
    } else {
      const currentIdx = SECTIONS.indexOf(activeSection);
      if (currentIdx < SECTIONS.length - 1) {
        onNavigate(SECTIONS[currentIdx + 1]);
      } else {
        const finalBattle = document.getElementById('final-battle');
        if (finalBattle) {
          finalBattle.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
      }
    }
  };

  const currentIdx = SECTIONS.indexOf(activeSection);
  const nextName = currentIdx < SECTIONS.length - 1 ? SECTIONS[currentIdx + 1] : 'final battle';
  const label = isPointingUp ? 'Scroll back to top (Home)' : `Navigate to next section (${nextName})`;

  return (
    <button
      id="scroll-nav-arrow"
      className={`scroll-nav-arrow ${isPointingUp ? 'pointing-up' : ''}`}
      aria-label={label}
      onClick={handleClick}
      type="button"
    >
      <svg
        className="scroll-arrow-icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    </button>
  );
}
