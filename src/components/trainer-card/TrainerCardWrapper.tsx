'use client';

import { useCardTilt } from '@/hooks/useCardTilt';
import LanyardAssembly from './LanyardAssembly';
import CardMetaHeader from './CardMetaHeader';
import HomeSection from '@/components/sections/HomeSection';
import StackSection from '@/components/sections/StackSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import BlogsSection from '@/components/sections/BlogsSection';
import ContactSection from '@/components/sections/ContactSection';
import { SectionId } from '@/types/portfolio';

interface TrainerCardWrapperProps {
  activeSection: SectionId;
  onShowToast: (msg: string) => void;
}

export default function TrainerCardWrapper({ activeSection, onShowToast }: TrainerCardWrapperProps) {
  const { cardWrapperRef, trainerCardRef, lanyardRef } = useCardTilt();

  return (
    <>
      {/* SUSPENDED LANYARD MECHANISM */}
      <LanyardAssembly ref={lanyardRef} />

      {/* 3D CARD CONTAINER */}
      <div id="card-3d-wrapper" ref={cardWrapperRef} className="card-3d-wrapper resting badge-entering">
        <article id="trainer-card" ref={trainerCardRef} className="trainer-card">
          {/* Paper Texture Grain */}
          <div className="card-paper-texture" />
          {/* Dynamic Holographic Specular Sheen Layer */}
          <div className="card-specular-sheen" />

          {/* Punch Slot & Meta Header */}
          <CardMetaHeader />

          {/* CARD SECTIONS CONTAINER */}
          <div className="card-section-container">
            <HomeSection isActive={activeSection === 'home'} />
            <StackSection isActive={activeSection === 'stack'} />
            <ProjectsSection isActive={activeSection === 'projects'} />
            <ExperienceSection isActive={activeSection === 'experience'} />
            <BlogsSection isActive={activeSection === 'blogs'} />
            <ContactSection isActive={activeSection === 'contact'} onShowToast={onShowToast} />
          </div>
        </article>
      </div>
    </>
  );
}
