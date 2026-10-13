'use client';

interface SectionProps {
  isActive: boolean;
}

export default function ProjectsSection({ isActive }: SectionProps) {
  return (
    <section id="section-projects" className={`card-section ${isActive ? 'active' : ''}`}>
      <div className="section-headline-group">
        <div className="section-eyebrow">
          <span>02 / PROJECTS</span>
          <span className="eyebrow-line" />
          <span>SHIPPED ARTIFACTS</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem' }}>
          <h2 className="section-title">Things I&apos;ve shipped</h2>
          <span className="section-subtitle">4 LIVE PRODUCTION BUILDS</span>
        </div>
      </div>

      <div className="projects-grid">
        {/* PROJECT 01: Bmarked */}
        <article className="project-card">
          <div>
            <div className="project-preview">
              <div className="preview-top-bar">
                <span className="preview-pill">TOOL // BOOKMARKS</span>
                <div className="preview-dots">
                  <span className="preview-dot" />
                  <span className="preview-dot" />
                  <span className="preview-dot" />
                </div>
              </div>
              <div className="preview-inner-mock">
                <div className="mock-search-bar">
                  <span>/bookmarks/system-design</span>
                  <span>124 items</span>
                </div>
                <div className="mock-tags-row">
                  <div className="mock-tag-item">
                    <span style={{ color: 'var(--trainer-gold)' }}>●</span> Tailwind Docs
                  </div>
                  <div className="mock-tag-item">
                    <span style={{ color: 'var(--vermilion)' }}>●</span> RFC 9110 HTTP
                  </div>
                  <div className="mock-tag-item">
                    <span style={{ color: '#6FD8CC' }}>●</span> Rust Micro
                  </div>
                </div>
              </div>
              <div className="preview-footer-telemetry">
                <span>INDEXED: 1,840 REPOS</span>
                <span style={{ color: '#6FD8CC' }}>SYNC: ACTIVE</span>
              </div>
            </div>

            <div className="project-info-header">
              <h3 className="project-title">Bmarked</h3>
              <div className="project-live-indicator">
                <span className="status-dot" />
                <span>Live</span>
              </div>
            </div>
            <p className="project-category">Management Tool</p>
            <p className="project-description">
              A simple bookmark management tool that keeps all your favorite links organized in one place with
              instant fuzzy search.
            </p>
          </div>
          <div className="project-tags-row">
            <span className="project-tag-pill">Next.js</span>
            <span className="project-tag-pill">TypeScript</span>
            <span className="project-tag-pill">Tailwind CSS</span>
            <span className="project-tag-pill">Node.js</span>
          </div>
        </article>

        {/* PROJECT 02: Task Tracker */}
        <article className="project-card">
          <div>
            <div className="project-preview">
              <div className="preview-top-bar">
                <span className="preview-pill">PRODUCTIVITY // SPRINT</span>
                <div className="preview-dots">
                  <span className="preview-dot" />
                  <span className="preview-dot" />
                  <span className="preview-dot" />
                </div>
              </div>
              <div className="preview-inner-mock">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#A0A0A8' }}>
                  <span>SPRINT VELOCITY: 94%</span>
                  <span style={{ color: 'var(--status-live)' }}>ON TRACK</span>
                </div>
                <div style={{ display: 'flex', gap: '3px', height: '16px', alignItems: 'flex-end', padding: '2px 0' }}>
                  <span style={{ width: '14%', height: '60%', background: '#4A494B', borderRadius: '2px' }} />
                  <span style={{ width: '14%', height: '90%', background: 'var(--vermilion)', borderRadius: '2px' }} />
                  <span style={{ width: '14%', height: '75%', background: 'var(--trainer-gold)', borderRadius: '2px' }} />
                  <span style={{ width: '14%', height: '100%', background: 'var(--status-live)', borderRadius: '2px' }} />
                  <span style={{ width: '14%', height: '50%', background: '#4A494B', borderRadius: '2px' }} />
                  <span style={{ width: '14%', height: '85%', background: 'var(--vermilion)', borderRadius: '2px' }} />
                  <span style={{ width: '14%', height: '95%', background: '#6FD8CC', borderRadius: '2px' }} />
                </div>
              </div>
              <div className="preview-footer-telemetry">
                <span>STREAK: 42 DAYS</span>
                <span style={{ color: 'var(--trainer-gold)' }}>RANK: S-TIER</span>
              </div>
            </div>

            <div className="project-info-header">
              <h3 className="project-title">Task Tracker</h3>
              <div className="project-live-indicator">
                <span className="status-dot" />
                <span>Live</span>
              </div>
            </div>
            <p className="project-category">Productivity App</p>
            <p className="project-description">
              Focus and habit progression engine built for developers, tracking sprint momentum and deep work
              metrics.
            </p>
          </div>
          <div className="project-tags-row">
            <span className="project-tag-pill">React</span>
            <span className="project-tag-pill">JavaScript</span>
            <span className="project-tag-pill">Tailwind CSS</span>
          </div>
        </article>

        {/* PROJECT 03: Softtech Solution */}
        <article className="project-card">
          <div>
            <div className="project-preview">
              <div className="preview-top-bar">
                <span className="preview-pill">ENTERPRISE // ARCHITECTURE</span>
                <div className="preview-dots">
                  <span className="preview-dot" />
                  <span className="preview-dot" />
                  <span className="preview-dot" />
                </div>
              </div>
              <div className="preview-inner-mock">
                <div style={{ background: '#1C1B1C', borderRadius: '4px', padding: '6px', display: 'flex', justifyContent: 'space-around', fontFamily: 'var(--font-mono)', fontSize: '9px' }}>
                  <div>
                    <span style={{ color: '#6B655B' }}>LATENCY:</span> <span style={{ color: 'var(--status-live)' }}>42ms</span>
                  </div>
                  <div>
                    <span style={{ color: '#6B655B' }}>LTV:</span> <span style={{ color: 'var(--trainer-gold)' }}>4.8x</span>
                  </div>
                  <div>
                    <span style={{ color: '#6B655B' }}>UPTIME:</span> <span style={{ color: '#FFF' }}>99.98%</span>
                  </div>
                </div>
              </div>
              <div className="preview-footer-telemetry">
                <span>AUDIT: SOC2 TYPE II</span>
                <span style={{ color: 'var(--status-live)' }}>VERIFIED</span>
              </div>
            </div>

            <div className="project-info-header">
              <h3 className="project-title">Softtech Solution</h3>
              <div className="project-live-indicator">
                <span className="status-dot" />
                <span>Live</span>
              </div>
            </div>
            <p className="project-category">Client Platform Redesign</p>
            <p className="project-description">
              Architected high-throughput customer portals with sub-50ms render latency and modern design tokens.
            </p>
          </div>
          <div className="project-tags-row">
            <span className="project-tag-pill">React</span>
            <span className="project-tag-pill">Tailwind CSS</span>
            <span className="project-tag-pill">Vite</span>
          </div>
        </article>

        {/* PROJECT 04: Shikai */}
        <article className="project-card">
          <div>
            <div className="project-preview">
              <div className="preview-top-bar">
                <span className="preview-pill">EXTENSION // CHROME</span>
                <div className="preview-dots">
                  <span className="preview-dot" />
                  <span className="preview-dot" />
                  <span className="preview-dot" />
                </div>
              </div>
              <div className="preview-inner-mock">
                <div style={{ background: '#151517', padding: '5px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--vermilion)' }}>⚔ SHIKAI ACTIVE</span>
                  <span style={{ color: '#FFF' }}>14 HUD SHORTCUTS</span>
                </div>
              </div>
              <div className="preview-footer-telemetry">
                <span>MANIFEST V3</span>
                <span style={{ color: 'var(--status-live)' }}>STORE APPROVED</span>
              </div>
            </div>

            <div className="project-info-header">
              <h3 className="project-title">Shikai</h3>
              <div className="project-live-indicator">
                <span className="status-dot" />
                <span>Live</span>
              </div>
            </div>
            <p className="project-category">Browser Extension</p>
            <p className="project-description">
              Developer utility companion providing keyboard-driven inspection, quick code sandboxing, and
              clipboard sync.
            </p>
          </div>
          <div className="project-tags-row">
            <span className="project-tag-pill">JavaScript</span>
            <span className="project-tag-pill">WebExtensions</span>
            <span className="project-tag-pill">Tailwind</span>
          </div>
        </article>
      </div>

      <div className="card-actions-row">
        <span className="section-subtitle">MORE REPOSITORIES ON GITHUB</span>
        <a className="primary-cta-btn" href="#experience">
          <span>View Career Timeline</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>
    </section>
  );
}
