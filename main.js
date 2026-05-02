/* ================================================================
   SPIDER-MAN SCROLL EXPERIENCE — main.js
   Natural scroll. GSAP ScrollTrigger drives animations per-section.
   ================================================================ */
gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   UTILITIES
   ================================================================ */
function typewriter(elementId, text, speed = 42) {
  return new Promise((resolve) => {
    const el = document.getElementById(elementId);
    if (!el) { resolve(); return; }
    const str = text || '';
    let i = 0;
    el.textContent = '';
    const interval = setInterval(() => {
      el.textContent += str[i++];
      if (i >= str.length) { clearInterval(interval); resolve(); }
    }, speed);
  });
}

function flashOverlay(id) {
  const el = document.getElementById(id);
  if (!el) return;
  gsap.timeline()
    .to(el, { opacity: 0.72, duration: 0.15, ease: 'power2.out' })
    .to(el, { opacity: 0,    duration: 0.28, ease: 'power2.in'  });
}


/* ================================================================
   S1 — HERO
   Two layers:
   1. LOAD: Text fades in on page load.
   2. PARALLAX: As user scrolls DOWN through S1, the hero background
      (Spidey nosediving) moves upward at HALF the scroll speed.
      scrub:true = directly tied to scroll position — move mouse up/down
      and Spidey moves up/down in real time.
   ================================================================ */
(function initS1() {
  /* --- Text entrance on load --- */
  gsap.timeline({ delay: 0.3 })
    .to('#hero-subtitle', { opacity: 1, y: 0, duration: 1,   ease: 'power3.out' })
    .to('#hero-title',    { opacity: 1,        duration: 0.8, ease: 'power2.out' }, '-=0.4');

  /* --- Scroll-driven frame sequence on Canvas --- */
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const context = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
  });

  const frameCount = 60;
  const currentFrame = index => (
    `assets/hero/frames/frame_${index.toString().padStart(3, '0')}.webp`
  );

  const images = [];
  const seq = { frame: 0 };

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }

  images[0].onload = render;

  function render() {
    if (!images[seq.frame] || !images[seq.frame].complete) return;
    const img = images[seq.frame];
    
    // Draw with cover logic
    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;
    
    let drawWidth, drawHeight;
    if (canvasRatio > imgRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
    } else {
      drawWidth = canvas.height * imgRatio;
      drawHeight = canvas.height;
    }
    
    const x = (canvas.width - drawWidth) / 2;
    const y = (canvas.height - drawHeight) / 2;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, x, y, drawWidth, drawHeight);
  }

  // Unified timeline to pin the section, fade text, and scrub frames
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#section-1',
      start: 'top top',
      end: '+=150%', // Pin for 1.5x the viewport height
      scrub: 1, // Smooth scrub
      pin: true,
      onUpdate: render
    }
  });

  // Text fades out early
  tl.to('.hero-content', {
    opacity: 0,
    y: -60,
    duration: 0.3, // Takes 30% of the timeline
    ease: 'power1.inOut'
  }, 0);

  // Canvas animation runs the full duration
  tl.to(seq, {
    frame: frameCount - 1,
    snap: 'frame',
    duration: 1, // Takes 100% of the timeline
    ease: 'none'
  }, 0);
})();


/* ================================================================
   S2 — THE BITE THAT CHANGED EVERYTHING
   ================================================================ */
