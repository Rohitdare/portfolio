'use client';

import { SECTIONS, SectionId } from '@/types/portfolio';
import { useTheme } from '@/hooks/useTheme';

interface NavPillBarProps {
  activeSection: SectionId;
  onNavigate: (id: string) => void;
}

export default function NavPillBar({ activeSection, onNavigate }: NavPillBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="nav-pill-bar" aria-label="Trainer Navigation">
      {SECTIONS.map((sec) => (
        <a
          key={sec}
          className={`nav-link ${activeSection === sec ? 'active' : ''}`}
          data-path={sec}
          href={`#${sec}`}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(sec);
          }}
          aria-current={activeSection === sec ? 'page' : undefined}
        >
          {sec.charAt(0).toUpperCase() + sec.slice(1)}
        </a>
      ))}
      <div className="nav-divider" />
      <button
        id="theme-toggle"
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-label="Toggle Dark / Light Mode"
        type="button"
      >
        <span id="theme-icon" className="material-symbols-outlined" style={{ fontSize: '18px' }}>
          {theme === 'light' ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
    </nav>
  );
}
