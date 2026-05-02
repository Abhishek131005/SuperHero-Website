# Product Requirements Document
## Friendly Neighbourhood Spider-Man — Interactive Scroll Experience

---

### 1. Product Overview

A single-page, scroll-driven cinematic web experience themed around Spider-Man. The site is a storytelling canvas — not a traditional webpage. Each section occupies 100vh, revealing narrative content (comic panels, quotes, villain introductions, and a love arc) through scroll-triggered animations with comic-book aesthetics. The tone is **dark base with vivid colorful comic pops** — think noir meets Silver Age Marvel.

---

### 2. Goals

- Deliver an immersive, cinematic scroll experience that feels like flipping through a living comic book.
- Showcase scroll-driven storytelling with per-section unique animation personalities.
- Be asset-swap ready — all image/webp references are clearly named placeholders developers replace by dropping in files.
- Desktop-first, mobile-responsive.

---

### 3. Sections & Functional Requirements

#### S1 — Hero / Title (Parallax)
- Full-screen (`100vh`) section.
- Background: `hero-nosedive.webp` — Spider-Man nosediving, used as a parallax layer (moves at 0.4× scroll speed relative to viewport).
- **Text animation sequence:**
  1. `"Friendly Neighbourhood"` fades + slides up on page load (delay: 0.3s).
  2. `"SPIDER-MAN"` appears as Spidey reaches mid-screen — timed to parallax depth (trigger: scroll 15%).
- Font: bold, comic-distressed display face.
- Overlay: dark gradient (top→bottom, 60% opacity black) to ensure text contrast.

#### S2 — "The Bite That Changed Everything"
- 3 comic panels: `s2-panel-1.jpg`, `s2-panel-2.jpg`, `s2-panel-3.jpg`.
- Panels appear **one by one** as user scrolls. Each panel has its own scroll threshold.
- Panel entrance style: **fly-in from alternating edges** (1: left, 2: right, 3: left) with a slight rotation (-3°→0°) snap.
- Comic `OW!` sound-bubble SVG animates with panel 1 (bounce-in keyframe).
- Section quote `"THE BITE THAT CHANGED EVERYTHING"` fades up after panel 3 is visible.
- Numbers (1, 2, 3) stamp onto panels with an ink-drop effect.

#### S3 — "With Great Power…Comes Great Responsibility"
- 3 panels: `s3-panel-1.jpg`, `s3-panel-2.jpg`, `s3-panel-3.jpg`.
- **Memory lane motif**: panels start desaturated (grayscale) and gain color as they scroll into full view — simulating a flashback becoming vivid.
- Bright white light flash overlay (opacity 0→0.6→0, 400ms) fires between panel 2 and panel 3 — the "Uncle Ben memory" moment.
- Quote appears with a typewriter effect after panel 3.
- Numbers stamp as per S2.

#### S4 — "To Fight… For What's Right"
- 2 comic panels: `s4-panel-1.jpg`, `s4-panel-2.jpg`.
- Panels **zoom in from center** (scale 0.6→1, with slight overshoot spring).
- Comic text bubble "TO FIGHT… FOR WHAT'S RIGHT" is animated with a bubble-draw SVG stroke effect — the outline draws itself, then fill floods in.
- "AND HERE SECONDS LATER…" caption appears with a delayed fade.

#### S5 — "Enter Sinister Six" (Row 1: Villains 1–3)
- Heading `"ENTER SINISTER SIX"` slams down from top with a shockwave ripple on landing.
- 3 villain panels: `s5-v1.jpg`, `s5-v2.jpg`, `s5-v3.jpg`.
- Each panel **ink-bleeds in** (reveal via a radial mask expanding from center) one by one on scroll.
- Each panel has a caption below (comic quip) that types in after the panel reveals.
- Captions: configurable strings in a JS data array (easy swap).

#### S6 — Sinister Six (Row 2: Villains 4–6)
- 3 villain panels: `s6-v4.jpg`, `s6-v5.jpg`, `s6-v6.jpg`.
- Same ink-bleed entrance as S5.
- Large central quote `"YOU GUYS MOVE SURPRISINGLY WELL FOR PEOPLE WHO SPEND 90% OF THEIR TIME IN PRISON."` appears with a bold stagger — each word drops in with a slight delay.
- Panel captions per villain (configurable strings).

#### S7 — "Fell in Love ♡" (Love Section)
- Section title `"fell in love ♡"` in a softer, handwritten-style font — fades in with a soft glow.
- 3 panels: `s7-panel-1.jpg`, `s7-panel-2.jpg`, `s7-panel-3.jpg`.
- Panel 3 has a **golden decorative border** (ornate frame CSS effect).
- Panels slide in from bottom with staggered delay.
- Caption text for each panel types in after panel appears.
- `"Go Get'em Tiger"` caption appears with a glitch-flicker effect.

#### S8 — Spider Logo / Outro
- Full black screen.
- Spider-Man back logo SVG (`spider-logo.svg`) centered.
- A **white neon light traces the SVG path** — CSS `stroke-dashoffset` animation running on a loop (duration: 3s, ease-in-out, infinite).
- Subtle outer glow pulse (box-shadow / filter: drop-shadow) breathes in sync with the trace loop.
- No text. Pure logo. Forever.

---

### 4. Global Requirements

| Requirement | Spec |
|---|---|
| Scroll Engine | GSAP ScrollTrigger |
| Section height | 100vh each |
| Overflow | Hidden per section; body scroll drives animations |
| Font — Display | Bangers (Google Fonts) — comic headline |
| Font — Body/quotes | Permanent Marker or Caveat for handwritten feel |
| Font — Captions | Comic Neue |
| Color — Base | `#0a0a0a` near-black |
| Color — Accent Red | `#e62429` (Marvel red) |
| Color — Accent Blue | `#1d6fa4` (Spider-Man blue) |
| Color — Neon White | `#f0f0ff` |
| Responsive | Desktop primary; 768px breakpoint for mobile stacking |
| Asset folder | `/assets/` with subfolders `/panels/`, `/hero/`, `/logo/` |
| No audio | Phase 1 (audio hooks stubbed for Phase 2) |

---

### 5. Asset Manifest

| File | Used In | Notes |
|---|---|---|
| `hero-nosedive.webp` | S1 | Full-bleed parallax bg |
| `s2-panel-1.jpg` … `s2-panel-3.jpg` | S2 | Comic panels |
| `s3-panel-1.jpg` … `s3-panel-3.jpg` | S3 | Memory lane panels |
| `s4-panel-1.jpg`, `s4-panel-2.jpg` | S4 | Fight panels |
| `s5-v1.jpg` … `s5-v3.jpg` | S5 | Villain panels row 1 |
| `s6-v4.jpg` … `s6-v6.jpg` | S6 | Villain panels row 2 |
| `s7-panel-1.jpg` … `s7-panel-3.jpg` | S7 | Love arc panels |
| `spider-logo.svg` | S8 | Must have explicit `<path>` for stroke animation |

---

### 6. Out of Scope (Phase 1)

- Audio / sound effects
- Backend / CMS
- Navigation bar
- Mobile-specific gesture interactions
- Video backgrounds