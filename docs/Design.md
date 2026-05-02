# Design Document
## Friendly Neighbourhood Spider-Man — Visual & Interaction Design

---

### 1. Design Philosophy

**"Living Comic Book"** — The site behaves like a comic book that breathes. Each section is a splash page. Scrolling is the reader's hand turning pages. Animation is the ink coming alive.

The visual language straddles two worlds:
- **Dark cinematic base**: deep blacks, shadow-heavy photography, noir atmosphere.
- **Colorful comic pops**: halftone dots, ink-stamp numbers, speech bubbles, bold Marvel reds and blues that burst through the darkness on cue.

The user should feel like they are *inside* the comic, not looking at a website.

---

### 2. Color System

```
--color-void:        #0a0a0a   /* near-black — section backgrounds */
--color-ink:         #1a1a1a   /* panel borders, dividers */
--color-marvel-red:  #e62429   /* Spider-Man red, accent titles */
--color-spider-blue: #1d6fa4   /* Spider-Man blue, secondary accents */
--color-web-yellow:  #f5c518   /* highlight, comic number stamps */
--color-neon-white:  #f0f0ff   /* logo glow, S8 */
--color-panel-bg:    #111111   /* panel card backgrounds */
--color-text-light:  #f2f2f2   /* body text */
--color-caption:     #e0e0e0   /* caption text */
--color-glow-love:   #ff85a1   /* S7 pink glow */
```

---

### 3. Typography

| Role | Font | Weight | Usage |
|---|---|---|---|
| Hero Title | **Bangers** (Google) | 400 | "SPIDER-MAN", section titles |
| Comic Quotes | **Bangers** | 400 | Block quotes in S2–S6 |
| Handwritten | **Caveat** (Google) | 700 | S7 "fell in love ♡" |
| Speech Bubbles | **Comic Neue** (Google) | 700 | Bubble text |
| Captions | **Comic Neue** | 400 italic | Panel captions |
| Numbers | **Bangers** | 400 | Panel number stamps |

All fonts loaded via Google Fonts with `font-display: swap`.

---

### 4. Layout System

- **Section grid**: Each section is `100vw × 100vh`, `overflow: hidden`, `position: relative`.
- **Panel grid**: Comic panels use CSS Grid. 3-panel rows: `grid-template-columns: repeat(3, 1fr)`, gap `16px`. 2-panel rows: `repeat(2, 1fr)`.
- **Panel aspect ratio**: `aspect-ratio: 3/4` (portrait comic proportions). Object-fit: cover.
- **Panel borders**: `3px solid var(--color-ink)` with a subtle `box-shadow: 4px 4px 0 #000` (printed comic feel).
- **Z-index stack**: Background (0) → Panels (10) → Text overlays (20) → Bubbles (30) → Flash overlays (40).

---

### 5. Section-by-Section Design Spec

#### S1 — Hero
- **Layout**: Full bleed image. Text centered, stacked vertically.
- **"Friendly Neighbourhood"**: Font-size `clamp(2rem, 5vw, 4rem)`. Color `--color-text-light`. Letter-spacing `0.15em`. Text-shadow: red glow.
- **"SPIDER-MAN"**: Font-size `clamp(4rem, 12vw, 10rem)`. Color `--color-marvel-red`. Italic. Drop-shadow heavy.
- **Parallax**: `background-attachment: fixed` as CSS baseline; GSAP override for precision depth.
- **Overlay**: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)`.

#### S2 — The Bite
- **Background**: `--color-void`.
- **Panels**: Fly in from left/right/left. Border: `3px solid #333`. On entry, border briefly flashes `--color-marvel-red` then settles.
- **Number stamps**: Absolute positioned top-left. `background: --color-web-yellow`. `color: #000`. `font: Bangers 2rem`. Circular badge. Ink-drop animation (scale 0→1.2→1).
- **"OW!" bubble**: Classic oval speech bubble. White fill, thick black stroke. Rotated -8°. Bounce keyframe.
- **Quote**: `font: Bangers`, `font-size: clamp(2rem, 4vw, 3.5rem)`. Uppercase. Centered. Color: white. Appears below panels.

