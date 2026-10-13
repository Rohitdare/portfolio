'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/navigation/Header';
import TelemetryHUD from '@/components/navigation/TelemetryHUD';
import ScrollNavArrow from '@/components/navigation/ScrollNavArrow';
import KatanaArtwork from '@/components/background/KatanaArtwork';
import TrainerCardWrapper from '@/components/trainer-card/TrainerCardWrapper';
import FinalBattle from '@/components/battle-mode/FinalBattle';
import ToastNotice from '@/components/ui/ToastNotice';
import { useSectionRouter } from '@/hooks/useSectionRouter';

export default function HomePage() {
  const { activeSection, telemetryNumber, progressPercent, navigateToSection } = useSectionRouter();
  const [toastMessage, setToastMessage] = useState('TRANSMISSION RECEIVED');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3500);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 40;
      document.body.classList.toggle('scrolled-past-hero', isScrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Ambient Glow */}
      <div className="ambient-glow" aria-hidden="true" />

      {/* FIXED HEADER / NAVIGATION */}
      <Header activeSection={activeSection} onNavigate={navigateToSection} />

      {/* FIXED TELEMETRY HUD (Bottom-Right) */}
      <TelemetryHUD telemetryNumber={telemetryNumber} progressPercent={progressPercent} />

      {/* MAIN 3D STAGE & SUSPENDED TRAINER ID BADGE */}
      <main className="main-stage">
        {/* LEVEL 1: DEDICATED GIF ARTWORK LAYER (Anchored to Hero Stage) */}
        <KatanaArtwork />

        {/* 3D TRAINER CARD & LANYARD MECHANISM */}
        <TrainerCardWrapper activeSection={activeSection} onShowToast={showToast} />
      </main>

      {/* FINAL BATTLE SECTION (Anime Climax / End Screen) */}
      <FinalBattle onNavigateToContact={() => navigateToSection('contact')} />

      {/* MINIMAL BOTTOM-LEFT SCROLL NAVIGATION ARROW */}
      <ScrollNavArrow activeSection={activeSection} onNavigate={navigateToSection} />

      {/* Toast Notice */}
      <ToastNotice message={toastMessage} visible={toastVisible} />
    </>
  );
}
