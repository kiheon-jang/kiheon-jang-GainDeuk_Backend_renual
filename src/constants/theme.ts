import { COLORS, FONT_SIZES, SPACING, BREAKPOINTS } from './index';

export const theme = {
  colors: {
    primary: COLORS.PRIMARY,
    secondary: COLORS.SECONDARY,
    danger: COLORS.DANGER,
    warning: COLORS.WARNING,
    gray: {
      50: COLORS.GRAY_50,
      100: COLORS.GRAY_100,
      200: COLORS.GRAY_200,
      400: COLORS.GRAY_400,
      500: COLORS.GRAY_500,
      600: COLORS.GRAY_600,
      700: COLORS.GRAY_700,
      300: COLORS.GRAY_300,
      900: COLORS.GRAY_900,
    },
    background: {
      primary: COLORS.BG_PRIMARY,
      secondary: COLORS.BG_SECONDARY,
      dark: COLORS.BG_DARK,
    },
  },
  fonts: {
    family: {
      primary: "'Noto Sans KR', sans-serif",
    },
    size: FONT_SIZES,
  },
  spacing: SPACING,
  breakpoints: BREAKPOINTS,
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
} as const;

export type Theme = typeof theme;
