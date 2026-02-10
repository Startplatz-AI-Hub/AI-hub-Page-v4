import { createGlobalStyle } from 'styled-components';
import { tokens, media } from './tokens';

const GlobalStyles = createGlobalStyle`
  /* ── Reset ───────────────────────────────── */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: ${tokens.fonts.body};
    background: ${tokens.colors.pageBg};
    color: ${tokens.colors.text};
    line-height: ${tokens.lineHeights.normal};
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ── Accessibility ───────────────────────── */
  :focus-visible {
    outline: 2px solid ${tokens.colors.primary};
    outline-offset: 2px;
    border-radius: ${tokens.radii.sm};
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* ── Reduced motion ──────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* ── Typography ──────────────────────────── */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${tokens.fonts.display};
    font-weight: ${tokens.fontWeights.bold};
    line-height: ${tokens.lineHeights.tight};
    color: ${tokens.colors.text};
  }

  p {
    line-height: ${tokens.lineHeights.relaxed};
    color: ${tokens.colors.textSoft};
  }

  a {
    color: ${tokens.colors.primary};
    text-decoration: none;
    transition: color ${tokens.transitions.fast};

    &:hover {
      color: ${tokens.colors.primaryDark};
    }
  }

  img, video {
    max-width: 100%;
    height: auto;
    display: block;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
    color: inherit;
  }

  ul, ol {
    list-style: none;
  }

  /* ── Selection ───────────────────────────── */
  ::selection {
    background: ${tokens.colors.primaryLighter};
    color: ${tokens.colors.primaryDark};
  }

  /* ── Scrollbar ───────────────────────────── */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: ${tokens.colors.pageBg};
  }
  ::-webkit-scrollbar-thumb {
    background: ${tokens.colors.textDim};
    border-radius: ${tokens.radii.full};
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${tokens.colors.primary};
  }

  /* ── Utility ─────────────────────────────── */
  .container {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 ${tokens.spacing.lg};

    ${media.xl} {
      padding: 0 ${tokens.spacing['2xl']};
    }
  }
`;

export default GlobalStyles;