(function initS2() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#section-2',
      start:   'top 80%',
      toggleActions: 'play none none reverse'
    }
  });
  tl.fromTo('.s2-panel-1', { x: -220, rotation: -5, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, duration: 0.65, ease: 'back.out(1.7)' })
    .add(() => document.querySelector('.s2-panel-1')?.classList.add('flash-border'), '-=0.3')
    .to('.s2-panel-1 .number-stamp', { scale: 1, duration: 0.4,  ease: 'elastic.out(1.5,0.4)' }, '-=0.25')
    .to('#ow-bubble',                { scale: 1, duration: 0.5,  ease: 'elastic.out(1.8,0.4)' }, '-=0.15')

    .fromTo('.s2-panel-2', { x: 220, rotation: 5, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, duration: 0.65, ease: 'back.out(1.7)' }, '+=0.05')
    .add(() => document.querySelector('.s2-panel-2')?.classList.add('flash-border'), '-=0.3')
    .to('.s2-panel-2 .number-stamp', { scale: 1, duration: 0.4,  ease: 'elastic.out(1.5,0.4)' }, '-=0.25')

    .fromTo('.s2-panel-3', { x: -220, rotation: -5, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, duration: 0.65, ease: 'back.out(1.7)' }, '+=0.05')
    .add(() => document.querySelector('.s2-panel-3')?.classList.add('flash-border'), '-=0.3')
    .to('.s2-panel-3 .number-stamp', { scale: 1, duration: 0.4,  ease: 'elastic.out(1.5,0.4)' }, '-=0.25')

    .to('#s2-quote', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '+=0.2');
})();


/* ================================================================
   S3 — WITH GREAT POWER…COMES GREAT RESPONSIBILITY
   ================================================================ */
(function initS3() {
  let twFired = false, flashFired = false;
  gsap.set('.memory-panel', { filter: 'grayscale(100%) brightness(0.65)' });
  gsap.set('.s3-panel',     { opacity: 0 });

  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#section-3', start: 'top 80%', toggleActions: 'play none none reverse' }
  });
  tl.to('.s3-panel-1', { opacity: 1, duration: 0.5 })
    .to('.s3-panel-1 .memory-panel', { filter: 'grayscale(0%) brightness(1)', duration: 0.7, ease: 'power2.out' }, '-=0.3')
    .to('.s3-panel-1 .number-stamp', { scale: 1, duration: 0.35, ease: 'elastic.out(1.5,0.4)' }, '-=0.4')

    .to('.s3-panel-2', { opacity: 1, duration: 0.5 }, '+=0.1')
    .to('.s3-panel-2 .memory-panel', { filter: 'grayscale(0%) brightness(1)', duration: 0.7, ease: 'power2.out' }, '-=0.3')
    .to('.s3-panel-2 .number-stamp', { scale: 1, duration: 0.35, ease: 'elastic.out(1.5,0.4)' }, '-=0.4')

    .add(() => { if (!flashFired) { flashFired = true; flashOverlay('s3-flash'); } }, '+=0.05')

    .to('.s3-panel-3', { opacity: 1, duration: 0.5 }, '+=0.1')
    .to('.s3-panel-3 .memory-panel', { filter: 'grayscale(0%) brightness(1.05)', duration: 0.5, ease: 'power2.out' }, '-=0.3')
    .to('.s3-panel-3 .number-stamp', { scale: 1, duration: 0.35, ease: 'elastic.out(1.5,0.4)' }, '-=0.4')

    .add(() => {
      if (!twFired) {
        twFired = true;
        gsap.set('#s3-quote', { opacity: 1, y: 0 });
        typewriter('s3-typewriter', '"WITH GREAT POWER…COMES GREAT RESPONSIBILITY"', 42);
      }
    }, '+=0.3');
})();


/* ================================================================
   S4 — TO FIGHT… FOR WHAT'S RIGHT
   ================================================================ */