#### S3 — Great Power
- **Panels start**: `filter: grayscale(100%) brightness(0.7)`.
- **On scroll reveal**: `filter` transitions to `grayscale(0%) brightness(1)` over 600ms.
- **Flash overlay**: `position: absolute; inset: 0; background: white; opacity: 0`. Keyframe: `0%→0, 30%→0.7, 100%→0`. Duration 400ms. Fires once at panel 3 trigger.
- **Quote**: Typewriter effect via JS character-by-character insertion into a `<span>`. Cursor blinks.
- **Memory vignette**: Soft radial vignette on each panel (`box-shadow: inset 0 0 60px rgba(0,0,0,0.8)`).

#### S4 — Fight
- **Panels**: Center-zoom. Start `transform: scale(0.6) rotate(-2deg)`. End `scale(1) rotate(0)`. Spring easing (GSAP `elastic.out(1, 0.5)`).
- **Speech bubble**: SVG with `stroke-dasharray` and `stroke-dashoffset`. Stroke draws in first (600ms), then `fill` transitions from transparent to white (300ms).
- **"AND HERE SECONDS LATER…"**: Small caption strip at bottom. Comic Neue italic. Appears with 800ms delay after panels.

#### S5 — Sinister Six Row 1
- **Heading slam**: `translateY(-120px) → translateY(0)`. On landing: `@keyframes shockwave` — a radial circle div expands from behind the text and fades out.
- **Ink-bleed reveal**: Each panel masked with `clip-path: circle(0% at 50% 50%)` → `circle(150% at 50% 50%)`. GSAP tween, staggered 0.3s.
- **Captions**: Comic Neue, italic, white. Slide up from below panel edge 200ms after panel reveals.
- **Panel hover**: `transform: scale(1.03) rotate(1deg)`. Cursor: crosshair.

#### S6 — Sinister Six Row 2
- Same ink-bleed as S5.
- **Central quote**: `font: Bangers, 3rem`. Each word wrapped in `<span>`. GSAP stagger: each word `translateY(40px) opacity:0 → translateY(0) opacity:1`, 0.07s between words.

#### S7 — Love
- **Section title**: `font: Caveat 700`, `font-size: clamp(2.5rem, 6vw, 5rem)`. Color `--color-glow-love`. `text-shadow: 0 0 20px --color-glow-love`. Soft fade-in.
- **Panels**: Slide up from `translateY(80px) opacity:0` → `translateY(0) opacity:1`. Stagger 0.25s.
- **Panel 3 border**: CSS ornate frame — layered `outline` + `box-shadow` in gold `#d4af37`. Double-border effect.
- **"Go Get'em Tiger" caption**: Glitch effect — CSS `@keyframes glitch` alternating `clip-path` slices with `translateX` jitter. Loops 3×, then settles.
- **Heart ♡**: SVG heart next to title. Stroke-draw animation on section enter.

#### S8 — Logo
- **Background**: Pure `#000000`.
- **Logo**: SVG centered. `width: clamp(200px, 40vw, 400px)`.
- **Neon trace**: `stroke-dasharray: [total path length]; stroke-dashoffset: [total] → 0`. `animation: trace 3s ease-in-out infinite alternate`.
- **Glow pulse**: `filter: drop-shadow(0 0 8px #f0f0ff) drop-shadow(0 0 20px #f0f0ff)`. `@keyframes glow-pulse`: opacity/blur cycles 0.8→1→0.8 over 3s.
- **Background subtle**: Very faint spider web pattern CSS (repeating radial + linear gradients) at 3% opacity.

---

### 6. Motion Principles

| Principle | Rule |
|---|---|
| **Scroll is the trigger** | No auto-play animations except S1 load and S8 loop |
| **Each section different** | No two sections share the same entrance style |
| **Overshoots are good** | Use spring/elastic easing for comic energy |
| **Darkness first** | Elements start invisible/dark; light and color arrive on scroll |
| **Text after image** | Panels always appear before their associated text |

---

### 7. Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| `> 1024px` | Full desktop layout — 3-panel grids, large type |
| `768px–1024px` | Panels scale down, type slightly smaller |
| `< 768px` | Single column panels (stack vertically), reduced parallax, simplified animations |

---

### 8. Comic UI Elements Library

Reusable components to be built as standalone CSS/HTML primitives:

- `.speech-bubble` — oval, white fill, thick stroke, optional tail direction
- `.number-stamp` — circular badge, yellow bg, Bangers font
- `.panel-border` — 3px solid dark border + offset shadow
- `.ink-bleed-mask` — clip-path circle animation class
- `.typewriter-text` — JS-driven character-by-character reveal
- `.glitch-text` — CSS glitch keyframe class
- `.neon-glow` — drop-shadow filter animation