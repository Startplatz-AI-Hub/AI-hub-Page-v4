import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { tokens } from '../styles/tokens';

/* ─────────────────────────────────────────────
   3D GRID BACKGROUND
   Perspective grid that recedes into depth.
   Parallax on scroll. Periodic pulse sweep.
   ───────────────────────────────────────────── */

const Canvas = styled.canvas`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
`;

export default function GridBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let scrollY = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onScroll = () => { scrollY = window.scrollY; };

    const draw = (time) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const gridSize = 60;
      const parallaxOffset = scrollY * 0.15;

      /* ── Draw vertical lines ─────────────── */
      const vanishY = h * 0.3 - parallaxOffset * 0.3;
      const vanishX = w * 0.5;

      ctx.lineWidth = 0.5;

      for (let x = 0; x <= w; x += gridSize) {
        /* Perspective: lines converge toward vanish point */
        const topX = vanishX + (x - vanishX) * 0.15;
        const topY = Math.max(vanishY, -200);

        const alpha = 0.04;
        ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x, h);
        ctx.lineTo(topX, topY);
        ctx.stroke();
      }

      /* ── Draw horizontal lines with perspective ── */
      const numHLines = 20;
      for (let i = 0; i <= numHLines; i++) {
        const t = i / numHLines;
        /* Exponential spacing for 3D depth feel */
        const depth = Math.pow(t, 2.2);
        const yPos = h - depth * (h - vanishY);
        const spread = 1 - depth * 0.85;

        const lx = vanishX - (w * 0.5) * spread * 1.5;
        const rx = vanishX + (w * 0.5) * spread * 1.5;

        const alpha = 0.035 * (1 - depth * 0.7);
        ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(lx, yPos);
        ctx.lineTo(rx, yPos);
        ctx.stroke();
      }

      /* ── Pulse sweep ─────────────────────── */
      const pulseInterval = 6000; // ms between pulses
      const pulseDuration = 2000;
      const pulsePhase = (time % pulseInterval) / pulseDuration;

      if (pulsePhase < 1) {
        const py = h * (1 - pulsePhase);
        const pulseAlpha = Math.sin(pulsePhase * Math.PI) * 0.08;

        const grad = ctx.createLinearGradient(0, py - 80, 0, py + 80);
        grad.addColorStop(0, 'rgba(124, 58, 237, 0)');
        grad.addColorStop(0.5, `rgba(124, 58, 237, ${pulseAlpha})`);
        grad.addColorStop(1, 'rgba(124, 58, 237, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, py - 80, w, 160);
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return <Canvas ref={canvasRef} aria-hidden="true" />;
}