(function initS4() {
  gsap.set('.s4-panel-1', { scale: 0.65, rotation: -2 });
  gsap.set('.s4-panel-2', { scale: 0.65, rotation:  2 });

  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#section-4', start: 'top 80%', toggleActions: 'play none none reverse' }
  });
  tl.to('#s4-bubble-wrapper', { opacity: 1, duration: 0.3, ease: 'power2.out' })
    .to('#s4-bubble-ellipse', { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, '-=0.1')
    .to('#s4-bubble-ellipse', { fillOpacity: 1, duration: 0.35, ease: 'power2.out' })
    .to('.bubble-tail',       { fillOpacity: 1, duration: 0.2,  ease: 'power2.out' }, '-=0.2')
    .to('.bubble-text',       { opacity: 1,     duration: 0.3,  ease: 'power2.out' })
    .to('.s4-panel-1', { scale: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' }, '-=0.2')
    .to('.s4-panel-2', { scale: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' }, '-=0.6');
})();


/* ================================================================
   S5 — ENTER SINISTER SIX (Row 1)
   ================================================================ */
(function initS5() {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#section-5', start: 'top 80%', toggleActions: 'play none none reverse' }
  });
  tl.fromTo('#s5-heading', { y: -120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power4.out' })
    .fromTo('#s5-shockwave', { scale: 0, opacity: 0.8 }, { scale: 4, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.05')
    .to('.s5-v1 .ink-bleed-mask', { clipPath: 'circle(150% at 50% 50%)', duration: 0.7, ease: 'power2.out' }, '+=0.05')
    .to('#s5-cap-1', { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, '-=0.1')
    .to('.s5-v2 .ink-bleed-mask', { clipPath: 'circle(150% at 50% 50%)', duration: 0.7, ease: 'power2.out' }, '+=0.1')
    .to('#s5-cap-2', { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, '-=0.1')
    .to('.s5-v3 .ink-bleed-mask', { clipPath: 'circle(150% at 50% 50%)', duration: 0.7, ease: 'power2.out' }, '+=0.1')
    .to('#s5-cap-3', { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, '-=0.1');
})();


/* ================================================================
   S6 — SINISTER SIX (Row 2)
   ================================================================ */
(function initS6() {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#section-6', start: 'top 80%', toggleActions: 'play none none reverse' }
  });
  tl.to('.s6-v4 .ink-bleed-mask', { clipPath: 'circle(150% at 50% 50%)', duration: 0.7, ease: 'power2.out' })
    .to('#s6-cap-4', { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, '-=0.1')
    .to('.s6-v5 .ink-bleed-mask', { clipPath: 'circle(150% at 50% 50%)', duration: 0.7, ease: 'power2.out' }, '+=0.1')
    .to('#s6-cap-5', { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, '-=0.1')
    .to('.s6-v6 .ink-bleed-mask', { clipPath: 'circle(150% at 50% 50%)', duration: 0.7, ease: 'power2.out' }, '+=0.1')
    .to('#s6-cap-6', { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, '-=0.1')
    .to('.sinister-quote .word-drop', {
      y: 0, opacity: 1, stagger: 0.07, duration: 0.4, ease: 'back.out(1.5)'
    }, '+=0.2');
})();


/* ================================================================
   S7 — FELL IN LOVE ♡
   ================================================================ */
(function initS7() {
  gsap.set(['.s7-cap-1', '.s7-cap-2', '.s7-cap-3'], { opacity: 0, y: 20 });

  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#section-7', start: 'top 80%', toggleActions: 'play none none reverse' }
  });
  tl.to('.love-header', { opacity: 1, duration: 0.8, ease: 'power2.out' })
    .to('#heart-path', { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, '-=0.4')
    .to('#heart-path', { fill: '#ff85a1', fillOpacity: 0.7, duration: 0.4, ease: 'power2.out' }, '-=0.1')
    .to(['.s7-panel-1', '.s7-panel-2', '.s7-panel-3'], {
      y: 0, opacity: 1, stagger: 0.25, duration: 0.7, ease: 'power3.out'
    }, '-=0.2')
    .to('.s7-cap-1', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '+=0.05')
    .to('.s7-cap-2', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '+=0.05')
    .to('.s7-cap-3', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '+=0.05');
})();


/* ================================================================
   S8 — SPIDER LOGO NEON TRACE
   ================================================================ */
(function initS8() {
  const container = document.getElementById('spider-container');

  ScrollTrigger.create({
    trigger: '#section-8',
    start:   'top 85%',
    once:    true,
    onEnter: () => {
      gsap.to(container, {
        opacity: 1, scale: 1,
        duration: 1.2, ease: 'elastic.out(1, 0.6)'
      });
    }
  });

  gsap.set(container, { scale: 0.75, opacity: 0 });
})();


window.addEventListener('resize', () => ScrollTrigger.refresh());
