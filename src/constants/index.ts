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
  
  // 중성 색상
  GRAY_50: '#F9FAFB',
  GRAY_100: '#F3F4F6',
  GRAY_200: '#E5E7EB',
  GRAY_400: '#9CA3AF',
  GRAY_500: '#6B7280',
  GRAY_600: '#4B5563',
  GRAY_700: '#374151',
  GRAY_300: '#D1D5DB',
  GRAY_900: '#111827',
  
  // 배경
  BG_PRIMARY: '#FFFFFF',
  BG_SECONDARY: '#F9FAFB',
  BG_DARK: '#1F2937',
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
} as const;

// 브레이크포인트
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;
