import { 
  COLORS, 
  FONT_SIZES, 
  BREAKPOINTS, 
  BORDER_RADIUS, 
  SHADOWS, 
  DARK_SHADOWS,
  TRANSITIONS,
  ANIMATIONS,
  SPACING,
  THEME_MODES
} from './index';

// 라이트 테마
export const lightTheme = {
  mode: THEME_MODES.LIGHT,
  colors: {
    primary: COLORS.PRIMARY,
    secondary: COLORS.SECONDARY,
    danger: COLORS.DANGER,
    warning: COLORS.WARNING,
    success: COLORS.SUCCESS,
    info: COLORS.INFO,
    accent: COLORS.ACCENT,
    gray: {
      50: COLORS.GRAY_50,
      100: COLORS.GRAY_100,
      200: COLORS.GRAY_200,
      300: COLORS.GRAY_300,
      400: COLORS.GRAY_400,
      500: COLORS.GRAY_500,
      600: COLORS.GRAY_600,
      700: COLORS.GRAY_700,
      800: COLORS.GRAY_800,
      900: COLORS.GRAY_900,
    },
    background: {
      primary: COLORS.BG_PRIMARY,
      secondary: COLORS.BG_SECONDARY,
      tertiary: COLORS.BG_TERTIARY,
    },
    text: {
      primary: COLORS.GRAY_900,
      secondary: COLORS.GRAY_600,
      tertiary: COLORS.GRAY_500,
      inverse: COLORS.GRAY_50,
    },
    border: {
      primary: COLORS.GRAY_200,
      secondary: COLORS.GRAY_300,
      focus: COLORS.PRIMARY,
    },
  },
  fonts: {
    family: {
      primary: '"Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    size: FONT_SIZES,
    weight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: SPACING,
  breakpoints: BREAKPOINTS,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  transitions: TRANSITIONS,
  animations: ANIMATIONS,
};

// 다크 테마
export const darkTheme = {
  mode: THEME_MODES.DARK,
  colors: {
    primary: COLORS.PRIMARY,
    secondary: COLORS.SECONDARY,
    danger: COLORS.DANGER,
    warning: COLORS.WARNING,
    success: COLORS.SUCCESS,
    info: COLORS.INFO,
    accent: COLORS.ACCENT,
    gray: {
      50: COLORS.DARK_GRAY_50,
      100: COLORS.DARK_GRAY_100,
      200: COLORS.DARK_GRAY_200,
      300: COLORS.DARK_GRAY_300,
      400: COLORS.DARK_GRAY_400,
      500: COLORS.DARK_GRAY_500,
      600: COLORS.DARK_GRAY_600,
      700: COLORS.DARK_GRAY_700,
      800: COLORS.DARK_GRAY_800,
      900: COLORS.DARK_GRAY_900,
    },
    background: {
      primary: COLORS.DARK_BG_PRIMARY,
      secondary: COLORS.DARK_BG_SECONDARY,
      tertiary: COLORS.DARK_BG_TERTIARY,
    },
    text: {
      primary: COLORS.DARK_GRAY_900,
      secondary: COLORS.DARK_GRAY_600,
      tertiary: COLORS.DARK_GRAY_500,
      inverse: COLORS.DARK_GRAY_50,
    },
    border: {
      primary: COLORS.DARK_GRAY_200,
      secondary: COLORS.DARK_GRAY_300,
      focus: COLORS.PRIMARY,
    },
  },
  fonts: {
    family: {
      primary: '"Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    size: FONT_SIZES,
    weight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: SPACING,
  breakpoints: BREAKPOINTS,
  borderRadius: BORDER_RADIUS,
  shadows: DARK_SHADOWS,
  transitions: TRANSITIONS,
  animations: ANIMATIONS,
};

// 기본 테마 (라이트)
export const theme = lightTheme;

// 테마 타입 (유니온 타입으로 수정)
export type Theme = typeof lightTheme | typeof darkTheme;