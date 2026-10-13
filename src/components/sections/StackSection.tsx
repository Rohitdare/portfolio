'use client';

interface SectionProps {
  isActive: boolean;
}

export default function StackSection({ isActive }: SectionProps) {
  return (
    <section id="section-stack" className={`card-section ${isActive ? 'active' : ''}`}>
      <div className="section-headline-group">
        <div className="section-eyebrow">
          <span>01 / STACK</span>
          <span className="eyebrow-line" />
          <span>ARMORY &amp; RUNTIMES</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem' }}>
          <h2 className="section-title">Tools I build with</h2>
          <span className="section-subtitle">REV 2025.4 // VERIFIED STACK</span>
        </div>
      </div>

      {/* Stack Rows */}
      <div className="stack-table">
        {/* 01 Language */}
        <div className="stack-row">
          <div className="stack-row-left">
            <span className="stack-index-num">01</span>
            <div>
              <h3 className="stack-category-name">Language</h3>
              <p className="stack-category-sub">Core Compilers</p>
            </div>
          </div>
          <div className="stack-row-chips">
            <div className="tech-chip">
              <span className="chip-badge" style={{ background: 'rgba(49, 120, 198, 0.2)', color: '#3178C6' }}>
                TS
              </span>{' '}
              TypeScript
            </div>
            <div className="tech-chip">
              <span className="chip-badge" style={{ background: 'rgba(247, 223, 30, 0.25)', color: '#A08500' }}>
                JS
              </span>{' '}
              JavaScript
            </div>
            <div className="tech-chip">
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#3776AB' }}>
                terminal
              </span>{' '}
              Python
            </div>
          </div>
        </div>

        {/* 02 Frontend */}
        <div className="stack-row">
          <div className="stack-row-left">
            <span className="stack-index-num">02</span>
            <div>
              <h3 className="stack-category-name">Frontend</h3>
              <p className="stack-category-sub">Interface &amp; Graphics</p>
            </div>
          </div>
          <div className="stack-row-chips">
            <div className="tech-chip">
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#087EA4' }}>
                flutter
              </span>{' '}
              React
            </div>
            <div className="tech-chip">
              <span className="chip-badge" style={{ background: '#000', color: '#FFF' }}>
                N
              </span>{' '}
              Next.js
            </div>
            <div className="tech-chip">
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#06B6D4' }}>
                css
              </span>{' '}
              Tailwind CSS
            </div>
            <div className="tech-chip">shadcn/ui</div>
            <div className="tech-chip">Radix UI</div>
            <div className="tech-chip">
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: 'var(--vermilion)' }}>
                animation
              </span>{' '}
              Motion
            </div>
            <div className="tech-chip">Expo</div>
            <div className="tech-chip">TanStack</div>
          </div>
        </div>

        {/* 03 Backend & DB */}
        <div className="stack-row">
          <div className="stack-row-left">
            <span className="stack-index-num">03</span>
            <div>
              <h3 className="stack-category-name">Backend &amp; DB</h3>
              <p className="stack-category-sub">Server &amp; Storage</p>
            </div>
          </div>
          <div className="stack-row-chips">
            <div className="tech-chip">
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#339933' }}>
                dns
              </span>{' '}
              Node.js
            </div>
            <div className="tech-chip">Bun</div>
            <div className="tech-chip">
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#4169E1' }}>
                database
              </span>{' '}
              PostgreSQL
            </div>
            <div className="tech-chip">
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#47A248' }}>
                storage
              </span>{' '}
              MongoDB
            </div>
            <div className="tech-chip">
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#DC382D' }}>
                memory
              </span>{' '}
              Redis
            </div>
            <div className="tech-chip">nginx</div>
          </div>
        </div>

        {/* 04 Workflow & AI */}
        <div className="stack-row">
          <div className="stack-row-left">
            <span className="stack-index-num">04</span>
            <div>
              <h3 className="stack-category-name">Workflow &amp; AI</h3>
              <p className="stack-category-sub">Tooling &amp; Agents</p>
            </div>
          </div>
          <div className="stack-row-chips">
            <div className="tech-chip">
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#D97706' }}>
                smart_toy
              </span>{' '}
              Claude
            </div>
            <div className="tech-chip">
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#0EA5E9' }}>
                code
              </span>{' '}
              Cursor
            </div>
            <div className="tech-chip">
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#8B5CF6' }}>
                auto_awesome
              </span>{' '}
              Gemini
            </div>
            <div className="tech-chip">
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#10A37F' }}>
                psychology
              </span>{' '}
              ChatGPT
            </div>
            <div className="tech-chip">
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#F05032' }}>
                commit
              </span>{' '}
              Git &amp; GitHub
            </div>
            <div className="tech-chip">
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#2496ED' }}>
                deployed_code
              </span>{' '}
              Docker
            </div>
            <div className="tech-chip">Vercel</div>
          </div>
        </div>

        {/* 05 Analytics */}
        <div className="stack-row">
          <div className="stack-row-left">
            <span className="stack-index-num">05</span>
            <div>
              <h3 className="stack-category-name">Analytics</h3>
              <p className="stack-category-sub">Observability</p>
            </div>
          </div>
          <div className="stack-row-chips">
            <div className="tech-chip">
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#6366F1' }}>
                analytics
              </span>{' '}
              OpenPanel
            </div>
            <div className="tech-chip">
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#F54E00' }}>
                insights
              </span>{' '}
              PostHog
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="card-actions-row">
        <span className="section-subtitle">25+ TOOLS &amp; RUNTIMES DEPLOYED</span>
        <a className="primary-cta-btn" href="#projects">
          <span>View Shipped Artifacts</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>
    </section>
  );
}
