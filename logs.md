# Change Log & Project Recall History

This document serves as the persistent audit log and memory bank for the **Trainer ID Developer Portfolio** (`Rohitdare/portfolio`). Every modification, architectural decision, UI refinement, and bugfix must be recorded here with timestamps, modified files, rationale, and functional outcome.

---

## Log Format Standard

Each entry records:
- **Timestamp** (ISO & Local)
- **Author / Agent**
- **Task Summary**
- **Files Modified / Added / Deleted**
- **Specific Changes & Rationale**
- **Verification & Status**

---

## Entry History

### [2026-10-10 21:15 IST] — Minimal Bottom-Left Scroll Navigation Arrow
- **Author / Agent:** Antigravity AI
- **Task:** Add a small, polished scroll-down arrow button in the bottom-left corner of the viewport complementing the Trainer ID card design, with sequential section step navigation, smooth scroll-to-battle at the final section, and a flipped scroll-to-top state.
- **Files Modified:**
  - `index.html`:
    - Added `#scroll-nav-arrow` button markup with inline SVG arrow and accessible dynamic `aria-label`.
  - `index.css`:
    - Added `.scroll-nav-arrow` fixed styling at `left: 2rem; bottom: 2rem;` (`1.25rem` on mobile), with dark translucent frosted glass backing (`rgba(18, 18, 20, 0.72)` / light mode `#FDFDF8`), coral-red hover accent (`#E63946`), slow gentle drift animation (`scrollArrowDrift 2.8s`), and `.pointing-up` 180° rotation state.
    - Added `animation: none !important;` in `@media (prefers-reduced-motion: reduce)`.
  - `main.js`:
    - Added `updateScrollArrowState()` syncing with `currentSectionIndex`, URL hash, and viewport scroll position.
    - Wired up click handler: sequentially transitions through card sections (`home` -> `stack` -> `projects` -> `experience` -> `blogs` -> `contact`), scrolls smoothly to `#final-battle` from contact, and flips to scroll back to `#home` when viewing the bottom battle section.
- **Verification:** Verified visibility, non-overlapping positioning, responsive scaling, tactile sound feedback, and smooth navigation loop.
- **Status:** Complete & verified.

---

### [2026-10-10 20:45 IST] — Fix Unwanted Hover Tooltips & Polish Animations
- **Author / Agent:** Antigravity AI
- **Task:** Eliminate unwanted black browser tooltip rectangles appearing when hovering over Oneko cat, Japanese kanji watermark, pixel cat, and theme toggle. Polish card hover animations, background dot grid rendering, loop lifecycle, and implement full `prefers-reduced-motion` accessibility.
- **Files Modified:**
  - `oneko.js`:
    - Removed `nekoEl.title` attribute causing native black tooltip popups.
    - Added accessible `aria-label` attribute on `nekoEl`.
    - Added `document.hidden` check in `onAnimationFrame` to pause rendering when tab is inactive.
    - Added `prefers-reduced-motion` check to keep cat peacefully resting when reduced motion is preferred.
  - `index.html`:
    - Removed `title` from `<button id="theme-toggle">` (retaining `aria-label`).
    - Replaced `title` on `<span class="kanji-watermark">` with accessible `aria-label` and `role="img"`.
    - Replaced `title` on `<div class="pixel-cat-easter-egg">` with accessible `aria-label` and `role="img"`.
  - `main.js`:
    - Optimized `updateCardOrientation`: added `prefersReducedMotion` check, `document.hidden` pause, and scroll bounds check to stop updating 3D tilt when hero stage is scrolled off-screen.
  - `dot-grid-bg.js`:
    - Added idle sleep/wake logic: canvas loop goes to sleep after pointer leaves and decay finishes, saving CPU/GPU cycles until next cursor movement.
    - Added visibility change handler and theme change observer.
    - Respected `prefers-reduced-motion` by disabling revolving orbit motion when requested.
  - `index.css`:
    - Replaced abrupt card transitions with smooth `cubic-bezier(0.16, 1, 0.3, 1)` easing.
    - Added `@keyframes sectionReveal` on `.card-section.active` for seamless tab switching.
    - Added comprehensive `@media (prefers-reduced-motion: reduce)` block to disable unnecessary keyframes and large transforms.
- **Verification:** Verified complete elimination of native tooltips on affected elements while preserving accessibility; verified animation smoothness, loop idling, and reduced-motion behavior.
- **Status:** Complete & verified.

