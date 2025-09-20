import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    mode: 'light' | 'dark';
    colors: {
      primary: string;
      secondary: string;
      danger: string;
      warning: string;
      success: string;
      info: string;
      accent: string;
      gray: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
      };
      background: {
        primary: string;
        secondary: string;
        tertiary: string;
      };
      text: {
        primary: string;
        secondary: string;
        tertiary: string;
        inverse: string;
      };
      border: {
        primary: string;
        secondary: string;
        focus: string;
      };
    };
    fonts: {
      family: {
        primary: string;
      };
      size: {
        XS: string;
        SM: string;
        BASE: string;
        LG: string;
        XL: string;
        '2XL': string;
        '3XL': string;
        '4XL': string;
      };
      weight: {
        normal: number;
        medium: number;
        semibold: number;
        bold: number;
      };
    };
    spacing: {
      XS: string;
      SM: string;
      MD: string;
      LG: string;
      XL: string;
      '2XL': string;
      '3XL': string;
      '4XL': string;
    };
    breakpoints: {
      SM: string;
      MD: string;
      LG: string;
      XL: string;
      '2XL': string;
    };
    borderRadius: {
      SM: string;
      MD: string;
      LG: string;
      XL: string;
      FULL: string;
    };
    shadows: {
      SM: string;
      MD: string;
      LG: string;
      XL: string;
      '2XL': string;
      INNER: string;
    };
    transitions: {
      FAST: string;
      NORMAL: string;
      SLOW: string;
    };
    animations: {
      DURATION: {
        FAST: string;
        NORMAL: string;
        SLOW: string;
      };
      EASING: {
        EASE_IN: string;
        EASE_OUT: string;
        EASE_IN_OUT: string;
        BOUNCE: string;
      };
    };
  }
}
