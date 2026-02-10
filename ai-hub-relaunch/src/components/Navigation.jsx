import React, { useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { tokens, media } from '../styles/tokens';

const LOGO_URL = 'https://res.cloudinary.com/startplatz/image/upload/v1735664652/ai-hub/Logos/Logos%20-%20Regular/Logo-Black.png';

const NAV_LINKS = [
  { label: 'Weiterbildungen', href: '#weiterbildungen' },
  { label: 'Für Unternehmen', href: '#unternehmen' },
  { label: 'Events',          href: '#events' },
  { label: 'Erfolge',         href: '#testimonials' },
  { label: 'Wissen',          href: '#stories' },
  { label: 'Über uns',        href: '#team' },
];

const Header = styled.header`
  position: fixed;
  top: 0; left: 0; width: 100%;
  z-index: ${tokens.zIndex.nav};
  transition: background ${tokens.transitions.base}, box-shadow ${tokens.transitions.base};
  padding: 0 ${tokens.spacing.lg};

  ${({ $scrolled }) => $scrolled && css`
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(20px) saturate(1.6);
    -webkit-backdrop-filter: blur(20px) saturate(1.6);
    box-shadow: 0 1px 0 rgba(0,0,0,0.06);
  `}
`;

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
`;

const Logo = styled.a`
  display: flex; align-items: center;
  text-decoration: none; z-index: 2;
  img { height: 34px; width: auto; }
`;

const DesktopNav = styled.nav`
  display: none;
  ${media.lg} { display: flex; align-items: center; gap: ${tokens.spacing.xl}; }
`;

const NavLink = styled.a`
  font-family: ${tokens.fonts.body};
  font-size: ${tokens.fontSizes.sm};
  font-weight: ${tokens.fontWeights.medium};
  color: ${tokens.colors.textMuted};
  text-decoration: none;
  position: relative;
  padding: ${tokens.spacing.xs} 0;
  transition: color ${tokens.transitions.fast};

  &::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0;
    width: 0; height: 2px;
    background: ${tokens.colors.primary};
    transition: width ${tokens.transitions.base};
  }

  &:hover {
    color: ${tokens.colors.text};
    &::after { width: 100%; }
  }
`;

const CTAButton = styled.a`
  display: none;
  ${media.lg} { display: inline-flex; }
  align-items: center;
  padding: 10px 20px;
  font-family: ${tokens.fonts.body};
  font-size: ${tokens.fontSizes.sm};
  font-weight: ${tokens.fontWeights.semi};
  color: #fff;
  background: ${tokens.colors.primary};
  border-radius: ${tokens.radii.md};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  transition: background ${tokens.transitions.fast}, transform ${tokens.transitions.fast};

  &:hover {
    background: ${tokens.colors.primaryHover};
    transform: translateY(-1px);
    color: #fff;
  }
`;

const Burger = styled.button`
  display: flex; flex-direction: column; gap: 5px;
  padding: ${tokens.spacing.sm}; z-index: 2;
  ${media.lg} { display: none; }

  span {
    display: block; width: 22px; height: 2px;
    background: ${tokens.colors.text};
    transition: transform ${tokens.transitions.base}, opacity ${tokens.transitions.fast};
  }

  ${({ $open }) => $open && css`
    span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    span:nth-child(2) { opacity: 0; }
    span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  `}
`;

const MobileOverlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(30px);
  z-index: 1;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: ${tokens.spacing['2xl']};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  transition: opacity ${tokens.transitions.slow}, visibility ${tokens.transitions.slow};
  ${media.lg} { display: none; }
`;

const MobileLink = styled.a`
  font-family: ${tokens.fonts.display};
  font-size: ${tokens.fontSizes['3xl']};
  font-weight: ${tokens.fontWeights.bold};
  color: ${tokens.colors.text};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  &:hover { color: ${tokens.colors.primary}; }
`;

const MobileCTA = styled.a`
  margin-top: ${tokens.spacing.lg};
  padding: 14px 32px;
  font-size: ${tokens.fontSizes.base};
  font-weight: ${tokens.fontWeights.semi};
  color: #fff;
  background: ${tokens.colors.primary};
  border-radius: ${tokens.radii.md};
  text-decoration: none;
  text-transform: uppercase;
  &:hover { background: ${tokens.colors.primaryHover}; color: #fff; }
`;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => { setScrolled(window.scrollY > 40); }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <Header $scrolled={scrolled} role="banner">
        <Inner>
          <Logo href="#" aria-label="STARTPLATZ AI Hub">
            <img src={LOGO_URL} alt="STARTPLATZ AI Hub Logo" width="200" height="34" loading="eager" />
          </Logo>
          <DesktopNav aria-label="Hauptnavigation">
            {NAV_LINKS.map((l) => <NavLink key={l.href} href={l.href}>{l.label}</NavLink>)}
          </DesktopNav>
          <CTAButton href="#newsletter">Beratung buchen</CTAButton>
          <Burger $open={mobileOpen} onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'} aria-expanded={mobileOpen}>
            <span /><span /><span />
          </Burger>
        </Inner>
      </Header>
      <MobileOverlay $open={mobileOpen} aria-hidden={!mobileOpen}>
        {NAV_LINKS.map((l) => <MobileLink key={l.href} href={l.href} onClick={closeMobile}>{l.label}</MobileLink>)}
        <MobileCTA href="#newsletter" onClick={closeMobile}>Beratung buchen</MobileCTA>
      </MobileOverlay>
    </>
  );
}
