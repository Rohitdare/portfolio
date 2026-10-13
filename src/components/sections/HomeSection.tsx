'use client';

import HeatmapGrid from '@/components/ui/HeatmapGrid';

interface SectionProps {
  isActive: boolean;
}

export default function HomeSection({ isActive }: SectionProps) {
  return (
    <section id="section-home" className={`card-section ${isActive ? 'active' : ''}`}>
      {/* Avatar & Profile Intro */}
      <div className="home-profile-row">
        <div className="avatar-frame-wrapper">
          <div className="avatar-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/avatar.png" alt="Rohit Portrait" className="avatar-image" />
          </div>
        </div>

        <div className="bio-lockup">
          <div className="name-level-header">
            <h1 className="hero-name">ROHIT</h1>
          </div>
          <h2 className="hero-role">Software Developer</h2>
          <div className="trainer-accent-bar" />
          <p className="hero-bio-p">
            I&apos;m a developer interested in building interactive websites and applications. I enjoy modern web
            technologies, clean user interfaces, and experimenting with animations and creative digital
            experiences.
          </p>

          {/* Monochips */}
          <div className="meta-chips-row">
            <div className="meta-chip">
              <span className="material-symbols-outlined" style={{ color: 'var(--vermilion)' }}>
                location_on
              </span>
              <span>PUNE , IN</span>
            </div>
            <div className="meta-chip">
              <span className="material-symbols-outlined" style={{ color: 'var(--trainer-gold)' }}>
                bolt
              </span>
              <span>5+ YRS EXP</span>
            </div>
            <div className="meta-chip">
              <span className="material-symbols-outlined" style={{ color: '#00504A' }}>
                terminal
              </span>
              <span>FULL-STACK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Callout Block */}
      <div className="quote-card">
        <span className="quote-mark">“</span>
        <div className="quote-text-container">
          <p className="quote-content">If we don&apos;t fight, we can&apos;t win.</p>
          <span className="quote-author">— Eren Yeager</span>
        </div>
        <span
          className="kanji-watermark"
          aria-label="戦え (Tatakae) — 'Fight!' // Eren Yeager (Attack on Titan)"
          role="img"
        >
          戦え
        </span>
      </div>

      {/* GitHub Contribution Matrix */}
      <HeatmapGrid />

      {/* Quicklinks & Actions */}
      <div className="card-actions-row">
        <div className="social-quicklinks">
          <a className="social-link" href="https://github.com/Rohitdare" target="_blank" rel="noopener noreferrer">
            <span>github.com/Rohitdare</span>
            <span className="material-symbols-outlined">arrow_outward</span>
          </a>
          <a className="social-link" href="https://x.com/rohit_dev" target="_blank" rel="noopener noreferrer">
            <span>x.com/rohit_dev</span>
            <span className="material-symbols-outlined">arrow_outward</span>
          </a>
        </div>
        <a className="primary-cta-btn" href="#stack">
          <span>Inspect Battle Stack</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>
    </section>
  );
}
