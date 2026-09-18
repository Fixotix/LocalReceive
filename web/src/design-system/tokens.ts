export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const radius = {
  xs: '6px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
  round: '28px',
  full: '9999px',
} as const;

export const darkPalette = {
  background: '#0D0D0E',
  backgroundSecondary: '#161618',
  surface: 'rgba(28, 28, 30, 0.85)',
  surfaceSecondary: 'rgba(44, 44, 46, 0.75)',
  surfaceElevated: 'rgba(58, 58, 60, 0.85)',
  label: '#FFFFFF',
  secondaryLabel: '#8E8E93',
  tertiaryLabel: '#636366',
  separator: 'rgba(84, 84, 88, 0.45)',
  accent: '#E5A93C', // Warm Apple Notes Amber / Yellow
  accentMuted: 'rgba(229, 169, 60, 0.2)',
  blue: '#0A84FF',
  destructive: '#FF453A',
  destructiveMuted: 'rgba(255, 69, 58, 0.2)',
  success: '#30D158',
  warning: '#FF9F0A',
  glass: {
    background: 'rgba(28, 28, 30, 0.65)',
    border: 'rgba(255, 255, 255, 0.14)',
    highlight: 'rgba(255, 255, 255, 0.22)',
    shadow: 'rgba(0, 0, 0, 0.45)',
    blurTint: 'dark' as const,
  },
};

export const lightPalette = {
  background: '#F2F2F7',
  backgroundSecondary: '#E5E5EA',
  surface: 'rgba(255, 255, 255, 0.85)',
  surfaceSecondary: 'rgba(242, 242, 247, 0.8)',
  surfaceElevated: 'rgba(255, 255, 255, 0.95)',
  label: '#000000',
  secondaryLabel: '#6C6C70',
  tertiaryLabel: '#8E8E93',
  separator: 'rgba(60, 60, 67, 0.18)',
  accent: '#D9981E', // Apple Notes Gold
  accentMuted: 'rgba(217, 152, 30, 0.15)',
  blue: '#007AFF',
  destructive: '#FF3B30',
  destructiveMuted: 'rgba(255, 59, 48, 0.12)',
  success: '#34C759',
  warning: '#FF9500',
  glass: {
    background: 'rgba(255, 255, 255, 0.72)',
    border: 'rgba(255, 255, 255, 0.6)',
    highlight: 'rgba(255, 255, 255, 0.9)',
    shadow: 'rgba(0, 0, 0, 0.08)',
    blurTint: 'light' as const,
  },
};

export type ThemePalette = typeof darkPalette;
