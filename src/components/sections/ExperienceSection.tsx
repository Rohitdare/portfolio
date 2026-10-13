'use client';

interface SectionProps {
  isActive: boolean;
}

export default function ExperienceSection({ isActive }: SectionProps) {
  return (
    <section id="section-experience" className={`card-section ${isActive ? 'active' : ''}`}>
      <div className="section-headline-group">
        <div className="section-eyebrow">
          <span>03 / EXPERIENCE</span>
          <span className="eyebrow-line" />
          <span>CAREER &amp; MILESTONES</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem' }}>
          <h2 className="section-title">Where I&apos;ve been building</h2>
          <span className="section-subtitle">LVL 48 // SENIOR CAPABILITIES</span>
        </div>
      </div>

      <div className="experience-container">
        {/* Top Entry / Active Focus */}
        <div className="experience-hero-panel">
          <div className="ai-bg-watermark">AI</div>
          <div className="exp-hero-header">
            <div className="exp-role-title">
              <span className="material-symbols-outlined" style={{ color: 'var(--vermilion)', fontSize: '20px' }}>
                stars
              </span>
              <span>AI Engineer &amp; Full-Stack Developer · Independent Builder</span>
            </div>
            <div className="exp-badge-date">
              <span className="status-dot" style={{ backgroundColor: 'var(--vermilion)' }} />
              <span>2026 – Present</span>
            </div>
          </div>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--card-text)', position: 'relative', zIndex: 2 }}>
            A continuous journey of mastering modern web architecture and generative AI, moving from foundational
            full-stack development to architecting intelligent, scalable multi-agent systems and tactile user
            interfaces.
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '6px',
              paddingTop: '6px',
              borderTop: '1px solid var(--card-border-subtle)',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--card-text-muted)', textTransform: 'uppercase' }}>
              Focus Areas:
            </span>
            <span className="project-tag-pill">Autonomous Agents</span>
            <span className="project-tag-pill">Event-Driven Microservices</span>
            <span className="project-tag-pill">Tactile Design Systems</span>
            <span className="project-tag-pill">Vector Retrieval (RAG)</span>
          </div>
        </div>

        {/* Timeline Track */}
        <div className="timeline-track">
          <div className="timeline-line" />

          {/* Milestone 01 */}
          <div className="timeline-item">
            <div className="timeline-node">
              <div className="timeline-pip" />
            </div>
            <div className="timeline-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="timeline-phase">PHASE 02</span>
                <h3 className="timeline-title">Interactive Systems &amp; Autonomous Workflows</h3>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--card-text-muted)' }}>
                2025
              </span>
            </div>
            <p className="timeline-desc">
              Engineered production Next.js &amp; TypeScript applications integrating LLM tool-calling, vector
              search with embeddings, and tactile GSAP/Framer animations for enterprise clients.
            </p>
            <div className="project-tags-row">
              <span className="project-tag-pill">Next.js 15</span>
              <span className="project-tag-pill">TypeScript</span>
              <span className="project-tag-pill">PostgreSQL</span>
              <span className="project-tag-pill">Vector DBs</span>
            </div>
          </div>

          {/* Easter Egg Pixel Cat */}
          <div className="pixel-cat-easter-egg" aria-label="Companion sprite: leveling up in the background" role="img">
            <div className="pixel-cat-badge">
              <svg fill="currentColor" height="18" viewBox="0 0 24 24" width="18">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5s.5.22.5.5v1zm0-3c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-4c0-.28.22-.5.5-.5s.5.22.5.5v4zm3.5 1.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-8 0c-.83 0-1.5-.67-1.5-1.5S7.67 12 8.5 12s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--card-text-muted)' }}>
              COMPANION SPRITE // LVL UP ACTIVE
            </span>
          </div>

          {/* Milestone 02 */}
          <div className="timeline-item">
            <div className="timeline-node">
              <div className="timeline-pip" style={{ backgroundColor: 'var(--trainer-gold)' }} />
            </div>
            <div className="timeline-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="timeline-phase" style={{ color: 'var(--trainer-gold)' }}>
                  PHASE 01
                </span>
                <h3 className="timeline-title">The Foundation (Locking In)</h3>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--card-text-muted)' }}>
                Q1 2024
              </span>
            </div>
            <p className="timeline-desc">
              Intensive lock-in on Node.js, Express, PostgreSQL, React, and Tailwind CSS to establish
              battle-tested full-stack fundamentals and ship production web tools.
            </p>
            <div className="project-tags-row">
              <span className="project-tag-pill">Node.js</span>
              <span className="project-tag-pill">Express</span>
              <span className="project-tag-pill">React</span>
              <span className="project-tag-pill">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-actions-row">
        <span className="section-subtitle">CHRONOLOGICAL LOG COMPLETE</span>
        <a className="primary-cta-btn" href="#blogs">
          <span>Read Field Notes</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>
    </section>
  );
}