---

### [2026-10-09 00:38 IST] — Shift Final Battle Section Downwards for Full Viewport Clearance
- **Author / Agent:** Antigravity AI
- **Task:** Shift the final battle section downwards with `min-height: 100vh; min-height: 100dvh;` and `margin-top: 15vh;` so that upon scrolling down, the entire upper hero stage (trainer badge, lanyard, katana graphic, and telemetry index) is completely scrolled off-screen and not visible.
- **Files Modified:**
  - `index.css`:
    - Updated `.final-battle-section` to `min-height: 100vh; min-height: 100dvh; margin-top: 15vh; padding: 4rem 1.5rem;` on desktop, `10vh` on tablet, and `8vh` on mobile.
    - Added `body.scrolled-past-hero .gif-artwork-layer` and `body.battle-mode .gif-artwork-layer` to fade out the katana art completely (`opacity: 0 !important;`) as soon as the user scrolls away from the hero stage.
    - Added `body.battle-mode .telemetry-hud` to smoothly fade out and hide the fixed mid-right `01 / 06` telemetry HUD when viewing the final battle scene.
  - `main.js`:
    - Added scroll listener setting `body.classList.toggle('scrolled-past-hero', window.scrollY > 40)`.
    - Enhanced `battleObserver` to toggle `body.classList.add('battle-mode')` and remove when scrolled back up.
- **Verification:** Verified `min-height: 100vh` on `.final-battle-section`, fade-out of upper hero assets on scroll, and full-screen isolation of battle scene.
- **Status:** Complete & verified.

---

### [2026-10-09 00:32 IST] — Complete Seamless Flow & Fix of Horizontal Boundary Cut
- **Author / Agent:** Antigravity AI
- **Task:** Fix the horizontal background split and sharp cutoff edge between the hero card stage and final battle section reported in screenshot `media_1791485750569.png`.
- **Files Modified:**
  - `index.css`:
    - Changed `.final-battle-section` background to `background: transparent;` in both dark and light modes, completely eliminating the opaque box that was occluding the fixed canvas dot grid (`.dot-grid-bg`) and creating a horizontal color cliff across the viewport.
    - Disabled `.battle-bg-overlay` scanlines to prevent any horizontal stripe artifacts.
    - Added `-webkit-mask-image` / `mask-image: linear-gradient(to bottom, black 55%, transparent 98%);` to `.gif-artwork-layer` so the katana manga GIF's bottom edge dissolves softly into transparency without ever producing a sharp rectangular boundary line.
- **Verification:** Verified transparent background on `.final-battle-section`, mask gradient on `.gif-artwork-layer`, and continuous canvas dot matrix flow.
- **Status:** Complete & verified.

---

### [2026-10-09 00:23 IST] — Seamless Screen Transition & Removal of Dividing Red Line
- **Author / Agent:** Antigravity AI
- **Task:** Eliminate the horizontal dividing red line (`border-top: 1px solid rgba(230, 57, 70, ...)`) cutting across the screen between the hero/card stage and the final battle section, making the vertical transition completely seamless.
- **Files Modified:**
  - `index.css`: Removed `border-top` from `.final-battle-section` (in both dark and light themes), and refined the background radial gradient to fade into `var(--stage-bg)` for a smooth, unified page flow.
  - `logs.md`: Recorded change.
- **Verification:** Verified `border-top: none;` on `.final-battle-section` in both dark and light modes.
- **Status:** Complete & verified.

---

### [2026-10-09 00:13 IST] — Removal of Header Pokeball Indicators
- **Author / Agent:** Antigravity AI
- **Task:** Remove `.trainer-capsule` and its 3 `.pokeball-pip` indicators from the top-left navigation area, along with its interactive click listener.
- **Files Modified:**
  - `index.html`: Removed `.trainer-capsule` markup from `.header-left`.
  - `main.js`: Removed `.pokeball-pip` click listeners and toast trigger.
  - `logs.md`: Recorded change.
- **Verification:** Verified clean rendering of header with only the live IST clock in `.header-left`.
- **Status:** Complete & verified.

---

### [2026-10-09 00:10 IST] — Browser Tab Title & Favicon Update
- **Author / Agent:** Antigravity AI
- **Task:**
  1. Update browser tab title to `Rohit Dare — Software Developer | AI` using standard em dash (`—`) and vertical separator (`|`).
  2. Add `assets/logo.svg` as SVG favicon in `<head>` via `<link rel="icon" type="image/svg+xml" href="assets/logo.svg">`.
