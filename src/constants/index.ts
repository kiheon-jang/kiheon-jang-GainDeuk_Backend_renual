// API 관련 상수
export const API_BASE_URL = 'http://localhost:3000/api';

// 라우트 경로
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
  TRADING: '/trading',
  PROFILE: '/profile',
  COINS: '/coins',
  SETTINGS: '/settings',
} as const;

// 색상 팔레트
export const COLORS = {
  // 메인 색상
  PRIMARY: '#3B82F6',      // 파란색 - 신뢰감
  SECONDARY: '#10B981',    // 초록색 - 수익
  DANGER: '#EF4444',       // 빨간색 - 손실
  WARNING: '#F59E0B',      // 주황색 - 주의
  SUCCESS: '#10B981',      // 성공
  INFO: '#3B82F6',         // 정보
  ACCENT: '#8B5CF6',       // 강조색
  
  // 중성 색상 (라이트 모드)
  GRAY_50: '#F9FAFB',
  GRAY_100: '#F3F4F6',
  GRAY_200: '#E5E7EB',
  GRAY_300: '#D1D5DB',
  GRAY_400: '#9CA3AF',
  GRAY_500: '#6B7280',
  GRAY_600: '#4B5563',
  GRAY_700: '#374151',
  GRAY_800: '#1F2937',
  GRAY_900: '#111827',
  
  // 다크모드 색상
  DARK_GRAY_50: '#18181B',
  DARK_GRAY_100: '#27272A',
  DARK_GRAY_200: '#3F3F46',
  DARK_GRAY_300: '#52525B',
  DARK_GRAY_400: '#71717A',
  DARK_GRAY_500: '#A1A1AA',
  DARK_GRAY_600: '#D4D4D8',
  DARK_GRAY_700: '#E4E4E7',
  DARK_GRAY_800: '#F4F4F5',
  DARK_GRAY_900: '#FAFAFA',
  
  // 배경 (라이트 모드)
  BG_PRIMARY: '#FFFFFF',
  BG_SECONDARY: '#F9FAFB',
  BG_TERTIARY: '#F3F4F6',
  BG_DARK: '#1F2937',
  
  // 배경 (다크 모드)
  DARK_BG_PRIMARY: '#0A0A0B',
  DARK_BG_SECONDARY: '#18181B',
  DARK_BG_TERTIARY: '#27272A',
} as const;

// 위험도별 색상
export const RISK_COLORS = {
  1: '#10B981', // 초록 - 안전
  2: '#84CC16', // 연두 - 낮음
  3: '#F59E0B', // 주황 - 보통
  4: '#EF4444', // 빨강 - 높음
  5: '#DC2626'  // 진빨강 - 매우 높음
} as const;

// 위험도별 아이콘
export const RISK_ICONS = {
  1: '🛡️', // 방패
  2: '✅', // 체크
  3: '⚠️', // 경고
  4: '🚨', // 경보
  5: '💥'  // 폭발
} as const;

// 매매 신호 액션별 색상
export const SIGNAL_COLORS = {
  BUY: '#10B981',   // 초록
  SELL: '#EF4444',  // 빨강
  HOLD: '#F59E0B',  // 주황
} as const;

// 매매 신호 액션별 텍스트
export const SIGNAL_TEXTS = {
  BUY: '🟢 매수 신호!',
  SELL: '🔴 매도 신호!',
  HOLD: '🟡 관망 신호',
} as const;

// 투자 성향
export const INVESTMENT_STYLES = {
  CONSERVATIVE: 'conservative',
  MODERATE: 'moderate',
  AGGRESSIVE: 'aggressive',
} as const;

// 경험 수준
export const EXPERIENCE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

// 매매 전략
export const TRADING_STRATEGIES = {
  SCALPING: 'SCALPING',
  DAY_TRADING: 'DAY_TRADING',
  SWING_TRADING: 'SWING_TRADING',
  LONG_TERM: 'LONG_TERM',
} as const;

// 매매 전략 한글명
export const TRADING_STRATEGY_NAMES = {
  SCALPING: '스캘핑',
  DAY_TRADING: '데이트레이딩',
  SWING_TRADING: '스윙 트레이딩',
  LONG_TERM: '장기 투자',
} as const;

// 폰트 크기
export const FONT_SIZES = {
  XS: '0.75rem',
  SM: '0.875rem',
  BASE: '1rem',
  LG: '1.125rem',
  XL: '1.25rem',
  '2XL': '1.5rem',
  '3XL': '1.875rem',
  '4XL': '2.25rem',
} as const;

