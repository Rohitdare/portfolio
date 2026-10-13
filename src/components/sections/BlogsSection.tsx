'use client';

interface SectionProps {
  isActive: boolean;
}

export default function BlogsSection({ isActive }: SectionProps) {
  return (
    <section id="section-blogs" className={`card-section ${isActive ? 'active' : ''}`}>
      <div className="section-headline-group">
        <div className="section-eyebrow">
          <span>05 / BLOGS</span>
          <span className="eyebrow-line" />
          <span>ARCHIVES &amp; FIELD NOTES</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem' }}>
          <h2 className="section-title">Writing</h2>
          <span className="section-subtitle">ESSAYS &amp; DECONSTRUCTIONS</span>
        </div>
      </div>

      <div className="blogs-list">
        {/* BLOG 01 */}
        <article className="blog-item">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="blog-meta-pills">
              <span className="blog-badge-featured">★ LATEST LOG</span>
              <span className="blog-date">05 OCT 2026</span>
              <span className="blog-read-time">6 MIN READ</span>
            </div>
            <h3 className="blog-title">How I got my first high-ticket engineering client</h3>
            <p className="blog-snippet">
              If you&apos;re an independent builder, here is the honest, zero-fluff playbook on cold pipelines, niche
              positioning, and pricing confidence.
            </p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <span className="project-tag-pill">#ClientAcquisition</span>
              <span className="project-tag-pill">#FreelanceArchitecture</span>
            </div>
          </div>
          <div className="read-log-action">
            <span>Read Log</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              arrow_forward
            </span>
          </div>
        </article>

        {/* BLOG 02 */}
        <article className="blog-item">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="blog-meta-pills">
              <span className="blog-date">18 SEP 2026</span>
              <span className="blog-read-time">8 MIN READ</span>
            </div>
            <h3 className="blog-title">Building Tactile 3D Interfaces with Pure Vanilla CSS &amp; WebGL</h3>
            <p className="blog-snippet">
              Why physics-inspired metaphors and tactile micro-interactions create an emotional bond that flat,
              generic SaaS templates will never achieve.
            </p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <span className="project-tag-pill">#DesignSystems</span>
              <span className="project-tag-pill">#CreativeWeb</span>
            </div>
          </div>
          <div className="read-log-action">
            <span>Read Log</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              arrow_forward
            </span>
          </div>
        </article>

        {/* BLOG 03 */}
        <article className="blog-item">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="blog-meta-pills">
              <span className="blog-date">28 AUG 2026</span>
              <span className="blog-read-time">12 MIN READ</span>
            </div>
            <h3 className="blog-title">Multi-Agent Architectures: When To Fan-Out and When To Chain</h3>
            <p className="blog-snippet">
              A deep-dive into orchestrating autonomous LLM swarms without runaway tokens or hallucinated
              dependencies.
            </p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <span className="project-tag-pill">#AIEngineering</span>
              <span className="project-tag-pill">#AutonomousAgents</span>
            </div>
          </div>
          <div className="read-log-action">
            <span>Read Log</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              arrow_forward
            </span>
          </div>
        </article>
      </div>

      <div className="card-actions-row">
        <span className="section-subtitle">ARCHIVE ENTRIES 01 - 03</span>
        <a className="primary-cta-btn" href="#contact">
          <span>Transmit Direct Message</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>
    </section>
  );
}