- **Files Modified:**
  - `index.html`: Updated `<title>` tag and added favicon `<link>`.
  - `logs.md`: Recorded change.
- **Verification:** Verified `<title>` text and favicon path.
- **Status:** Complete & verified.

---

### [2026-10-06 02:15 IST] — Removal of Avatar Decals (R Badge, GEN 09 Stamp) and LVL. 99 MASTER Tag
- **Author / Agent:** Antigravity AI
- **Task:**
  1. Remove `.avatar-holo-stamp` (`GEN 09`) from the bottom right of the avatar image.
  2. Remove `.avatar-corner-stamp` (circular red `R` badge) from the bottom left of the avatar frame.
  3. Remove `.level-tag` (`LVL. 99 MASTER`) from the header next to the hero name `ROHIT`.
- **Files Modified:**
  - `index.html`: Removed `.avatar-holo-stamp`, `.avatar-corner-stamp`, and `.level-tag`.
  - `logs.md`: Recorded change.
- **Status:** Complete & verified.

---

### [2026-10-06 01:39 IST] — Tagline Preservation in Final Battle Section
- **Author / Agent:** Antigravity AI
- **Task:** Retain `"Still building. Still learning. Still shipping."` tagline positioned directly above the CTA buttons in the final battle section, while keeping the HUD elements, large heading, and header avatar button removed.
- **Files Modified:**
  - `index.html`: Added `<p class="battle-subtext">Still building. Still learning. Still shipping.</p>` inside `.battle-content-block` above `.battle-cta-row`.
  - `logs.md`: Recorded update.
- **Status:** Complete & verified.

---

### [2026-10-06 01:36 IST] — Removal of Battle HUD, Heading Text, and Header Avatar Icon
- **Author / Agent:** Antigravity AI
- **Task:**
  1. Remove `.battle-hud-top` (`FINAL STAGE // CLIMAX ... MISSION COMPLETE`) from final battle section.
  2. Remove `.battle-hud-bottom` (`01 / 01 STAGE CLEAR`) from final battle section.
  3. Remove `.battle-heading` (`THE BATTLE ISN'T OVER YET.`) while keeping the subtle supporting tagline.
  4. Remove `.nav-avatar-btn` (red circular user icon) from the top-right header area.
- **Files Modified:**
  - `index.html`: Cleaned `#final-battle` markup and emptied `.header-right`.
  - `logs.md`: Recorded change.
  - `flow.md`: Updated DOM inventory.
- **Verification:** Verified in DOM structure and git diff.
- **Status:** Complete.

---

### [2026-10-06 01:30 IST] — Final Anime Battle Scene Addition (Naruto vs Sasuke Climax End Screen)
- **Author / Agent:** Antigravity AI
- **Task:**
  1. Add a final anime battle scene to the LAST SECTION of the portfolio, right after the main card stage.
  2. Use existing `assets/naruto.gif` asset without generating, replacing, or modifying it.
  3. Structure: Top HUD (`FINAL STAGE // CLIMAX`, `MISSION COMPLETE`), centered hero battle sprite (`assets/naruto.gif`), atmospheric red/pink glow, floating ember/spark particles, narrative typography (`"THE BATTLE ISN'T OVER YET."` / `"Still building. Still learning. Still shipping."`), compact CTAs (`"VIEW GITHUB"` & `"CONTACT ME"`), and bottom telemetry HUD (`01 / 01` `STAGE CLEAR`).
  4. Ensure responsive behavior across desktop, tablet, and mobile with no horizontal overflow.
  5. Add lightweight entrance animations via `IntersectionObserver`.