// 간격
export const SPACING = {
  XS: '0.25rem',
  SM: '0.5rem',
  MD: '1rem',
  LG: '1.5rem',
  XL: '2rem',
  '2XL': '3rem',
  '3XL': '4rem',
  '4XL': '6rem',
} as const;

// 브레이크포인트 (반응형 디자인 최적화)
export const BREAKPOINTS = {
  XS: '480px',   // 작은 모바일
  SM: '576px',   // 모바일
  MD: '768px',   // 태블릿
  LG: '992px',   // 작은 데스크톱
  XL: '1200px',  // 데스크톱
  '2XL': '1400px', // 큰 데스크톱
} as const;

// 디바이스 타입별 브레이크포인트
export const DEVICE_BREAKPOINTS = {
  MOBILE: `(max-width: ${BREAKPOINTS.SM})`,
  TABLET: `(min-width: ${BREAKPOINTS.SM}) and (max-width: ${BREAKPOINTS.LG})`,
  DESKTOP: `(min-width: ${BREAKPOINTS.LG})`,
  MOBILE_AND_TABLET: `(max-width: ${BREAKPOINTS.LG})`,
  TABLET_AND_DESKTOP: `(min-width: ${BREAKPOINTS.SM})`,
} as const;

// 애니메이션
export const ANIMATIONS = {
  DURATION: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms',
  },
  EASING: {
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// 그림자
export const SHADOWS = {
  SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2XL': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  INNER: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

// 다크모드 그림자
export const DARK_SHADOWS = {
  SM: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  MD: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
  LG: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
  XL: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
  '2XL': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  INNER: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
} as const;

// 테마 모드
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

// 테두리 반지름
export const BORDER_RADIUS = {
  SM: '0.25rem',
  MD: '0.5rem',
  LG: '0.75rem',
  XL: '1rem',
  FULL: '9999px',
} as const;

// 전환 효과
export const TRANSITIONS = {
  FAST: '0.15s ease-in-out',
  NORMAL: '0.3s ease-in-out',
  SLOW: '0.5s ease-in-out',
} as const;

// 반응형 디자인을 위한 미디어 쿼리 헬퍼
export const MEDIA_QUERIES = {
  // 최소 너비 기준
  min: {
    xs: `(min-width: ${BREAKPOINTS.XS})`,
    sm: `(min-width: ${BREAKPOINTS.SM})`,
    md: `(min-width: ${BREAKPOINTS.MD})`,
    lg: `(min-width: ${BREAKPOINTS.LG})`,
    xl: `(min-width: ${BREAKPOINTS.XL})`,
    '2xl': `(min-width: ${BREAKPOINTS['2XL']})`,
  },
  // 최대 너비 기준
  max: {
    xs: `(max-width: ${BREAKPOINTS.XS})`,
    sm: `(max-width: ${BREAKPOINTS.SM})`,
    md: `(max-width: ${BREAKPOINTS.MD})`,
    lg: `(max-width: ${BREAKPOINTS.LG})`,
    xl: `(max-width: ${BREAKPOINTS.XL})`,
    '2xl': `(max-width: ${BREAKPOINTS['2XL']})`,
  },
  // 범위 기준
  between: {
    xs_sm: `(min-width: ${BREAKPOINTS.XS}) and (max-width: ${BREAKPOINTS.SM})`,
    sm_md: `(min-width: ${BREAKPOINTS.SM}) and (max-width: ${BREAKPOINTS.MD})`,
    md_lg: `(min-width: ${BREAKPOINTS.MD}) and (max-width: ${BREAKPOINTS.LG})`,
    lg_xl: `(min-width: ${BREAKPOINTS.LG}) and (max-width: ${BREAKPOINTS.XL})`,
    xl_2xl: `(min-width: ${BREAKPOINTS.XL}) and (max-width: ${BREAKPOINTS['2XL']})`,
  },
} as const;

// 터치 디바이스 감지
export const TOUCH_DEVICE = '(hover: none) and (pointer: coarse)';

// 반응형 그리드 시스템
export const GRID_SYSTEM = {
  CONTAINER_MAX_WIDTH: '1200px',
  CONTAINER_PADDING: {
    MOBILE: '1rem',
    TABLET: '1.5rem',
    DESKTOP: '2rem',
  },
  GRID_GAP: {
    MOBILE: '1rem',
    TABLET: '1.5rem',
    DESKTOP: '2rem',
  },
  COLUMNS: {
    MOBILE: 1,
    TABLET: 2,
    DESKTOP: 3,
    LARGE_DESKTOP: 4,
  },
} as const;
