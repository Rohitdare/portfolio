'use client';

import { useState } from 'react';
import { playBeep } from '@/lib/audio';

interface ContactSectionProps {
  isActive: boolean;
  onShowToast: (msg: string) => void;
}

export default function ContactSection({ isActive, onShowToast }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sender = name.trim() || 'Trainer';
    playBeep(880, 0.12, 'square');
    onShowToast(`MESSAGE TRANSMITTED // ACK_0x842 FROM ${sender.toUpperCase()}`);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <section id="section-contact" className={`card-section ${isActive ? 'active' : ''}`}>
      <div className="section-headline-group">
        <div className="section-eyebrow">
          <span>06 / CONTACT</span>
          <span className="eyebrow-line" />
          <span>DIRECT COMM-LINK</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem' }}>
          <h2 className="section-title">Let&apos;s build something unforgettable</h2>
          <span className="section-subtitle">EST RESPONSE TIME: &lt; 24 HOURS</span>
        </div>
      </div>

      <div className="contact-grid">
        {/* Form */}
        <form id="contact-form" className="contact-form-col" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="contact-name" className="form-label">
              TRAINER NAME / CALLSIGN
            </label>
            <input
              id="contact-name"
              type="text"
              className="form-input"
              placeholder="e.g. Satoshi Nakamoto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-email" className="form-label">
              TRANSMISSION FREQUENCY (EMAIL)
            </label>
            <input
              id="contact-email"
              type="email"
              className="form-input"
              placeholder="e.g. trainer@domain.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-message" className="form-label">
              BRIEFING PAYLOAD
            </label>
            <textarea
              id="contact-message"
              rows={4}
              className="form-textarea"
              placeholder="Tell me about your project, timeline, and vision..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="primary-cta-btn" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
            <span className="material-symbols-outlined">send</span>
            <span>Transmit Transmission</span>
          </button>
        </form>

        {/* Coordinates Info */}
        <div className="contact-info-col">
          <div className="contact-meta-row">
            <span className="contact-meta-title">COORDINATES</span>
            <span className="contact-meta-val">Pune, Maharashtra, India</span>
          </div>

          <div className="contact-meta-row">
            <span className="contact-meta-title">PRIMARY INBOX</span>
            <a href="mailto:rohitdare97@gmail.com" className="contact-meta-val">
              rohitdare97@gmail.com
            </a>
          </div>

          <div className="contact-meta-row">
            <span className="contact-meta-title">COMMUNICATION CHANNELS</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
              <a href="https://github.com/Rohitdare" target="_blank" rel="noopener noreferrer" className="social-link">
                <span>github.com/Rohitdare</span>
                <span className="material-symbols-outlined">arrow_outward</span>
              </a>
              <a href="https://x.com/rohit_dev" target="_blank" rel="noopener noreferrer" className="social-link">
                <span>x.com/rohit_dev</span>
                <span className="material-symbols-outlined">arrow_outward</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <span>linkedin.com/in/rohit</span>
                <span className="material-symbols-outlined">arrow_outward</span>
              </a>
            </div>
          </div>

          <div className="contact-meta-row" style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--card-border-subtle)' }}>
            <span className="contact-meta-title">SECURITY CLEARANCE</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--status-live)' }}>
              PGP_KEY: 0x8429_F9B3_VERIFIED
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