- **Files Modified:**
  - `index.html`: Moved `.gif-artwork-layer` inside `.main-stage` to anchor the hero katana art. Appended `<section id="final-battle" class="final-battle-section">` with full HUD, battle sprite wrapper, floating embers, and dual CTAs.
  - `index.css`: Added styles for `.final-battle-section`, `.battle-stage-frame`, `.battle-hud-top`, `.battle-sprite-wrapper`, `.battle-sprite-aura`, `.battle-sprite-img`, `.battle-ground-shadow`, `.battle-sparks-container`, `.battle-spark` (`@keyframes sparkRise`), `.battle-content-block`, `.battle-eyebrow`, `.battle-heading`, `.battle-subtext`, `.battle-cta-row`, `.battle-btn`, `.battle-hud-bottom`, and `.in-view` entrance transitions. Adjusted `html, body` to `overflow-x: hidden; overflow-y: auto; scroll-behavior: smooth;` and `.main-stage` to `position: relative; overflow: visible;`.
  - `main.js`: Added `IntersectionObserver` observing `#final-battle` to toggle `.in-view` class on scroll entry. Refined wheel scroll listener to only capture scroll within `#trainer-card` when internal scroll headroom is available, enabling natural smooth window scroll to the battle scene. Added `#battle-contact-btn` sound & smooth scroll to `#contact`.
  - `logs.md`: Recorded this change.
  - `flow.md`: Updated layer architecture, DOM inventory, and observer flow.
- **Verification:** Verified `assets/naruto.gif` loads with HTTP 200 OK, aspect ratio 2:1 is preserved, sparks rise smoothly, and contact CTA smoothly jumps to top contact card.
- **Status:** Complete & verified.

---

- **Author / Agent:** Antigravity AI
- **Task:**
  1. Enhance visibility and contrast of the quote card Kanji (`戦え`).
  2. Document the meaning and cultural context of `戦え` (Tatakae).
  3. Establish `logs.md` for permanent session recall.
  4. Create `flow.md` mapping all functions, events, DOM elements, and architectural flows.
- **Files Modified / Created:**
  - `index.css`: Updated `.kanji-watermark` with serif Japanese font stack (`Noto Serif JP`, `Hiragino Mincho ProN`, `Yu Mincho`), rich vermilion color (`--vermilion`), opacity increased from invisible 0.35 on matching border to 0.42 (hover 0.85 with drop shadow), `pointer-events: auto`, and cursor `help`.
  - `index.html`: Added tooltip `title="戦え (Tatakae) — 'Fight!' // Eren Yeager (Attack on Titan)"` to `.kanji-watermark`.
  - `logs.md`: Created this persistent change log.
  - `flow.md`: Created complete system architecture and function map.
- **Rationale:** The kanji was previously rendered using `color: var(--card-border)` (`#D9D0BE`) at 35% opacity against `#E9E1D2`, resulting in nearly 0 contrast ratio and making it appear missing. Setting it to the vermilion palette with proper typographic scaling and hover glow makes it an intentional Japanese seal/watermark.
- **Status:** Verified (200 OK, crisp visual presentation).

---

### [2026-10-06 00:33 IST] — Repository Cleanup & Remote Push
- **Author / Agent:** Antigravity AI
- **Commit:** `596a006` (`"Clean project structure, integrate real GitHub stats, and add interactive Oneko companion"`)
- **Files Modified / Created / Deleted:**
  - `assests/` (DELETED): Removed misspelled folder containing duplicate 3MB GIF.
  - `assets/ezgif-5ebcf19eab001312.gif` (DELETED): Removed duplicate unreferenced 3MB GIF file, reducing repository bloat.
  - `data/github-contributions.json` (MOVED): Relocated root JSON file to dedicated `data/` directory.
  - `assets/oneko.gif` (MOVED): Placed Oneko sprite sheet inside `assets/`.
  - `main.js`: Updated fallback fetch target to `data/github-contributions.json`.
  - `oneko.js`: Updated sprite source target to `./assets/oneko.gif`.
