import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { tokens } from '../styles/tokens';

/* ─────────────────────────────────────────────
   PRELOADER – Zero-break reveal

   The Hero always renders at full opacity behind
   this overlay. No React state sync needed.

   Flow:
   1) Wait for images + fonts to load
   2) White overlay + 3 fullscreen images + text
   3) GSAP morphs images/text toward hero positions
   4) Entire overlay (bg + elements) fades as one
      unit → hero crossfades in underneath
   5) Cleanup
   ───────────────────────────────────────────── */

const IMAGES = [
  'https://res.cloudinary.com/startplatz/image/upload/f_auto,q_auto,w_800/v1767662279/ai-hub/website/website_stock_images/EVENT-01.png',
  'https://res.cloudinary.com/startplatz/image/upload/f_auto,q_auto,w_800/v1767662282/ai-hub/website/website_stock_images/EVENT-03.png',
  'https://res.cloudinary.com/startplatz/image/upload/f_auto,q_auto,w_800/v1767662288/ai-hub/website/website_stock_images/EVENT-04.png',
];

const WORDS = ['STARTE', 'DEINE', 'KARRIERE', 'JETZT.'];

/* ── Styled ───────────────────────────────── */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #FFFFFF;
  pointer-events: all;
  will-change: opacity;
`;

const ImagePanel = styled.div`
  position: absolute;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.25) brightness(0.55);
  }
`;

const WordEl = styled.span`
  position: absolute;
  display: block;
  font-family: ${tokens.fonts.display};
  font-weight: ${tokens.fontWeights.black};
  text-transform: uppercase;
  letter-spacing: -0.03em;
  line-height: ${tokens.lineHeights.tight};
  color: #fff;
  white-space: nowrap;
  pointer-events: none;
  z-index: 2;
`;

/* ── Component ─────────────────────────────── */

export default function Preloader({ onComplete }) {
  const overlayRef = useRef(null);
  const panelRefs = useRef([]);
  const wordRefs = useRef([]);
  const [ready, setReady] = useState(false);
  const hasRun = useRef(false);

  /* Wait for BOTH images AND fonts to load */
  useEffect(() => {
    let cancelled = false;

    const waitForAssets = async () => {
      /* Load images */
      const imagePromises = IMAGES.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = img.onerror = resolve;
            img.src = src;
          })
      );

      /* Load fonts */
      const fontPromise = document.fonts?.ready || Promise.resolve();

      try {
        await Promise.all([...imagePromises, fontPromise]);
      } catch {
        /* proceed regardless */
      }

      if (!cancelled) setReady(true);
    };

    waitForAssets();

    /* Safety timeout */
    const safety = setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 4000);

    return () => {
      cancelled = true;
      clearTimeout(safety);
    };
  }, []);

  /* Animation */
  useEffect(() => {
    if (!ready || hasRun.current) return;
    hasRun.current = true;

    const run = async () => {
      const { gsap } = await import('gsap');
      const overlay = overlayRef.current;
      if (!overlay) return;

      /* Remove the HTML preloader immediately (our React overlay covers it) */
      const htmlPreloader = document.getElementById('preloader');
      if (htmlPreloader) htmlPreloader.remove();

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const panelW = vw / 3;

      /* ===== Layout images fullscreen ===== */
      panelRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, {
          left: i * panelW, top: 0,
          width: panelW + 1, height: vh,
          opacity: 1,
        });
      });

      /* ===== Layout text centred ===== */
      const fontSize = Math.min(vw * 0.1, 120);
      const lineH = fontSize * 1.05;
      const totalH = WORDS.length * lineH;
      const startY = (vh - totalH) / 2;

      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, {
          fontSize, left: '50%', xPercent: -50,
          top: startY + i * lineH,
          opacity: 0, y: 50, color: '#ffffff',
        });
      });

      const tl = gsap.timeline();

      /* ===== PHASE 1: Reveal text ===== */
      tl.to(wordRefs.current.filter(Boolean), {
        opacity: 1, y: 0,
        duration: 0.55, stagger: 0.09,
        ease: 'power3.out',
      }, 0.3);

      tl.addLabel('hold', '+=0.6');

      /* ===== PHASE 2: Morph ===== */
      const revealWrap = document.getElementById('hero-persona-reveal');
      const heroWordEls = document.querySelectorAll('[data-hero-word]');

      /* ---- Images → PersonaReveal area ---- */
      if (revealWrap && revealWrap.offsetWidth > 0) {
        const rr = revealWrap.getBoundingClientRect();
        const gap = 3;
        const pw = (rr.width - gap * 2) / 3;

        panelRefs.current.forEach((el, i) => {
          if (!el) return;
          tl.to(el, {
            left: rr.left + i * (pw + gap),
            top: rr.top,
            width: pw, height: rr.height,
            duration: 1.2, ease: 'power3.inOut',
          }, 'hold');
        });

        const imgs = panelRefs.current
          .map((p) => p?.querySelector('img'))
          .filter(Boolean);
        tl.to(imgs, {
          filter: 'saturate(0.05) brightness(0.5)',
          duration: 0.6,
        }, 'hold+=0.6');
      } else {
        /* Mobile: slide images up */
        panelRefs.current.forEach((el) => {
          if (!el) return;
          tl.to(el, {
            top: -vh, opacity: 0,
            duration: 1, ease: 'power3.inOut',
          }, 'hold');
        });
      }

      /* ---- Text → Hero headline area ---- */
      if (heroWordEls.length > 0) {
        wordRefs.current.forEach((el, i) => {
          if (!el) return;
          const target = heroWordEls[i];
          if (!target) return;
          const tr = target.getBoundingClientRect();
          const targetFS = parseFloat(window.getComputedStyle(target).fontSize);

          let color = tokens.colors.text;
          if (i === 2) color = tokens.colors.primary;
          if (i === 3) color = tokens.colors.textDim;

          tl.to(el, {
            left: tr.left, top: tr.top,
            xPercent: 0, fontSize: targetFS,
            color,
            duration: 1.2, ease: 'power3.inOut',
          }, 'hold');
        });
      } else {
        const fs = Math.min(vw * 0.12, 60);
        wordRefs.current.forEach((el, i) => {
          if (!el) return;
          tl.to(el, {
            left: 24, xPercent: 0,
            top: vh * 0.25 + i * fs * 1.1,
            fontSize: fs,
            color: i === 2 ? tokens.colors.primary : tokens.colors.text,
            duration: 1.2, ease: 'power3.inOut',
          }, 'hold');
        });
      }

      /* ===== PHASE 3: Crossfade – fade ENTIRE overlay as one unit ===== */
      /*
       * Do NOT hide preloader elements separately. Fade the entire
       * overlay (white bg + images + text) together. The hero underneath
       * crossfades in naturally. Zero break, zero white flash.
       */
      tl.to(overlay, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      });

      /* ===== Cleanup ===== */
      tl.call(() => {
        overlay.style.display = 'none';
        overlay.style.pointerEvents = 'none';
        onComplete?.();
      });
    };

    /* Wait one frame for Hero DOM to be fully painted */
    requestAnimationFrame(() => requestAnimationFrame(() => run()));
  }, [ready, onComplete]);

  return (
    <Overlay ref={overlayRef}>
      {IMAGES.map((src, i) => (
        <ImagePanel key={i} ref={(el) => (panelRefs.current[i] = el)}>
          <img src={src} alt="" loading="eager" />
        </ImagePanel>
      ))}
      {WORDS.map((word, i) => (
        <WordEl key={word} ref={(el) => (wordRefs.current[i] = el)}>
          {word}
        </WordEl>
      ))}
    </Overlay>
  );
}
