import React from 'react';
import styled from 'styled-components';
import { tokens, media } from '../styles/tokens';

/* ─────────────────────────────────────────────
   FOOTER – Dark contrast section
   ───────────────────────────────────────────── */

const LOGO_URL = 'https://res.cloudinary.com/startplatz/image/upload/f_auto,q_auto,w_200/v1767628988/ai-hub/website/aihublogo02.png';

const LINK_GROUPS = [
  { title: 'Programme', links: [
    { label: 'AI Bootcamp', href: '#' },
    { label: 'Prompt Engineering', href: '#' },
    { label: 'Business AI', href: '#' },
    { label: 'Inhouse Training', href: '#' },
  ]},
  { title: 'Unternehmen', links: [
    { label: 'Über Uns', href: '#team' },
    { label: 'Team', href: '#team' },
    { label: 'Karriere', href: '#' },
    { label: 'Presse', href: '#' },
  ]},
  { title: 'Rechtliches', links: [
    { label: 'Impressum', href: '#' },
    { label: 'Datenschutz', href: '#' },
    { label: 'AGB', href: '#' },
  ]},
];

const Foot = styled.footer`
  position: relative;
  background: ${tokens.colors.dark};
  color: ${tokens.colors.darkText};
  padding: ${tokens.spacing['4xl']} ${tokens.spacing.lg} ${tokens.spacing['2xl']};
`;

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${tokens.spacing['3xl']};
  margin-bottom: ${tokens.spacing['3xl']};
  ${media.md} { grid-template-columns: 1.5fr repeat(3, 1fr); gap: ${tokens.spacing['2xl']}; }
`;

const BrandCol = styled.div`
  img { height: 32px; width: auto; margin-bottom: ${tokens.spacing.lg}; }
  p {
    font-size: ${tokens.fontSizes.sm};
    color: ${tokens.colors.darkMuted};
    line-height: ${tokens.lineHeights.relaxed};
    max-width: 300px;
    margin-bottom: ${tokens.spacing.xl};
  }
`;

const SocialRow = styled.div`
  display: flex;
  gap: ${tokens.spacing.md};
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px; height: 36px;
  border-radius: ${tokens.radii.full};
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  color: ${tokens.colors.darkMuted};
  font-size: ${tokens.fontSizes.xs};
  font-weight: ${tokens.fontWeights.bold};
  text-decoration: none;
  transition: all ${tokens.transitions.fast};

  &:hover {
    background: ${tokens.colors.primary};
    color: #fff;
    border-color: ${tokens.colors.primary};
    transform: translateY(-2px);
  }
`;

const LinkCol = styled.div`
  h4 {
    font-family: ${tokens.fonts.display};
    font-size: ${tokens.fontSizes.sm};
    font-weight: ${tokens.fontWeights.semi};
    color: ${tokens.colors.darkText};
    margin-bottom: ${tokens.spacing.lg};
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  ul { display: flex; flex-direction: column; gap: ${tokens.spacing.sm}; }
  a {
    font-size: ${tokens.fontSizes.sm};
    color: ${tokens.colors.darkMuted};
    text-decoration: none;
    transition: color ${tokens.transitions.fast};
    &:hover { color: #fff; }
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: rgba(255,255,255,0.08);
  margin-bottom: ${tokens.spacing.xl};
`;

const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.md};
  ${media.md} { flex-direction: row; justify-content: space-between; align-items: center; }
`;

const Copyright = styled.p`
  font-size: ${tokens.fontSizes.xs};
  color: rgba(255,255,255,0.35);
`;

const Contact = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.spacing.lg};
  font-size: ${tokens.fontSizes.xs};
  color: rgba(255,255,255,0.35);
  a { color: rgba(255,255,255,0.35); text-decoration: none; &:hover { color: ${tokens.colors.primaryLight}; } }
`;

export default function Footer() {
  return (
    <Foot role="contentinfo">
      <Inner>
        <TopGrid>
          <BrandCol>
            <img src={LOGO_URL} alt="STARTPLATZ AI Hub" width="200" height="32" loading="lazy" />
            <p>STARTPLATZ AI Hub – Dein Partner für KI-Weiterbildung in NRW. Geförderte Bootcamps, praxisnahe Kurse und eine starke Community.</p>
            <SocialRow>
              {[{ l: 'LinkedIn', i: 'in' }, { l: 'Instagram', i: 'ig' }, { l: 'YouTube', i: 'yt' }].map((s) => (
                <SocialLink key={s.l} href="#" aria-label={s.l}>{s.i}</SocialLink>
              ))}
            </SocialRow>
          </BrandCol>
          {LINK_GROUPS.map((g) => (
            <LinkCol key={g.title}>
              <h4>{g.title}</h4>
              <ul>{g.links.map((l) => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}</ul>
            </LinkCol>
          ))}
        </TopGrid>
        <Divider />
        <Bottom>
          <Copyright>&copy; 2026 STARTPLATZ AI Hub. Alle Rechte vorbehalten.</Copyright>
          <Contact>
            <span>Im Mediapark 5, 50670 Köln</span>
            <a href="tel:+49221123456">+49 221 123456</a>
            <a href="mailto:hello@ai-hub.de">hello@ai-hub.de</a>
          </Contact>
        </Bottom>
      </Inner>
    </Foot>
  );
}
