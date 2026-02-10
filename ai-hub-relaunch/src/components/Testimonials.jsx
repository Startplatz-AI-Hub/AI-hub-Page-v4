import React from 'react';
import styled from 'styled-components';
import { tokens, media } from '../styles/tokens';
import PlanetSection from './PlanetSection';

/* ─────────────────────────────────────────────
   TESTIMONIALS – Smaller, compact video grid
   ───────────────────────────────────────────── */

const VIDEOS = [
  { title: 'Thomas – Vom Lehrer zum KI-Entwickler', thumb: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80&auto=format', featured: true },
  { title: 'Sarah – Mein Weg ins Tech-Startup', thumb: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format' },
  { title: 'Michael – Warum sich der Kurs lohnt', thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format' },
  { title: 'Julia – KI im Marketing nutzen', thumb: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&auto=format' },
  { title: 'Tutorial – 100 % gefördert', thumb: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80&auto=format' },
  { title: 'Einblick – Campus Tour Köln', thumb: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80&auto=format' },
];

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${tokens.spacing.sm};

  ${media.md} {
    grid-template-columns: repeat(3, 1fr);
    gap: ${tokens.spacing.md};
  }

  ${media.lg} {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: auto auto;
  }
`;

const VideoCard = styled.article`
  position: relative;
  border-radius: ${tokens.radii.lg};
  overflow: hidden;
  aspect-ratio: 16 / 11;
  cursor: pointer;
  box-shadow: ${tokens.shadows.sm};
  transition: transform ${tokens.transitions.base}, box-shadow ${tokens.transitions.base};

  &:hover {
    transform: scale(1.03);
    box-shadow: ${tokens.shadows.cardHover};
    img { transform: scale(1.06); }
    .play-btn { transform: translate(-50%, -50%) scale(1.1); }
  }

  ${({ $featured }) => $featured && `
    grid-column: span 2;
    aspect-ratio: 16 / 9;
  `}
`;

const Thumb = styled.img`
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform ${tokens.transitions.slow};
`;

const Overlay = styled.div`
  position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(10,10,10,0.7) 100%);
`;

const PlayBtn = styled.div.attrs({ className: 'play-btn' })`
  position: absolute;
  top: 42%; left: 50%;
  transform: translate(-50%, -50%);
  width: 40px; height: 40px;
  background: rgba(255,255,255,0.92);
  border-radius: ${tokens.radii.md};
  display: flex; align-items: center; justify-content: center;
  box-shadow: ${tokens.shadows.md};
  transition: transform ${tokens.transitions.base};

  &::after {
    content: '';
    display: block;
    width: 0; height: 0;
    border-style: solid;
    border-width: 6px 0 6px 10px;
    border-color: transparent transparent transparent ${tokens.colors.primary};
    margin-left: 2px;
  }
`;

const VideoTitle = styled.h3`
  position: absolute;
  bottom: ${tokens.spacing.md};
  left: ${tokens.spacing.md};
  right: ${tokens.spacing.md};
  z-index: 2;
  font-family: ${tokens.fonts.display};
  font-size: ${tokens.fontSizes.xs};
  font-weight: ${tokens.fontWeights.semi};
  color: #fff;
  line-height: ${tokens.lineHeights.snug};
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

export default function Testimonials() {
  return (
    <PlanetSection
      id="testimonials"
      badge="Was Teilnehmer sagen"
      title="Echte <span>Erfolgsgeschichten</span>"
    >
      <Grid>
        {VIDEOS.map((v) => (
          <VideoCard key={v.title} $featured={v.featured} tabIndex={0} role="button" aria-label={`Video: ${v.title}`}>
            <Thumb src={v.thumb} alt={v.title} loading="lazy" width="400" height="250" />
            <Overlay />
            <PlayBtn />
            <VideoTitle>{v.title}</VideoTitle>
          </VideoCard>
        ))}
      </Grid>
    </PlanetSection>
  );
}
