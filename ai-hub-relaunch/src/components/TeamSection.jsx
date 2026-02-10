import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { tokens, media } from '../styles/tokens';
import PlanetSection from './PlanetSection';

/* ─────────────────────────────────────────────
   TEAM SECTION – Light theme, no emojis
   ───────────────────────────────────────────── */

const TEAM = [
  { name: 'Jakow', role: 'AI Strategist', image: 'https://res.cloudinary.com/startplatz/image/upload/f_auto,q_auto,w_300/v1767714994/ai-hub/website/website_stock_images/Jakow_website_portait.png' },
  { name: 'Lukas', role: 'Tech Lead', image: 'https://res.cloudinary.com/startplatz/image/upload/f_auto,q_auto,w_300/v1767714990/ai-hub/website/website_stock_images/Lukas_website_portrait.png' },
  { name: 'Lorenz', role: 'Innovation Manager', image: 'https://res.cloudinary.com/startplatz/image/upload/f_auto,q_auto,w_300/v1767714988/ai-hub/website/website_stock_images/Lorenz_website_portrait.png' },
  { name: 'Martin', role: 'Head of Education', image: 'https://res.cloudinary.com/startplatz/image/upload/f_auto,q_auto,w_300/v1767714992/ai-hub/website/website_stock_images/Martin_website_portrait.png' },
];

const LOCATIONS = [
  { city: 'Düsseldorf', image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=600&q=80&auto=format' },
  { city: 'Köln', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80&auto=format' },
];

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${tokens.spacing.lg};
  margin-bottom: ${tokens.spacing['3xl']};
  ${media.md} { grid-template-columns: repeat(4, 1fr); }
`;

const MemberCard = styled.div`
  position: relative;
  border-radius: ${tokens.radii.xl};
  overflow: hidden;
  aspect-ratio: 3 / 4;
  background: ${tokens.colors.surfaceAlt};
  box-shadow: ${tokens.shadows.sm};
  transition: transform ${tokens.transitions.base}, box-shadow ${tokens.transitions.base};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${tokens.shadows.cardHover};
    img { transform: scale(1.04); }
  }
`;

const MemberImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${tokens.transitions.slow};
`;

const MemberInfo = styled.div`
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: ${tokens.spacing.lg};
  background: linear-gradient(transparent, rgba(15, 23, 42, 0.8));

  h4 {
    font-family: ${tokens.fonts.display};
    font-size: ${tokens.fontSizes.lg};
    font-weight: ${tokens.fontWeights.bold};
    color: #fff;
    margin-bottom: 2px;
  }

  span {
    font-size: ${tokens.fontSizes.xs};
    color: ${tokens.colors.primaryLight};
    font-family: ${tokens.fonts.mono};
    letter-spacing: 0.05em;
  }
`;

const LocationRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${tokens.spacing.lg};
  ${media.md} { grid-template-columns: repeat(2, 1fr); }
`;

const LocationCard = styled.div`
  position: relative;
  border-radius: ${tokens.radii.xl};
  overflow: hidden;
  height: 200px;
  box-shadow: ${tokens.shadows.sm};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.7);
    transition: transform ${tokens.transitions.slow};
  }

  &:hover img { transform: scale(1.04); }
`;

const LocationLabel = styled.div`
  position: absolute;
  bottom: ${tokens.spacing.lg};
  left: ${tokens.spacing.lg};

  span {
    font-family: ${tokens.fonts.display};
    font-size: ${tokens.fontSizes['2xl']};
    font-weight: ${tokens.fontWeights.bold};
    color: #fff;
  }
`;

export default function TeamSection() {
  const gridRef = useRef(null);

  useEffect(() => {
    let ctx;
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from('.team-card', {
          y: 30, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        });
      });
    };
    init();
    return () => ctx?.revert();
  }, []);

  return (
    <PlanetSection
      id="team"
      badge="Unser Netzwerk"
      title="Experten, die <span>begeistern</span>"
      subtitle="Über 150 Dozenten und Mentoren aus der Praxis. Führende KI-Experten, Tech-Pioniere und erfahrene Coaches."
    >
      <TeamGrid ref={gridRef}>
        {TEAM.map((m) => (
          <MemberCard key={m.name} className="team-card">
            <MemberImage src={m.image} alt={m.name} loading="lazy" width="300" height="400" />
            <MemberInfo><h4>{m.name}</h4><span>{m.role}</span></MemberInfo>
          </MemberCard>
        ))}
      </TeamGrid>
      <LocationRow>
        {LOCATIONS.map((l) => (
          <LocationCard key={l.city} className="team-card">
            <img src={l.image} alt={`Standort ${l.city}`} loading="lazy" width="600" height="200" />
            <LocationLabel><span>{l.city}</span></LocationLabel>
          </LocationCard>
        ))}
      </LocationRow>
    </PlanetSection>
  );
}
