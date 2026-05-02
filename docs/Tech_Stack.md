# Tech Stack Document
## Friendly Neighbourhood Spider-Man — Technical Architecture

---

### 1. Stack Decision Summary

| Layer | Choice | Rationale |
|---|---|---|
| **Structure** | Pure HTML5 | Zero build overhead; asset-swap friendly; works by opening index.html |
| **Styling** | CSS3 + Custom Properties | Full control; no framework bloat; comic effects are CSS-native |
| **Animation** | GSAP 3 + ScrollTrigger | Industry gold standard for scroll-driven animation; best spring physics; battle-tested performance |
| **Fonts** | Google Fonts | Bangers, Caveat, Comic Neue — all free, CDN-hosted |
| **SVG** | Inline SVG | Required for stroke-dashoffset path animation (S8 logo, S4 bubble) |
| **Bundler** | None (Phase 1) | Pure static files; drop assets and open in browser |

**Why not React/Next.js?** This is a scroll-driven storytelling experience, not a data-driven app. HTML+GSAP is leaner, faster to iterate, and has zero build pipeline friction — critical for asset-swapping workflow.

**Why GSAP over CSS-only or Framer Motion?**
- ScrollTrigger plugin is purpose-built for this exact use case (pinning, scrubbing, staggering on scroll).
- Spring/elastic easings out of the box — essential for comic energy.
- `gsap.timeline()` lets us sequence panel → number → caption → quote precisely.
- No React dependency required.

---

### 2. File Structure

```
/spider-man-site/
│
├── index.html              # Single page — all 8 sections
├── style.css               # Global styles + CSS variables
├── main.js                 # All GSAP ScrollTrigger logic
│
├── /assets/
│   ├── /hero/
│   │   └── hero-nosedive.webp
│   ├── /panels/
│   │   ├── s2-panel-1.jpg … s2-panel-3.jpg
│   │   ├── s3-panel-1.jpg … s3-panel-3.jpg
│   │   ├── s4-panel-1.jpg, s4-panel-2.jpg
│   │   ├── s5-v1.jpg … s5-v3.jpg
│   │   ├── s6-v4.jpg … s6-v6.jpg
│   │   └── s7-panel-1.jpg … s7-panel-3.jpg
│   └── /logo/
│       └── spider-logo.svg  # Must have explicit <path> with measurable length
│
└── /fonts/                 # Optional local fallback (Google Fonts CDN preferred)
```

---

### 3. Dependencies (CDN — no install required)

```html
<!-- GSAP Core + ScrollTrigger -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Bangers&family=Caveat:wght@700&family=Comic+Neue:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
```

No npm. No node_modules. No build step.

---

### 4. GSAP Architecture

#### Plugin Registration
```javascript
gsap.registerPlugin(ScrollTrigger);
```

#### Per-Section ScrollTrigger Pattern
```javascript
// Each section gets its own timeline + ScrollTrigger
const s2Timeline = gsap.timeline({
  scrollTrigger: {
    trigger: '#section-2',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: false,       // false = play-once on enter; true = scrub with scroll
    toggleActions: 'play none none reverse'
  }
});

s2Timeline
  .from('.s2-panel-1', { x: -200, rotation: -5, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' })
  .from('.s2-number-1', { scale: 0, duration: 0.3, ease: 'elastic.out(1.5, 0.5)' }, '-=0.2')
  .from('.s2-panel-2', { x: 200, rotation: 5, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' }, '+=0.1')
  // … etc
```

#### ScrollTrigger Modes by Section

| Section | `scrub` | Reason |
|---|---|---|
| S1 parallax | `true` | Continuous depth — tied directly to scroll position |
| S2, S3, S4 | `false` | Play-once comic panel entrance — no re-scrub |
| S5, S6 | `false` | Ink-bleed fires once per villain |
| S7 | `false` | Love panels slide in once |
| S8 | CSS loop | Pure CSS animation — no ScrollTrigger needed |

---

### 5. CSS Architecture

#### Custom Properties (`:root`)
```css
:root {
  --color-void: #0a0a0a;
  --color-ink: #1a1a1a;
  --color-marvel-red: #e62429;
  --color-spider-blue: #1d6fa4;
  --color-web-yellow: #f5c518;
  --color-neon-white: #f0f0ff;
  --color-panel-bg: #111111;
  --color-text-light: #f2f2f2;
  --color-caption: #e0e0e0;
  --color-glow-love: #ff85a1;

  --font-display: 'Bangers', cursive;
  --font-handwritten: 'Caveat', cursive;
  --font-comic: 'Comic Neue', cursive;

  --section-height: 100vh;
  --panel-border: 3px solid #333;
  --panel-shadow: 4px 4px 0 #000;
}
```

#### Global Resets
```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: auto; } /* GSAP controls scroll — disable CSS smooth scroll */
body { background: var(--color-void); overflow-x: hidden; }
section { width: 100vw; min-height: var(--section-height); overflow: hidden; position: relative; }
```

---

### 6. S8 Logo Animation — Technical Detail

The spider logo SVG **must** have a single continuous `<path>` element. After asset drop:

```javascript
// Measure path length (run once in browser console)
const path = document.querySelector('#spider-logo path');
console.log(path.getTotalLength()); // e.g., 842
```

Then in CSS:
```css
#spider-logo path {
  stroke: var(--color-neon-white);
  stroke-width: 2;
  fill: none;
  stroke-dasharray: 842;       /* replace with measured value */
  stroke-dashoffset: 842;
  filter: drop-shadow(0 0 6px #f0f0ff) drop-shadow(0 0 16px #f0f0ff);
  animation: trace 3s ease-in-out infinite alternate, glow-pulse 3s ease-in-out infinite;
}

@keyframes trace {
  to { stroke-dashoffset: 0; }
}

@keyframes glow-pulse {
  0%, 100% { filter: drop-shadow(0 0 4px #f0f0ff) drop-shadow(0 0 10px #f0f0ff); }
  50%       { filter: drop-shadow(0 0 12px #f0f0ff) drop-shadow(0 0 30px #f0f0ff); }
}
```

---

### 7. Performance Considerations

| Concern | Solution |
|---|---|
| Image loading | `loading="lazy"` on all panel `<img>` tags; hero preloaded |
| GSAP performance | All animations use `transform` + `opacity` — GPU-composited, no layout thrash |
| WebP hero | Native browser support; no polyfill needed for modern browsers |
| Font flash | `font-display: swap` via Google Fonts URL param |
| Scroll jank | `will-change: transform` on parallax layer only |

---

### 8. Browser Support

| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full (test clip-path on iOS) |
| Edge 90+ | ✅ Full |
| IE 11 | ❌ Not supported |

---

### 9. Asset Drop Checklist (When Ready)

1. Drop `hero-nosedive.webp` → `/assets/hero/`
2. Drop all panel JPGs → `/assets/panels/` (names must match manifest in PRD)
3. Drop `spider-logo.svg` → `/assets/logo/`
4. Open browser console → measure logo path length → update `stroke-dasharray` value in `style.css`
5. Open `index.html` in browser — all animations fire immediately

---

### 10. Future Phase Hooks (Already Stubbed)

- **Audio**: `<audio id="ambient-sfx" src="" preload="none">` tag in HTML ready for src drop
- **Cursor**: Custom spider cursor CSS class `.spider-cursor` in stylesheet (commented out)
- **Preloader**: `#preloader` div present in HTML, hidden by default