import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { tokens, media } from '../styles/tokens';

/* ─────────────────────────────────────────────
   KPI SECTION – Angular, bold, brand-matching
   
   Parallelogram accents + dramatic numbers +
   scroll-triggered count-up via IntersectionObserver.
   Inspired by awwwards stats sections.
   ───────────────────────────────────────────── */

const KPIS = [
  { value: 2000, suffix: '+', label: 'Eventteilnehmer', accent: 'Seit 2023' },
  { value: 95,   suffix: '%', label: 'Zufriedenheit', accent: 'Kursteilnehmer' },
  { value: 150,  suffix: '+', label: 'Dozenten & Experten', accent: 'Netzwerk' },
  { value: 50,   suffix: '+', label: 'Partner-Unternehmen', accent: 'Kooperationen' },
];

/* ── Animations ───────────────────────────── */

const shimmer = keyframes`
  0% { transform: translateX(-100%) skewX(-12deg); }
  100% { transform: translateX(200%) skewX(-12deg); }
`;

/* ── Styles ────────────────────────────────── */

const Section = styled.section`
  position: relative;
  z-index: 1;
  padding: ${tokens.spacing.section} 0;
  overflow: hidden;
`;

/* Decorative skewed stripe across the section */
const SkewStripe = styled.div`
  position: absolute;
  top: 0;
  left: -5%;
  right: -5%;
  height: 100%;
  background: linear-gradient(
    135deg,
    ${tokens.colors.primaryLighter} 0%,
    transparent 40%,
    transparent 60%,
    ${tokens.colors.primaryLighter} 100%
  );
  opacity: 0.35;
  transform: skewY(-2deg);
  pointer-events: none;
`;

const Inner = styled.div`
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${tokens.spacing.lg};
  ${media.xl} { padding: 0 ${tokens.spacing['2xl']}; }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${tokens.spacing['3xl']};
`;

const SectionLabel = styled.span`
  display: inline-block;
  padding: 5px 16px;
  font-family: ${tokens.fonts.mono};
  font-size: ${tokens.fontSizes.xs};
  font-weight: ${tokens.fontWeights.semi};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${tokens.colors.primary};
  background: ${tokens.colors.primaryLighter};
  border: 1px solid rgba(124, 58, 237, 0.12);
  border-radius: ${tokens.radii.sm};
  margin-bottom: ${tokens.spacing.md};
`;

const SectionTitle = styled.h2`
  font-family: ${tokens.fonts.display};
  font-size: clamp(${tokens.fontSizes['3xl']}, 4vw, ${tokens.fontSizes['5xl']});
  font-weight: ${tokens.fontWeights.bold};
  color: ${tokens.colors.text};
  text-transform: uppercase;
  letter-spacing: -0.02em;
  
  span {
    background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryMuted});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${tokens.spacing.xl};
  
  ${media.sm} { grid-template-columns: repeat(2, 1fr); }
  ${media.lg} { grid-template-columns: repeat(4, 1fr); }
`;

const KPICard = styled.div`
  position: relative;
  padding: ${tokens.spacing['2xl']} ${tokens.spacing.xl};
  background: ${tokens.colors.surface};
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform ${tokens.transitions.base}, border-color ${tokens.transitions.base},
              box-shadow ${tokens.transitions.base};

  /* Angular top accent – parallelogram shape */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${tokens.colors.primary}, ${tokens.colors.primaryMuted});
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Shimmer sweep on hover */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.04), transparent);
    opacity: 0;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(124, 58, 237, 0.15);
    box-shadow: ${tokens.shadows.cardHover};
    
    &::before { transform: scaleX(1); }
    &::after {
      opacity: 1;
      animation: ${shimmer} 1.2s ease-out;
    }
  }

  /* Diagonal cut on bottom-right corner */
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%);
`;

const AccentTag = styled.span`
  display: inline-block;
  font-family: ${tokens.fonts.mono};
  font-size: 10px;
  font-weight: ${tokens.fontWeights.medium};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${tokens.colors.primary};
  opacity: 0.7;
  margin-bottom: ${tokens.spacing.md};
`;

const ValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 2px;
  margin-bottom: ${tokens.spacing.sm};
`;

const Value = styled.span`
  font-family: ${tokens.fonts.display};
  font-size: clamp(${tokens.fontSizes['5xl']}, 7vw, 5.5rem);
  font-weight: ${tokens.fontWeights.black};
  line-height: 1;
  letter-spacing: -0.04em;
  color: ${tokens.colors.text};
  
  ${media.lg} {
    font-size: clamp(${tokens.fontSizes['4xl']}, 4.5vw, 5.5rem);
  }
`;

const Suffix = styled.span`
  font-family: ${tokens.fonts.display};
  font-size: clamp(${tokens.fontSizes['2xl']}, 3vw, ${tokens.fontSizes['4xl']});
  font-weight: ${tokens.fontWeights.bold};
  color: ${tokens.colors.primary};
  line-height: 1;
`;

const Label = styled.span`
  display: block;
  font-family: ${tokens.fonts.body};
  font-size: ${tokens.fontSizes.sm};
  font-weight: ${tokens.fontWeights.medium};
  color: ${tokens.colors.textMuted};
  line-height: ${tokens.lineHeights.normal};
`;

/* Decorative parallelogram shape in background of each card */
const ParallelogramDecor = styled.div`
  position: absolute;
  bottom: -10px;
  right: -8px;
  width: 80px;
  height: 80px;
  background: ${tokens.colors.primaryLighter};
  opacity: 0.4;
  transform: skewX(-12deg);
  pointer-events: none;
  transition: opacity ${tokens.transitions.base};

  ${KPICard}:hover & {
    opacity: 0.7;
  }
`;

/* ── Counter Hook ──────────────────────────── */

function useCountUp(end, duration = 2200) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const startTime = performance.now();
    const step = (t) => {
      const progress = Math.min((t - startTime) / duration, 1);
      /* ease-out cubic */
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(end * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) animate(); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [animate]);

  return { count, ref };
}

/* ── KPI Item ──────────────────────────────── */

function KPIItem({ value, suffix, label, accent }) {
  const { count, ref } = useCountUp(value, 2400);

  return (
    <KPICard ref={ref}>
      <ParallelogramDecor />
      <AccentTag>{accent}</AccentTag>
      <ValueRow>
        <Value>{count.toLocaleString('de-DE')}</Value>
        <Suffix>{suffix}</Suffix>
      </ValueRow>
      <Label>{label}</Label>
    </KPICard>
  );
}

/* ── Section ───────────────────────────────── */

export default function KPISection() {
  return (
    <Section aria-label="Kennzahlen">
      <SkewStripe aria-hidden="true" />
      <Inner>
        <SectionHeader>
          <SectionLabel>Zahlen &amp; Fakten</SectionLabel>
          <SectionTitle>Was uns <span>antreibt</span></SectionTitle>
        </SectionHeader>
        <Grid>
          {KPIS.map((kpi) => (
            <KPIItem key={kpi.label} {...kpi} />
          ))}
        </Grid>
      </Inner>
    </Section>
  );
}
