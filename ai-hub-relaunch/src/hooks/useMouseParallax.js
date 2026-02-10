import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook: tracks mouse position normalised to [-1, 1]
 * and provides smooth lerped values for parallax effects.
 *
 * @param {number} smoothing  – lerp factor (0 = frozen, 1 = instant). Default 0.08
 * @returns {{ x: number, y: number, rawX: number, rawY: number }}
 */
export default function useMouseParallax(smoothing = 0.08) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  const handleMouseMove = useCallback((e) => {
    target.current = {
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * smoothing;
      current.current.y += (target.current.y - current.current.y) * smoothing;
      setPos({ x: current.current.x, y: current.current.y });
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(raf.current);
    };
  }, [handleMouseMove, smoothing]);

  return {
    x: pos.x,
    y: pos.y,
    rawX: target.current.x,
    rawY: target.current.y,
  };
}