- **Rationale:** Eliminate duplicate assets, adhere to standard directory layout (`assets/` for media, `data/` for datasets), and maintain a clean root.
- **Status:** Committed and pushed to `origin/master` ([Rohitdare/portfolio](https://github.com/Rohitdare/portfolio)).

---

### [2026-10-06 00:15 IST] — Interactive Oneko.js Desktop Companion
- **Author / Agent:** Antigravity AI
- **Task:** Import desktop cat companion (`oneko.js`) with drag-to-place and click-to-stop/sleep controls.
- **Files Modified / Created:**
  - `oneko.js` (NEW): Full Oneko engine with drag & drop placement, 8-direction running animations, wall scratching, self grooming, sleeping cycles, Web Audio sound effects (pickup chirp, drop purr, wake chirp), and `localStorage` position persistence.
  - `assets/oneko.gif` (NEW): 32x32 pixelated sprite sheet (with base64 embedded fallback in script).
  - `index.html`: Appended `<script src="oneko.js"></script>`.
  - `index.css`: Added `#oneko` grab/grabbing cursor rules and `.oneko-balloon` speech bubble animation.
- **Controls Implemented:**
  - **Drag & Place:** Mouse down / touch on cat -> drag across screen -> release to place at exact coordinates.
  - **Click to Toggle:** Click/tap without dragging toggles between **Sleeping / Stopped** (`Zzz...`) and **Active / Following** (`Meow!`).
  - **Accessible:** Space/Enter triggers sleep/wake toggle.
- **Status:** Tested & verified functional.

---

### [2026-10-05 23:20 IST] — Real GitHub Profile & 52-Week Contribution Matrix Integration
- **Author / Agent:** Antigravity AI
- **Task:** Connect portfolio to user's real GitHub account (`@Rohitdare`) and replace mock data with authentic contributions.
- **Files Modified / Created:**
  - `main.js`: Implemented `loadRealGitHubContributions()` replacing randomized mock generator. Fetches live data from `https://github-contributions-api.jogruber.de/v4/Rohitdare?y=last` with timeout, falling back gracefully to local `data/github-contributions.json`.
  - `data/github-contributions.json`: Real snapshot containing 366 days and 101 contributions.
  - `index.html`:
    - Updated matrix header to `CONTRIBUTION MATRIX // @Rohitdare`.
    - Updated total count indicator to `101 contributions in the last year`.
    - Dynamically aligned month row (`OCT` through `OCT`).
    - Updated quicklinks and contact channels to `https://github.com/Rohitdare`.
    - Updated primary contact inbox to `rohitdare97@gmail.com`.
- **Status:** Verified working live and offline.

---

### [2026-10-05 22:45 IST] — Fixed Bottom Footer Removal
- **Author / Agent:** Antigravity AI
- **Task:** Remove bottom fixed footer bar (`© 2025 ROHIT // TRAINER ID NO. 84829 // CHAMPION LEAGUE ARCHITECTURE`).
- **Files Modified:**
  - `index.html`: Deleted `<footer class="app-footer">` markup.
  - `index.css`: Removed `.app-footer`, `html.light .app-footer`, and `.footer-league-tag` rules. Adjusted `.gif-artwork-layer` `bottom` from `2.75rem` to `1.25rem`.
- **Status:** Complete.

---

### [2026-10-05 22:30 IST] — Vertical Sizing & Hero Viewport Optimization
- **Author / Agent:** Antigravity AI
- **Task:** Compact the hero card vertically by 15–20% so that profile picture, bio, quote, and contribution matrix comfortably fit inside 1366x768 and 1920x1080 viewports without excessive scrolling.
- **Files Modified:**
  - `index.css`: Compacted padding, margins, avatar dimensions (180px -> 155px), quote card height, and contribution heatmap cells (7.2px grid with 2.2px gap).
- **Status:** Viewport fit verified.

---

### [2026-10-05 22:00 IST] — Layering & Stacking Context Corrections
- **Author / Agent:** Antigravity AI
- **Task:** Ensure page content never visually renders through or overlaps navbar items, establishing strict foreground/background z-index hierarchy.
- **Files Modified:**
  - `index.css`: Defined strict stacking levels:
    - Level 0: Background dot grid (`z-index: 0`)
    - Level 1: GIF artwork layer (`z-index: 5`)
    - Level 2: Lanyard strap & clasp (`z-index: 10`)
    - Level 3: 3D Trainer Card badge (`z-index: 20`)
    - Level 4: Fixed Header / Navigation Bar (`z-index: 100`)
    - Level 5: Oneko companion & toasts (`z-index: 2147483647`)
- **Status:** Resolved all text and overlay bleeding.

---

### [2026-10-05 19:40 IST] — Lanyard Top Origin & Navigation Styling
- **Author / Agent:** Antigravity AI
- **Task:** Anchor red lanyard strap to the top center edge of the screen behind the transparent navbar.
- **Files Modified:**
  - `index.html` & `index.css`: Built physical metal clasp, swivel ring, and punch slot cut-out, creating a suspended badge illusion.
- **Status:** Complete.

---

### [2026-10-05 14:20 IST] — Initial Stitch Project Conversion & 3D Interactive Setup
- **Author / Agent:** Antigravity AI
- **Task:** Convert Google Stitch Project ID `17313236390310417597` into a functioning 3D interactive portfolio.
- **Core Technologies:** HTML5, Vanilla CSS3, Vanilla JavaScript, Canvas API, Web Audio API.
- **Status:** Foundation created.
