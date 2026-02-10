import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { tokens, media } from '../styles/tokens';

/* ─────────────────────────────────────────────
   PLANET SECTION – Reusable wrapper
   No opacity:0 GSAP from-animations.
   Uses only translateY for safe entrance.
   ───────────────────────────────────────────── */

const Wrapper = styled.section`
  position: relative;
  z-index: 1;
  padding: ${tokens.spacing.section} 0;
  overflow: hidden;
`;

const GlowLine = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  max-width: 700px;
  height: 1px;
  background: ${({ $accent }) =>
    `linear-gradient(90deg, transparent, ${$accent || 'rgba(0,0,0,0.06)'}, transparent)`};
`;

const Container = styled.div`
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${tokens.spacing.lg};
  ${media.xl} { padding: 0 ${tokens.spacing['2xl']}; }
`;

const GridHighlight = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

const Stitch = styled.div`
  position: absolute;
  bottom: -${tokens.spacing.section};
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: ${tokens.spacing.section};
  pointer-events: none;
  ${({ $hidden }) => $hidden && css`display: none;`}

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      180deg,
      ${tokens.colors.textDim} 0px,
      ${tokens.colors.textDim} 3px,
      transparent 3px,
      transparent 8px
    );
    opacity: 0.15;
  }
`;

const SectionBadge = styled.span`
  display: inline-block;
  padding: 5px 14px;
  font-family: ${tokens.fonts.mono};
  font-size: ${tokens.fontSizes.xs};
  font-weight: ${tokens.fontWeights.medium};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ $color }) => $color || tokens.colors.primary};
  background: ${({ $color }) => $color ? `${$color}10` : tokens.colors.primaryLighter};
  border: 1px solid ${({ $color }) => $color ? `${$color}20` : 'rgba(99,102,241,0.12)'};
  border-radius: ${tokens.radii.sm};
  margin-bottom: ${tokens.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-family: ${tokens.fonts.display};
  font-size: clamp(${tokens.fontSizes['3xl']}, 4vw, ${tokens.fontSizes['5xl']});
  font-weight: ${tokens.fontWeights.bold};
  color: ${tokens.colors.text};
  line-height: ${tokens.lineHeights.snug};
  margin-bottom: ${tokens.spacing.md};

  span {
    background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryMuted});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const SectionSubtitle = styled.p`
  font-size: clamp(${tokens.fontSizes.base}, 1.5vw, ${tokens.fontSizes.lg});
  color: ${tokens.colors.textMuted};
  line-height: ${tokens.lineHeights.relaxed};
  max-width: 640px;
  margin-bottom: ${tokens.spacing['2xl']};
`;

export default function PlanetSection({
  id, badge, title, subtitle,
  accent, showStitch = true, children,
}) {
  const sectionRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -300, y: -300 });

  const handleMouseMove = useCallback((e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  /* Safe scroll entrance: only translateY, no opacity changes */
  useEffect(() => {
    let ctx;
    const init = async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          gsap.from(sectionRef.current, {
            y: 40,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          });
        }, sectionRef);
      } catch (e) {
        /* Graceful fallback: section renders fine without animation */
      }
    };
    init();
    return () => ctx?.revert();
  }, []);

  return (
    <Wrapper
      ref={sectionRef}
      id={id}
      onMouseMove={handleMouseMove}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <GlowLine $accent={accent} />

      <GridHighlight>
        <div
          style={{
            position: 'absolute',
            left: mousePos.x - 250,
            top: mousePos.y - 250,
            width: 500, height: 500,
            background: `radial-gradient(circle, ${accent || 'rgba(99,102,241,0.04)'}, transparent 70%)`,
            transition: 'left 0.3s ease-out, top 0.3s ease-out',
            pointerEvents: 'none',
          }}
        />
      </GridHighlight>

      <Container>
        {badge && <SectionBadge $color={accent}>{badge}</SectionBadge>}
        {title && (
          <SectionTitle id={id ? `${id}-title` : undefined} dangerouslySetInnerHTML={{ __html: title }} />
        )}
        {subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}
        {children}
      </Container>

      <Stitch $hidden={!showStitch} />
    </Wrapper>
  );
}
