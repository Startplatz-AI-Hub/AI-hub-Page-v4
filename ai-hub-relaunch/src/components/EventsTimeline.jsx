import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { tokens, media } from '../styles/tokens';

/* ─────────────────────────────────────────────
   EVENTS TIMELINE – Video background section
   Draggable horizontal scroll via GSAP Draggable
   ───────────────────────────────────────────── */

const VIDEO_BG = 'https://res.cloudinary.com/startplatz/video/upload/v1767675544/ai-hub/website/Abstract_background_deep_1080p_202601060439.mp4';

const EVENTS = [
  {
    featured: true,
    date: 'FEB 03',
    title: 'KI-Manager Bootcamp',
    tags: ['AZAV', '12 Wochen'],
    description: 'Vollzeit-Weiterbildung zum zertifizierten KI-Manager. 100 % förderfähig.',
    location: 'Köln + Online',
    cta: 'Bewerben',
    image: 'https://res.cloudinary.com/startplatz/image/upload/f_auto,q_auto,w_600/v1767662279/ai-hub/website/website_stock_images/EVENT-01.png',
  },
  { date: 'FEB 15', title: 'ChatGPT für Business', tags: ['Workshop'], description: 'Praktische Anwendungen für Marketing & Sales.', location: 'Düsseldorf', cta: 'Anmelden' },
  { date: 'FEB 22', title: 'AI Meetup Köln #47', tags: ['Kostenlos'], description: 'Networking und Talks zu aktuellen KI-Trends.', location: 'Köln', cta: 'Join' },
  { date: 'MÄR 01', title: 'Machine Learning Basics', tags: ['Deep Dive', '2 Tage'], description: 'Von der Theorie zur Praxis – trainiere dein erstes ML-Modell.', location: 'Köln', cta: 'Anmelden' },
  { date: 'MÄR 10', title: 'AI Trends 2026', tags: ['Online'], description: 'Keynote: Die wichtigsten KI-Entwicklungen im neuen Jahr.', location: 'Livestream', cta: 'Register' },
];

/* ── Styles ────────────────────────────────── */

const Section = styled.section`
  position: relative;
  z-index: 1;
  padding: ${tokens.spacing.section} 0;
  overflow: hidden;
  /* Fallback dark bg while video loads */
  background: ${tokens.colors.dark};
`;

const VideoBg = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;

  video {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    transform: translate(-50%, -50%);
    object-fit: cover;
  }

  /* Dark overlay for content readability */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(10, 10, 10, 0.7) 0%,
      rgba(10, 10, 10, 0.5) 40%,
      rgba(10, 10, 10, 0.5) 60%,
      rgba(10, 10, 10, 0.75) 100%
    );
  }
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${tokens.spacing.lg};
  ${media.xl} { padding: 0 ${tokens.spacing['2xl']}; }
