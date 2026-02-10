import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { tokens, media } from '../styles/tokens';
import PlanetSection from './PlanetSection';

/* ─────────────────────────────────────────────
   TARGET AUDIENCE – Three clean cards
   Light theme, no emojis.
   ───────────────────────────────────────────── */

const AUDIENCES = [
  {
    badge: '100 % Gefördert',
    title: 'Arbeitssuchende',
    description: 'Starte deine Karriere in der KI-Branche mit geförderten Weiterbildungen.',
    features: [
      '100 % gefördert durch Arbeitsagentur',
      'Praxisnahe Projekte',
      'Karriereberatung inklusive',
    ],
    cta: 'Förderung prüfen',
    color: tokens.colors.mint,
    colorBg: tokens.colors.mintBg,
    image: 'https://res.cloudinary.com/startplatz/image/upload/f_auto,q_auto,w_600/v1767662279/ai-hub/website/website_stock_images/EVENT-01.png',
  },
  {
    badge: 'Berufsbegleitend',
    title: 'Berufstätige',
    description: 'Erweitere deine Skills und bleibe relevant in der digitalen Transformation.',
    features: [
      'Flexible Abendkurse',
      'Zertifizierte Abschlüsse',
      'Netzwerk mit Experten',
    ],
    cta: 'Kurse entdecken',
    color: tokens.colors.navy,
    colorBg: tokens.colors.navyBg,
    image: 'https://res.cloudinary.com/startplatz/image/upload/f_auto,q_auto,w_600/v1767662282/ai-hub/website/website_stock_images/EVENT-03.png',
  },
  {
    badge: 'Inhouse',
    title: 'Unternehmen',
    description: 'Transformiere dein Team mit massgeschneiderten KI-Trainings.',
    features: [
      'Individuelle Curricula',
      'Inhouse-Trainings',
      'Change Management Support',
    ],
    cta: 'Beratung anfragen',
    color: tokens.colors.orange,
    colorBg: tokens.colors.orangeBg,
    image: 'https://res.cloudinary.com/startplatz/image/upload/f_auto,q_auto,w_600/v1767662288/ai-hub/website/website_stock_images/EVENT-04.png',
  },
];

/* ── Styled ────────────────────────────────── */

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${tokens.spacing.xl};
  ${media.md} { grid-template-columns: repeat(2, 1fr); }
  ${media.lg} { grid-template-columns: repeat(3, 1fr); }
`;

const Card = styled.article`
  position: relative;
  background: ${tokens.colors.surface};
  border: 1px solid ${tokens.colors.glassBorder};
  border-radius: ${tokens.radii.xl};
  overflow: hidden;
  transition: transform ${tokens.transitions.base}, box-shadow ${tokens.transitions.base};

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${tokens.shadows.cardHover};
  }
`;

const CardImage = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${tokens.transitions.slow};
  }

  ${Card}:hover & img { transform: scale(1.05); }

  &::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 60px;
    background: linear-gradient(transparent, ${tokens.colors.surface});
  }
`;

const CardBadge = styled.span`
  position: absolute;
  top: ${tokens.spacing.md};
  left: ${tokens.spacing.md};
  z-index: 2;
  padding: 4px 12px;
  font-family: ${tokens.fonts.mono};
  font-size: 10px;
  font-weight: ${tokens.fontWeights.semi};
  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};
  border-radius: ${tokens.radii.sm};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  backdrop-filter: blur(8px);
`;

const CardBody = styled.div`
  padding: ${tokens.spacing.lg} ${tokens.spacing.xl} ${tokens.spacing.xl};
`;

const CardTitle = styled.h3`
  font-family: ${tokens.fonts.display};
  font-size: ${tokens.fontSizes['2xl']};
  font-weight: ${tokens.fontWeights.bold};
  color: ${tokens.colors.text};
  margin-bottom: ${tokens.spacing.xs};
`;

const CardDesc = styled.p`
  font-size: ${tokens.fontSizes.sm};
  color: ${tokens.colors.textMuted};
  line-height: ${tokens.lineHeights.relaxed};
  margin-bottom: ${tokens.spacing.lg};
`;

const FeatureList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.sm};
  margin-bottom: ${tokens.spacing.xl};
`;

const Feature = styled.li`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  font-size: ${tokens.fontSizes.sm};
  color: ${tokens.colors.textSoft};

  &::before {
    content: '';
    display: block;
    width: 18px;
    height: 18px;
    border-radius: ${tokens.radii.sm};
    background: ${({ $color }) => `${$color}15`};
    border: 1.5px solid ${({ $color }) => `${$color}40`};
    flex-shrink: 0;
    position: relative;
  }

  /* Checkmark via border trick */
  &::after {
    content: '';
    position: absolute;
    margin-left: -14px;
    margin-top: 1px;
    width: 5px;
    height: 8px;
    border-right: 1.5px solid ${({ $color }) => $color};
    border-bottom: 1.5px solid ${({ $color }) => $color};
    transform: rotate(45deg);
  }
`;

const CardCTA = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  padding: 10px 24px;
  font-size: ${tokens.fontSizes.sm};
  font-weight: ${tokens.fontWeights.semi};
  color: #fff;
  background: ${({ $color }) => $color};
  border-radius: ${tokens.radii.md};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  transition: all ${tokens.transitions.fast};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px ${({ $color }) => `${$color}30`};
    color: #fff;
  }

  svg {
    width: 14px; height: 14px;
    transition: transform ${tokens.transitions.fast};
  }
  &:hover svg { transform: translateX(3px); }
`;

const StitchTop = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: repeating-linear-gradient(
    90deg,
    ${({ $color }) => $color} 0px,
    ${({ $color }) => $color} 6px,
    transparent 6px,
    transparent 12px
  );
  opacity: 0;
  transition: opacity ${tokens.transitions.base};
  ${Card}:hover & { opacity: 0.6; }
`;

const ArrowSVG = () => (
  <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h8.5m0 0L8 4.5m3.5 3.5L8 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

/* ── Component ─────────────────────────────── */

export default function TargetAudience() {
  const cardsRef = useRef([]);

  useEffect(() => {
    let ctx;
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.from(cardsRef.current, {
          y: 40,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current[0]?.parentElement,
            start: 'top 80%',
          },
        });
      });
    };
    init();
    return () => ctx?.revert();
  }, []);

  return (
    <PlanetSection
      id="weiterbildungen"
      badge="Für jeden das passende Angebot"
      title="Dein Weg in die <span>KI-Zukunft</span>"
      subtitle="Ob Quereinsteiger, Professional oder Enterprise – wir haben das richtige Programm für dich."
    >
      <Grid>
        {AUDIENCES.map((a, i) => (
          <Card key={a.title} ref={(el) => { cardsRef.current[i] = el; }}>
            <StitchTop $color={a.color} />
            <CardImage>
              <img src={a.image} alt={a.title} loading="lazy" width="600" height="400" />
              <CardBadge $color={a.color} $bg={a.colorBg}>{a.badge}</CardBadge>
            </CardImage>
            <CardBody>
              <CardTitle>{a.title}</CardTitle>
              <CardDesc>{a.description}</CardDesc>
              <FeatureList>
                {a.features.map((f) => <Feature key={f} $color={a.color}>{f}</Feature>)}
              </FeatureList>
              <CardCTA href="#newsletter" $color={a.color}>{a.cta}<ArrowSVG /></CardCTA>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </PlanetSection>
  );
}
