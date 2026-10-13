'use client';

import { useEffect, useRef } from 'react';
import { playBeep } from '@/lib/audio';

interface FinalBattleProps {
  onNavigateToContact: () => void;
}

export default function FinalBattle({ onNavigateToContact }: FinalBattleProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.classList.add('in-view');
              document.body.classList.add('battle-mode');
            } else {
              if (entry.boundingClientRect.top > window.innerHeight * 0.3) {
                document.body.classList.remove('battle-mode');
              }
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -40px 0px',
        }
      );
      observer.observe(el);

      return () => {
        observer.disconnect();
        document.body.classList.remove('battle-mode');
      };
    } else {
      el.classList.add('in-view');
    }
  }, []);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playBeep(640, 0.08, 'triangle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigateToContact();
  };

  return (
    <section id="final-battle" ref={sectionRef} className="final-battle-section" aria-label="Final Battle Climax Screen">
      {/* Atmospheric Ambient Glow behind fight scene */}
      <div className="battle-atmospheric-glow" aria-hidden="true" />

      {/* Floating Embers / Sparks */}
      <div className="battle-sparks-container" aria-hidden="true">
        <span className="battle-spark s1" />
        <span className="battle-spark s2" />
        <span className="battle-spark s3" />
        <span className="battle-spark s4" />
        <span className="battle-spark s5" />
        <span className="battle-spark s6" />
      </div>

      {/* Inner Cinematic Framing */}
      <div className="battle-stage-frame">
        {/* Center Hero Sprite Visual */}
        <div className="battle-sprite-wrapper">
          <div className="battle-sprite-aura" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/naruto.gif"
            alt="Naruto vs Sasuke Anime Final Battle Scene"
            className="battle-sprite-img"
            loading="lazy"
          />
          <div className="battle-ground-shadow" aria-hidden="true" />
        </div>

        {/* Narrative Tagline & Action CTAs */}
        <div className="battle-content-block">
          <p className="battle-subtext">Still building. Still learning. Still shipping.</p>

          {/* Action CTAs */}
          <div className="battle-cta-row">
            <a
              href="https://github.com/Rohitdare"
              target="_blank"
              rel="noopener noreferrer"
              className="battle-btn battle-btn-primary"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                code
              </span>
              <span>View GitHub</span>
            </a>
            <a
              href="#contact"
              id="battle-contact-btn"
              className="battle-btn battle-btn-secondary"
              onClick={handleContactClick}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                send
              </span>
              <span>Contact Me</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