`;

const SectionBadge = styled.span`
  display: inline-block;
  padding: 5px 14px;
  font-family: ${tokens.fonts.mono};
  font-size: ${tokens.fontSizes.xs};
  font-weight: ${tokens.fontWeights.medium};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${tokens.colors.primaryLight};
  background: rgba(124, 58, 237, 0.12);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: ${tokens.radii.sm};
  margin-bottom: ${tokens.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-family: ${tokens.fonts.display};
  font-size: clamp(${tokens.fontSizes['3xl']}, 4vw, ${tokens.fontSizes['5xl']});
  font-weight: ${tokens.fontWeights.bold};
  color: ${tokens.colors.darkText};
  line-height: ${tokens.lineHeights.snug};
  margin-bottom: ${tokens.spacing.md};
  text-transform: uppercase;

  span {
    background: linear-gradient(135deg, ${tokens.colors.primaryLight}, ${tokens.colors.primaryMuted});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const SectionSubtitle = styled.p`
  font-size: ${tokens.fontSizes.lg};
  color: ${tokens.colors.darkMuted};
  margin-bottom: ${tokens.spacing['2xl']};
  max-width: 600px;
`;

const DragHint = styled.span`
  display: inline-block;
  font-family: ${tokens.fonts.mono};
  font-size: 10px;
  color: ${tokens.colors.darkMuted};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: ${tokens.spacing.md};
`;

const ScrollWrapper = styled.div`
  position: relative;
  z-index: 1;
  overflow: hidden;
  padding: 0 ${tokens.spacing.lg};
`;

const ScrollRow = styled.div`
  display: flex;
  gap: ${tokens.spacing.lg};
  cursor: grab;
  user-select: none;
  padding-bottom: ${tokens.spacing.md};

  &:active { cursor: grabbing; }
`;

const EventCard = styled.article`
  flex: 0 0 auto;
  width: 280px;
  background: rgba(20, 20, 20, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${tokens.radii.xl};
  overflow: hidden;
  transition: transform ${tokens.transitions.base}, border-color ${tokens.transitions.base},
              box-shadow ${tokens.transitions.base};

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(124, 58, 237, 0.3);
    box-shadow: 0 12px 40px rgba(124, 58, 237, 0.15);
  }

  ${({ $featured }) => $featured && css`
    width: 380px;
    border-color: rgba(124, 58, 237, 0.2);
  `}
`;

const CardImageWrap = styled.div`
  height: 160px;
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const CardBody = styled.div`
  padding: ${tokens.spacing.lg};
`;

const DateBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  font-family: ${tokens.fonts.mono};
  font-size: ${tokens.fontSizes.xs};
  font-weight: ${tokens.fontWeights.bold};
  color: ${tokens.colors.primaryLight};
  background: rgba(124, 58, 237, 0.15);
  border-radius: ${tokens.radii.sm};
  margin-bottom: ${tokens.spacing.sm};
`;

const TagRow = styled.div`
  display: flex; flex-wrap: wrap;
  gap: ${tokens.spacing.xs};
  margin-bottom: ${tokens.spacing.sm};
`;

const Tag = styled.span`
  padding: 2px 8px;
  font-size: 10px;
  font-weight: ${tokens.fontWeights.semi};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${tokens.colors.darkMuted};
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: ${tokens.radii.sm};
`;

const EventTitle = styled.h3`
  font-family: ${tokens.fonts.display};
  font-size: ${tokens.fontSizes.lg};
  font-weight: ${tokens.fontWeights.bold};
  color: ${tokens.colors.darkText};
  margin-bottom: ${tokens.spacing.xs};
`;

const EventDesc = styled.p`
  font-size: ${tokens.fontSizes.sm};
  color: ${tokens.colors.darkMuted};
  line-height: ${tokens.lineHeights.relaxed};
  margin-bottom: ${tokens.spacing.md};
`;

const LocationText = styled.span`
  display: block;
  font-size: ${tokens.fontSizes.xs};
  color: rgba(255,255,255,0.3);
  margin-bottom: ${tokens.spacing.md};
`;

const EventCTA = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  font-size: ${tokens.fontSizes.sm};
  font-weight: ${tokens.fontWeights.semi};
  color: #fff;
  background: ${tokens.colors.primary};
  border-radius: ${tokens.radii.md};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  transition: all ${tokens.transitions.fast};
  &:hover { background: ${tokens.colors.primaryHover}; color: #fff; }

  svg { width: 14px; height: 14px; }
`;

const AllLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: ${tokens.spacing.xl};
  font-size: ${tokens.fontSizes.sm};
  font-weight: ${tokens.fontWeights.semi};
  color: ${tokens.colors.primaryLight};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  &:hover { color: #fff; }

  svg { width: 14px; height: 14px; transition: transform ${tokens.transitions.fast}; }
  &:hover svg { transform: translateX(3px); }
`;

const ArrowSVG = () => (
  <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h8.5m0 0L8 4.5m3.5 3.5L8 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

/* ── Component ─────────────────────────────── */

export default function EventsTimeline() {
  const trackRef = useRef(null);
  const wrapperRef = useRef(null);

  /* GSAP Draggable for horizontal drag */
  useEffect(() => {
    let draggableInstance;
    const init = async () => {
      try {
        const { gsap } = await import('gsap');
        const { Draggable } = await import('gsap/Draggable');
        gsap.registerPlugin(Draggable);

        if (!trackRef.current || !wrapperRef.current) return;

        const trackWidth = trackRef.current.scrollWidth;
        const wrapperWidth = wrapperRef.current.offsetWidth;
        const maxDrag = -(trackWidth - wrapperWidth);

        draggableInstance = Draggable.create(trackRef.current, {
          type: 'x',
          bounds: { minX: maxDrag, maxX: 0 },
          edgeResistance: 0.85,
          cursor: 'grab',
          activeCursor: 'grabbing',
        })[0];
      } catch (e) {
        /* Fallback: native scroll still works */
      }
    };
    init();

    return () => {
      if (draggableInstance) draggableInstance.kill();
    };
  }, []);

  return (
    <Section id="events" aria-label="Events">
      {/* Video Background */}
      <VideoBg aria-hidden="true">
        <video autoPlay loop muted playsInline preload="auto">
          <source src={VIDEO_BG} type="video/mp4" />
        </video>
      </VideoBg>

      <Container>
        <SectionBadge>2026 Season</SectionBadge>
        <SectionTitle>Upcoming <span>Events</span></SectionTitle>
        <SectionSubtitle>Von Bootcamps über Workshops bis zu kostenlosen Meetups – finde dein nächstes Event.</SectionSubtitle>
        <DragHint>Drag to explore</DragHint>
      </Container>

      <ScrollWrapper ref={wrapperRef}>
        <ScrollRow ref={trackRef}>
          {EVENTS.map((ev) => (
            <EventCard key={ev.title} $featured={ev.featured}>
              {ev.image && <CardImageWrap><img src={ev.image} alt={ev.title} loading="lazy" width="600" height="360" /></CardImageWrap>}
              <CardBody>
                <DateBadge>{ev.date}</DateBadge>
                <TagRow>{ev.tags.map((t) => <Tag key={t}>{t}</Tag>)}</TagRow>
                <EventTitle>{ev.title}</EventTitle>
                <EventDesc>{ev.description}</EventDesc>
                <LocationText>{ev.location}</LocationText>
                <EventCTA href="#newsletter">{ev.cta} <ArrowSVG /></EventCTA>
              </CardBody>
            </EventCard>
          ))}
        </ScrollRow>
      </ScrollWrapper>

      <Container>
        <AllLink href="#">Alle Events <ArrowSVG /></AllLink>
      </Container>
    </Section>
  );
}
