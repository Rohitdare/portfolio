'use client';

import TimeBeacon from './TimeBeacon';
import NavPillBar from './NavPillBar';
import { SectionId } from '@/types/portfolio';

interface HeaderProps {
  activeSection: SectionId;
  onNavigate: (id: string) => void;
}

export default function Header({ activeSection, onNavigate }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-left">
        <TimeBeacon />
      </div>
      <div className="header-center">
        <NavPillBar activeSection={activeSection} onNavigate={onNavigate} />
      </div>
      <div className="header-right" />
    </header>
  );
}
