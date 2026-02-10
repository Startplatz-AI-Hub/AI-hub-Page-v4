/* ─────────────────────────────────────────────
   DESIGN TOKENS  –  Single Source of Truth
   STARTPLATZ AI Hub Relaunch

   Brand: Angular, sharp edges, bold.
   Logo: Black + vivid purple parallelogram.
   No pill shapes. No soft circles.
   ───────────────────────────────────────────── */

export const tokens = {
  colors: {
    // Brand primary – vivid purple matching logo parallelogram
    primary:       '#7C3AED',
    primaryHover:  '#6D28D9',
    primaryLight:  '#A78BFA',
    primaryLighter:'#EDE9FE',
    primaryDark:   '#5B21B6',
    primaryMuted:  '#8B5CF6',

    // Accent – persona-coded
    mint:   '#059669',
    mintBg: '#ECFDF5',
    navy:   '#2563EB',
    navyBg: '#EFF6FF',
    orange: '#EA580C',
    orangeBg: '#FFF7ED',

    coral:  '#E11D48',
    teal:   '#0D9488',
    amber:  '#D97706',

    // Page backgrounds
    pageBg:      '#F0ECF5',
    surface:     '#FFFFFF',
    surfaceAlt:  '#F8F6FB',
    surfaceHover:'#F3F0F7',

    // Text
    text:      '#0F0F0F',
    textSoft:  '#2D2D2D',
    textMuted: '#5C5C5C',
    textDim:   '#9CA3AF',

    // Glass / card
    glass:       'rgba(255, 255, 255, 0.72)',
    glassBorder: 'rgba(0, 0, 0, 0.07)',
    glassDark:   'rgba(255, 255, 255, 0.9)',

    // Dark section
    dark:     '#0A0A0A',
    darkMid:  '#141414',
    darkText: '#F5F5F5',
    darkMuted:'#8A8A8A',

    // Glow
    glow:       'rgba(124, 58, 237, 0.10)',
    glowMint:   'rgba(5, 150, 105, 0.08)',
    glowNavy:   'rgba(37, 99, 235, 0.08)',
    glowOrange: 'rgba(234, 88, 12, 0.08)',
  },

  fonts: {
    display: "'Outfit', sans-serif",
    body:    "'Inter', sans-serif",
    mono:    "'JetBrains Mono', monospace",
  },

  fontSizes: {
    xs:   '0.75rem',
    sm:   '0.875rem',
    base: '1rem',
    lg:   '1.125rem',
    xl:   '1.25rem',
    '2xl':'1.5rem',
    '3xl':'1.875rem',
    '4xl':'2.25rem',
    '5xl':'3rem',
    '6xl':'3.75rem',
    '7xl':'4.5rem',
    hero: 'clamp(3.25rem, 8vw, 7.5rem)',
  },

  fontWeights: {
    regular: 400,
    medium:  500,
    semi:    600,
    bold:    700,
    extra:   800,
    black:   900,
  },

  lineHeights: {
    tight:  1.05,
    snug:   1.2,
    normal: 1.5,
    relaxed:1.65,
  },

  spacing: {
    xs:   '0.25rem',
    sm:   '0.5rem',
    md:   '1rem',
    lg:   '1.5rem',
    xl:   '2rem',
    '2xl':'3rem',
    '3xl':'4rem',
    '4xl':'6rem',
    '5xl':'8rem',
    section: 'clamp(5rem, 12vh, 10rem)',
  },

  /* ── SHARP RADII – matching angular brand ── */
  radii: {
    none: '0',
    xs:   '2px',
    sm:   '3px',
    md:   '4px',
    lg:   '6px',
    xl:   '8px',
    '2xl':'10px',
    full: '9999px', // only for dots/indicators, NOT buttons
  },

  breakpoints: {
    sm:   '640px',
    md:   '768px',
    lg:   '1024px',
    xl:   '1280px',
    '2xl':'1536px',
  },

  transitions: {
    fast:   '150ms ease',
    base:   '300ms ease',
    slow:   '500ms ease',
    spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: '600ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  },

  shadows: {
    sm:      '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)',
    md:      '0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)',
    lg:      '0 12px 32px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)',
    xl:      '0 24px 48px rgba(0,0,0,0.10)',
    card:    '0 2px 8px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.06)',
    cardHover:'0 8px 24px rgba(124,58,237,0.10), 0 20px 60px rgba(0,0,0,0.08)',
  },

  zIndex: {
    behind:  -1,
    base:     0,
    raised:  10,
    nav:     50,
    overlay: 100,
    modal:   200,
    toast:   300,
  },
};

export const media = {
  sm:   `@media (min-width: ${tokens.breakpoints.sm})`,
  md:   `@media (min-width: ${tokens.breakpoints.md})`,
  lg:   `@media (min-width: ${tokens.breakpoints.lg})`,
  xl:   `@media (min-width: ${tokens.breakpoints.xl})`,
  '2xl':`@media (min-width: ${tokens.breakpoints['2xl']})`,
  hover: '@media (hover: hover)',
  motion:'@media (prefers-reduced-motion: no-preference)',
};
