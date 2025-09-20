import { QueryClient } from '@tanstack/react-query';

// React Query 클라이언트 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 기본 설정
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
      retry: 3, // 실패 시 3번 재시도
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
      refetchOnWindowFocus: false, // 창 포커스 시 자동 새로고침 비활성화
      refetchOnReconnect: true, // 네트워크 재연결 시 새로고침
    },
    mutations: {
      // 뮤테이션 기본 설정
      retry: 1, // 뮤테이션은 1번만 재시도
    },
  },
});

// 쿼리 키 상수
export const QUERY_KEYS = {
  // 대시보드 관련
  DASHBOARD: ['dashboard'] as const,
  DASHBOARD_DATA: (userId?: string) => [...QUERY_KEYS.DASHBOARD, userId] as const,
  
  // 추천 관련
  RECOMMENDATIONS: ['recommendations'] as const,
  RECOMMENDATIONS_DATA: (userId?: string) => [...QUERY_KEYS.RECOMMENDATIONS, userId] as const,
  
  // 매매 신호 관련
  TRADING_SIGNALS: ['tradingSignals'] as const,
  TRADING_SIGNALS_DATA: (userId?: string, strategy?: string) => 
    [...QUERY_KEYS.TRADING_SIGNALS, userId, strategy] as const,
  TRADING_SIGNAL_DETAIL: (signalId: string) => 
    [...QUERY_KEYS.TRADING_SIGNALS, 'detail', signalId] as const,
  
  // 코인 관련
  COINS: ['coins'] as const,
  COINS_DATA: (searchQuery?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', filterBy?: string) => 
    [...QUERY_KEYS.COINS, 'data', searchQuery, sortBy, sortOrder, filterBy] as const,
  COIN_DETAIL: (coinId: string) => [...QUERY_KEYS.COINS, 'detail', coinId] as const,
  
  // 사용자 프로필 관련
  USER_PROFILE: ['userProfile'] as const,
  USER_PROFILE_DATA: (userId: string) => [...QUERY_KEYS.USER_PROFILE, userId] as const,
  
  // 투자 성향 테스트 관련
  INVESTMENT_TEST: ['investmentTest'] as const,
  
  // 서버 상태
  HEALTH_CHECK: ['healthCheck'] as const,
} as const;

// 쿼리 무효화 헬퍼 함수들
export const invalidateQueries = {
  // 대시보드 관련 쿼리 무효화
  dashboard: (userId?: string) => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_DATA(userId) });
    } else {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
    }
  },
  
  // 추천 관련 쿼리 무효화
  recommendations: (userId?: string) => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECOMMENDATIONS_DATA(userId) });
    } else {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECOMMENDATIONS });
    }
  },
  
  // 매매 신호 관련 쿼리 무효화
  tradingSignals: (userId?: string, strategy?: string) => {
    if (userId || strategy) {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRADING_SIGNALS_DATA(userId, strategy) });
    } else {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRADING_SIGNALS });
    }
  },
  
  // 코인 관련 쿼리 무효화
  coins: (searchQuery?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', filterBy?: string) => {
    if (searchQuery || sortBy || sortOrder || filterBy) {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COINS_DATA(searchQuery, sortBy, sortOrder, filterBy) });
    } else {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COINS });
    }
  },
  
  // 사용자 프로필 관련 쿼리 무효화
  userProfile: (userId: string) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE_DATA(userId) });
  },
  
  // 모든 쿼리 무효화
  all: () => {
    queryClient.invalidateQueries();
  },
};

export default queryClient;
