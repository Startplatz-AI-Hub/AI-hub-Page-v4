import React from 'react';
import styled from 'styled-components';
import { tokens, media } from '../styles/tokens';
import PlanetSection from './PlanetSection';

/* ─────────────────────────────────────────────
   VISION & CERTIFICATES – Light theme
   ───────────────────────────────────────────── */

const CERTS = [
  { src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', alt: 'Microsoft', w: 120 },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', alt: 'Google', w: 100 },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', alt: 'AWS', w: 90 },
];

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${tokens.spacing.xl};
  ${media.md} { grid-template-columns: 1fr 1fr; }
`;

const GlassCard = styled.div`
  position: relative;
  padding: ${tokens.spacing['2xl']};
  background: ${tokens.colors.surface};
  border: 1px solid ${tokens.colors.glassBorder};
  border-radius: ${tokens.radii.xl};
  box-shadow: ${tokens.shadows.card};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -1px; left: 0; right: 0;
    height: 3px;
    background: ${({ $gradient }) => $gradient || 'transparent'};
  }
`;

const CardBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  font-family: ${tokens.fonts.mono};
  font-size: ${tokens.fontSizes.xs};
  font-weight: ${tokens.fontWeights.medium};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${tokens.colors.primary};
  background: ${tokens.colors.primaryLighter};
  border-radius: ${tokens.radii.sm};
  margin-bottom: ${tokens.spacing.lg};
`;

const CardTitle = styled.h3`
  font-family: ${tokens.fonts.display};
  font-size: ${tokens.fontSizes['2xl']};
  font-weight: ${tokens.fontWeights.bold};
  color: ${tokens.colors.text};
  margin-bottom: ${tokens.spacing.md};
  ${media.lg} { font-size: ${tokens.fontSizes['3xl']}; }
`;

const CardText = styled.p`
  font-size: ${tokens.fontSizes.base};
  color: ${tokens.colors.textMuted};
  line-height: ${tokens.lineHeights.relaxed};
`;

const CertGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.spacing['2xl']};
  align-items: center;
  margin-top: ${tokens.spacing.xl};

  img {
    height: 26px;
    width: auto;
    opacity: 0.4;
    transition: opacity ${tokens.transitions.fast};
    filter: grayscale(1);
    &:hover { opacity: 0.8; filter: none; }
  }
`;

const QuoteMark = styled.div`
  position: absolute;
  top: ${tokens.spacing.xl};
  right: ${tokens.spacing.xl};
  font-family: ${tokens.fonts.display};
  font-size: 6rem;
  font-weight: ${tokens.fontWeights.black};
  color: ${tokens.colors.primaryLighter};
  line-height: 1;
  pointer-events: none;
  user-select: none;
`;

export default function VisionSection() {
  return (
    <PlanetSection id="vision">
      <Grid>
        <GlassCard $gradient={`linear-gradient(90deg, ${tokens.colors.primary}, ${tokens.colors.primaryMuted})`}>
          <QuoteMark>&ldquo;</QuoteMark>
          <CardBadge>Unsere Vision</CardBadge>
          <CardTitle>KI-Kompetenz für alle</CardTitle>
          <CardText>
            Wir glauben, dass künstliche Intelligenz keine Hürde, sondern eine Chance ist.
            Unser Ziel: Jeden Menschen befähigen, KI sinnvoll einzusetzen – für eine bessere
            Zukunft in der Arbeitswelt.
          </CardText>
        </GlassCard>

        <GlassCard $gradient={`linear-gradient(90deg, ${tokens.colors.mint}, ${tokens.colors.teal})`}>
          <CardBadge>Zertifikate</CardBadge>
          <CardTitle>Anerkannte Abschlüsse</CardTitle>
          <CardText>
            Unsere Programme sind durch führende Technologieunternehmen zertifiziert
            und von der Agentur für Arbeit anerkannt.
          </CardText>
          <CertGrid>
            {CERTS.map((c) => (
              <img key={c.alt} src={c.src} alt={c.alt} width={c.w} height="26" loading="lazy" />
            ))}
          </CertGrid>
        </GlassCard>
      </Grid>
    </PlanetSection>
  );
}
