/**
 * TRAINER ID DEVELOPER PORTFOLIO — CORE LOGIC & 3D INTERACTION
 * - 3D Card tilt & specular sheen physics
 * - Suspended lanyard mechanics
 * - Hash router across 6 sections
 * - 52-Week Contribution Matrix with tooltips
 * - Live IST time beacon (UTC+5:30)
 * - Light / Dark mode toggle
 * - Tactile Web Audio SFX for retro handheld feel
 * - Contact form transmission
 */

(function () {
  'use strict';

  /* ── State & Elements ─────────────────────────────────────── */
  const cardWrapper = document.getElementById('card-3d-wrapper');
  const trainerCard = document.getElementById('trainer-card');
  const lanyardAssembly = document.getElementById('lanyard-assembly');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.card-section');
  const telemetryIndex = document.getElementById('telemetry-index');
  const telemetryBar = document.getElementById('telemetry-bar');
  const istClock = document.getElementById('ist-clock');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const contactForm = document.getElementById('contact-form');
  const toastNotice = document.getElementById('toast-notice');

  const SECTIONS = ['home', 'stack', 'projects', 'experience', 'blogs', 'contact'];
  let currentSectionIndex = 0;

  /* ── Subtle Web Audio Sound Effects (Zero External Files) ─── */
  let audioCtx = null;
  function playBeep(freq = 600, duration = 0.06, type = 'sine') {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio might be blocked until user gesture, ignore safely
    }
  }

  /* ── 3D Card Tilt & Suspension Physics ────────────────────── */
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let isHovered = false;
  let restAngle = 1.8; // Designed default tilt angle (degrees)
  let currentRotX = 0;
  let currentRotY = 0;
  let currentRotZ = restAngle;
  let lanyardRotZ = 0;

  // Let initial entrance animation run unhindered for 1.35s
  let isEntering = true;
  setTimeout(() => {
    isEntering = false;
    if (cardWrapper) cardWrapper.classList.remove('badge-entering');
    if (lanyardAssembly) lanyardAssembly.classList.remove('badge-entering');
  }, 1350);

  function updateCardOrientation() {
    if (isEntering) {
      requestAnimationFrame(updateCardOrientation);
      return;
    }

    if (isHovered) {
      // Smooth interpolation toward target rotation based on cursor
      currentRotX += (mouse.targetX - currentRotX) * 0.1;
      currentRotY += (mouse.targetY - currentRotY) * 0.1;
      currentRotZ += (0 - currentRotZ) * 0.1; // Straighten slightly when active
      lanyardRotZ += ((mouse.targetY * 0.35) - lanyardRotZ) * 0.08;
    } else {
      // Natural gentle sway when resting
      const now = performance.now() * 0.0015;
      const naturalSway = Math.sin(now) * 0.6;
      currentRotX += (0 - currentRotX) * 0.06;
      currentRotY += (0 - currentRotY) * 0.06;
      currentRotZ += ((restAngle + naturalSway) - currentRotZ) * 0.06;
      lanyardRotZ += ((naturalSway * 0.4) - lanyardRotZ) * 0.06;
    }

    if (cardWrapper && trainerCard) {
      cardWrapper.style.transform = `rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) rotateZ(${currentRotZ.toFixed(2)}deg)`;
    }
    if (lanyardAssembly) {
      lanyardAssembly.style.transform = `rotateZ(${lanyardRotZ.toFixed(2)}deg) rotateY(${(currentRotY * 0.35).toFixed(2)}deg)`;
    }

    requestAnimationFrame(updateCardOrientation);
  }
  requestAnimationFrame(updateCardOrientation);

  // Mousemove handler for 3D perspective
  window.addEventListener('mousemove', (e) => {
    if (!cardWrapper) return;
    const rect = cardWrapper.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - cardCenterX;
    const dy = e.clientY - cardCenterY;

    // Check if pointer is in range of the card or stage
    const dist = Math.hypot(dx, dy);
    if (dist < 800) {
      isHovered = true;
      // Rotation angles (-12 to +12 degrees max)
      const factorX = (dy / (window.innerHeight * 0.5));
      const factorY = (dx / (window.innerWidth * 0.5));
      mouse.targetX = -Math.max(-10, Math.min(10, factorX * 9));
      mouse.targetY = Math.max(-12, Math.min(12, factorY * 11));

      // Specular sheen highlight coordinate
      if (trainerCard) {
        const localX = ((e.clientX - rect.left) / rect.width) * 100;
        const localY = ((e.clientY - rect.top) / rect.height) * 100;
        trainerCard.style.setProperty('--mouse-x', `${localX.toFixed(1)}%`);
        trainerCard.style.setProperty('--mouse-y', `${localY.toFixed(1)}%`);
      }
    } else {
      isHovered = false;
    }
  });

  document.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  // Mobile Device Orientation Gyroscope
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null && e.beta !== null) {
        const tiltX = Math.max(-12, Math.min(12, (e.beta - 40) * 0.35));
        const tiltY = Math.max(-14, Math.min(14, e.gamma * 0.35));
        mouse.targetX = -tiltX;
        mouse.targetY = tiltY;
        isHovered = true;
      }
    });
  }

  /* ── Hash Routing & Section Switching ─────────────────────── */
  function navigateToSection(targetId, playSound = true) {
    const cleanId = (targetId || 'home').replace('#', '').toLowerCase();
    const index = SECTIONS.indexOf(cleanId);
    if (index === -1) return;

    currentSectionIndex = index;

    // Update Nav Pills
    navLinks.forEach((link) => {
      const path = link.getAttribute('data-path');
      if (path === cleanId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    // Update Section Visibility
    sections.forEach((sec) => {
      if (sec.id === `section-${cleanId}`) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    // Update Telemetry Index & Progress Rail
    const numStr = String(index + 1).padStart(2, '0');
    if (telemetryIndex) {
      telemetryIndex.textContent = `${numStr} / 06`;
    }
    if (telemetryBar) {
      const heightPercent = ((index + 1) / SECTIONS.length) * 100;
      telemetryBar.style.height = `${heightPercent}%`;
    }

    if (playSound) {
      playBeep(440 + index * 80, 0.05, 'triangle');
    }

    // Reset scroll to top of newly active section
    const container = document.querySelector('.card-section-container');
    if (container) {
      container.scrollTop = 0;
    }
  }

  // Forward mouse wheel scrolling to the active section container from anywhere
  window.addEventListener('wheel', (e) => {
    const container = document.querySelector('.card-section-container');
    if (container) {
      container.scrollTop += e.deltaY;
    }
  }, { passive: true });

  // Handle click on nav items
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const path = link.getAttribute('data-path');
      window.location.hash = path;
      navigateToSection(path);
    });
  });

  // Handle hashchange in URL
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash || '#home';
    navigateToSection(hash);
  });

  // Delegate clicks on internal CTA buttons that link to sections (e.g. #stack)
  document.addEventListener('click', (e) => {
    const targetLink = e.target.closest('a[href^="#"]');
    if (targetLink) {
      const href = targetLink.getAttribute('href');
      if (href && href.length > 1) {
        e.preventDefault();
        const sectionName = href.replace('#', '');
        window.location.hash = sectionName;
        navigateToSection(sectionName);
      }
    }
  });

  /* ── Live IST Clock (UTC + 5:30) ─────────────────────────── */
  function updateISTClock() {
    if (!istClock) return;
    try {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      const formatter = new Intl.DateTimeFormat([], options);
      const parts = formatter.format(new Date());
      istClock.textContent = `IST ${parts}`;
    } catch (e) {
      // Fallback manual UTC+5:30 calculation
      const d = new Date();
      const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      const istDate = new Date(utc + (3600000 * 5.5));
      let h = istDate.getHours();
      const m = String(istDate.getMinutes()).padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      istClock.textContent = `IST ${String(h).padStart(2, '0')}:${m} ${ampm}`;
    }
  }
  setInterval(updateISTClock, 1000);
  updateISTClock();

  /* ── Real GitHub Contribution Matrix (@Rohitdare) ────────── */
  async function loadRealGitHubContributions() {
    const grid = document.getElementById('heatmap-grid');
    const totalCountEl = document.getElementById('heatmap-total-count');
    const monthsRowEl = document.getElementById('heatmap-months-row');
    if (!grid) return;

    // Palette levels matching Trainer ID theme
    const colors = [
      '#DDD5C5', // 0: empty
      '#F5B5B8', // 1: low
      '#EE7B83', // 2: med
      '#E63946', // 3: high
      '#B5232F'  // 4: extreme
    ];

    let data = null;

    // 1. First attempt to fetch live from the GitHub contributions API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch('https://github-contributions-api.jogruber.de/v4/Rohitdare?y=last', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        data = await res.json();
      }
    } catch (err) {
      console.warn('Live GitHub fetch failed, attempting local fallback:', err);
    }

    // 2. Fall back to local github-contributions.json if live fetch failed
    if (!data || !Array.isArray(data.contributions)) {
      try {
        const localRes = await fetch('github-contributions.json');
        if (localRes.ok) {
          data = await localRes.json();
        }
      } catch (err) {
        console.warn('Local GitHub contributions file fetch failed:', err);
      }
    }

    // If still no data, generate a basic placeholder structure
    if (!data || !Array.isArray(data.contributions)) {
      renderFallbackMatrix();
      return;
    }

    // 3. Update total contributions label
    const totalCount = data.total?.lastYear ?? 
      (typeof data.total === 'object' ? Object.values(data.total)[0] : 101);
    if (totalCountEl) {
      totalCountEl.textContent = `${totalCount.toLocaleString()} contributions in the last year`;
    }

    // 4. Render Grid Columns & Cells
    const contributions = data.contributions;
    let gridHtml = '';
    
    // Group days into columns of 7 (Sunday to Saturday)
    for (let i = 0; i < contributions.length; i += 7) {
      const week = contributions.slice(i, i + 7);
      gridHtml += '<div class="heatmap-col">';
      for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
        const day = week[dayIdx];
        if (day) {
          const count = day.count || 0;
          const level = Math.min(4, Math.max(0, day.level || 0));
          const color = colors[level];
          const dateObj = new Date(day.date + 'T00:00:00');
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
          const title = `${count} contribution${count === 1 ? '' : 's'} on ${formattedDate}`;
          gridHtml += `<span class="heatmap-cell" style="background-color: ${color};" title="${title}" data-date="${day.date}" data-commits="${count}" role="button" tabindex="0"></span>`;
        } else {
          // Empty slot placeholder for days past the end of the year
          gridHtml += '<span class="heatmap-cell" style="visibility: hidden;"></span>';
        }
      }
      gridHtml += '</div>';
    }
    grid.innerHTML = gridHtml;

    // Attach click listeners to open GitHub activity
    grid.querySelectorAll('.heatmap-cell[data-date]').forEach(cell => {
      cell.addEventListener('click', () => {
        const date = cell.getAttribute('data-date');
        if (date) {
          window.open(`https://github.com/Rohitdare?tab=overview&from=${date}&to=${date}`, '_blank', 'noopener,noreferrer');
        }
      });
    });

    // 5. Update Month Labels to match actual range
    if (monthsRowEl) {
      const monthNames = ['OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT'];
      const activeMonths = [];
      let lastMonth = -1;
      contributions.forEach((c) => {
        const m = new Date(c.date + 'T00:00:00').getMonth();
        if (m !== lastMonth) {
          const shortName = new Date(c.date + 'T00:00:00').toLocaleString('en-US', { month: 'short' }).toUpperCase();
          activeMonths.push(shortName);
          lastMonth = m;
        }
      });
      if (activeMonths.length > 0) {
        monthsRowEl.innerHTML = activeMonths.map(name => `<span>${name}</span>`).join('');
      }
    }
  }

  function renderFallbackMatrix() {
    const grid = document.getElementById('heatmap-grid');
    if (!grid) return;
    const colors = ['#DDD5C5', '#F5B5B8', '#EE7B83', '#E63946', '#B5232F'];
    let html = '';
    for (let col = 0; col < 52; col++) {
      html += '<div class="heatmap-col">';
      for (let row = 0; row < 7; row++) {
        html += `<span class="heatmap-cell" style="background-color: ${colors[0]};"></span>`;
      }
      html += '</div>';
    }
    grid.innerHTML = html;
  }

  loadRealGitHubContributions();

  /* ── Theme Switcher (Dark / Light) ────────────────────────── */
  function initTheme() {
    const savedTheme = localStorage.getItem('trainer_id_theme') || 'dark';
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
      if (themeIcon) themeIcon.textContent = 'light_mode';
    } else {
      document.documentElement.classList.remove('light');
      if (themeIcon) themeIcon.textContent = 'dark_mode';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light');
      localStorage.setItem('trainer_id_theme', isLight ? 'light' : 'dark');
      if (themeIcon) {
        themeIcon.textContent = isLight ? 'light_mode' : 'dark_mode';
      }
      playBeep(isLight ? 750 : 380, 0.08, 'sine');
    });
  }
  initTheme();

  /* ── Pokeball Interactive Easter Egg ──────────────────────── */
  const pokeballs = document.querySelectorAll('.pokeball-pip');
  pokeballs.forEach((ball, idx) => {
    ball.addEventListener('click', () => {
      playBeep(520 + idx * 120, 0.08, 'sine');
      showToast(`POKEBALL #${idx + 1} ACTIVATED // BATTLE READY`);
    });
  });

  /* ── Contact Form Submission & Toast ──────────────────────── */
  function showToast(message) {
    if (!toastNotice) return;
    toastNotice.querySelector('.toast-text').textContent = message;
    toastNotice.classList.add('show');
    clearTimeout(toastNotice._timer);
    toastNotice._timer = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3500);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value || 'Trainer';
      playBeep(880, 0.12, 'square');
      showToast(`MESSAGE TRANSMITTED // ACK_0x842 FROM ${name.toUpperCase()}`);
      contactForm.reset();
    });
  }

  /* ── Initial Route Load ───────────────────────────────────── */
  const initialHash = window.location.hash || '#home';
  navigateToSection(initialHash, false);

})();
