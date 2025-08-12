// Design Tokens v1.3 modern UI system
// Use only semantic exports in components (avoid raw hex in JSX)

export const palette = {
  gray: {
    25: '#FCFCFD', 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155', 800: '#1E293B', 900: '#0F172A'
  },
  primary: {
    50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC', 400: '#818CF8', 500: '#6366F1', 600: '#5551E6', 700: '#4338CA', 800: '#3730A3', 900: '#272266'
  },
  accent: {
    50: '#FFF0FB', 100: '#FCE7F8', 200: '#F9D0F1', 300: '#F3AEE5', 400: '#EB85D7', 500: '#DD55C2', 600: '#C13BAA', 700: '#9B2C84', 800: '#781F64', 900: '#4F1242'
  },
  success: { 50: '#ECFDF5', 500: '#10B981', 600: '#059669', 700: '#047857' },
  warning: { 50: '#FFFBEB', 500: '#F59E0B', 600: '#D97706', 700: '#B45309' },
  danger:  { 50: '#FEF2F2', 500: '#EF4444', 600: '#DC2626', 700: '#B91C1C' },
  info:    { 50: '#EFF6FF', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8' },
  glow: '#6EE7FF'
};

export const radii = {
  xs: '4px',
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '18px',
  pill: '999px'
};

export const elevation = {
  xs: '0 1px 2px -1px rgba(15,23,42,0.08),0 0 0 1px rgba(15,23,42,0.04)',
  sm: '0 2px 4px -2px rgba(15,23,42,0.10),0 1px 3px -1px rgba(15,23,42,0.06)',
  md: '0 4px 12px -2px rgba(15,23,42,0.12),0 2px 6px -2px rgba(15,23,42,0.08)',
  lg: '0 8px 24px -4px rgba(15,23,42,0.16),0 4px 12px -4px rgba(15,23,42,0.10)',
  glow: '0 0 0 1px rgba(99,102,241,0.5),0 0 0 4px rgba(110,231,255,0.25)'
};

export const motion = {
  duration: { xs: 90, sm: 140, md: 220, lg: 360 }, // ms
  easing: {
    entrance: 'cubic-bezier(.42,.08,.2,1)',
    exit: 'cubic-bezier(.4,0,.2,1)',
    springy: 'cubic-bezier(.34,1.56,.64,1)'
  }
};

export const semantic = {
  bg: 'var(--color-bg)',
  bgAlt: 'var(--color-bg-alt)',
  surface: 'var(--color-surface)',
  surfaceAlt: 'var(--color-surface-alt)',
  border: 'var(--color-border)',
  text: 'var(--color-text)',
  textMuted: 'var(--color-text-muted)',
  primary: 'var(--color-primary)',
  accent: 'var(--color-accent)',
  focus: 'var(--color-focus)',
  ring: 'var(--color-ring)'
};

export const typography = {
  fontFamily: {
    heading: 'InterVariable, Inter, system-ui, sans-serif',
    body: 'IBM Plex Sans, system-ui, sans-serif',
    mono: 'JetBrains Mono, ui-monospace, SFMono-Regular'
  },
  weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem'
  },
  leading: {
    tight: 1.15,
    snug: 1.25,
    normal: 1.45,
    relaxed: 1.6
  }
};

// Utility: generate CSS variable declarations for injection (optional)
export function buildCssVariables(dark = false) {
  if (!dark) {
    return {
      '--color-bg': '#F8FAFC',
      '--color-bg-alt': '#EEF2FF',
      '--color-surface': 'rgba(255,255,255,0.85)',
      '--color-surface-alt': 'rgba(255,255,255,0.65)',
      '--color-border': 'rgba(100,116,139,0.18)',
      '--color-text': '#1E293B',
      '--color-text-muted': '#64748B',
      '--color-primary': palette.primary[500],
      '--color-accent': palette.accent[500],
      '--color-focus': palette.glow,
      '--color-ring': palette.primary[400]
    } as Record<string,string>;  
  }
  return {
    '--color-bg': '#0F172A',
    '--color-bg-alt': '#1E293B',
    '--color-surface': 'rgba(30,41,59,0.85)',
    '--color-surface-alt': 'rgba(51,65,85,0.55)',
    '--color-border': 'rgba(148,163,184,0.18)',
    '--color-text': '#F1F5F9',
    '--color-text-muted': '#94A3B8',
    '--color-primary': palette.primary[400],
    '--color-accent': palette.accent[600],
    '--color-focus': '#22D3EE',
    '--color-ring': palette.primary[500]
  } as Record<string,string>;
}

// Semantic spacing scale (align with Tailwind but explicit mapping)
export const spacing = {
  '0': 0,
  px: '1px',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem'
};

// Z-index layers for clarity
export const layers = {
  base: 0,
  header: 10,
  overlay: 40,
  modal: 50,
  toast: 60
};

// Focus ring style helper
export const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-ring)]';

// Export bundle
export const tokens = { palette, semantic, radii, elevation, motion, typography, spacing, layers };
export type Tokens = typeof tokens;
