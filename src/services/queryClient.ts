import { QueryClient } from '@tanstack/react-query';

// 캐싱 전략 상수
export const CACHE_STRATEGIES = {
  // 실시간 데이터 (매매 신호, 가격 정보)
  REALTIME: {
    staleTime: 30 * 1000, // 30초
    gcTime: 2 * 60 * 1000, // 2분
    refetchInterval: 30 * 1000, // 30초마다 자동 새로고침
  },
  
  // 자주 변경되는 데이터 (추천, 대시보드)
  FREQUENT: {
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 5 * 60 * 1000, // 5분
    refetchInterval: 2 * 60 * 1000, // 2분마다 자동 새로고침
  },
  
  // 중간 빈도 데이터 (코인 목록, 사용자 프로필)
  MODERATE: {
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 15 * 60 * 1000, // 15분
    refetchInterval: 5 * 60 * 1000, // 5분마다 자동 새로고침
  },
  
  // 거의 변경되지 않는 데이터 (설정, 정적 정보)
  STATIC: {
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 60 * 60 * 1000, // 1시간
    refetchInterval: false, // 자동 새로고침 비활성화
  },
  
  // 오프라인 우선 데이터 (캐시된 데이터 우선 사용)
  OFFLINE_FIRST: {
    staleTime: Infinity, // 항상 신선한 것으로 간주
    gcTime: 24 * 60 * 60 * 1000, // 24시간
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },
} as const;

// React Query 클라이언트 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 기본 설정 (중간 빈도 데이터 기준)
      ...CACHE_STRATEGIES.MODERATE,
      retry: 3, // 실패 시 3번 재시도
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
      refetchOnWindowFocus: false, // 창 포커스 시 자동 새로고침 비활성화
      refetchOnReconnect: true, // 네트워크 재연결 시 새로고침
      refetchOnMount: true, // 컴포넌트 마운트 시 새로고침
      networkMode: 'online', // 온라인일 때만 쿼리 실행
    },
    mutations: {
      // 뮤테이션 기본 설정
      retry: 1, // 뮤테이션은 1번만 재시도
      networkMode: 'online', // 온라인일 때만 뮤테이션 실행
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
  
  // 특정 패턴의 쿼리 무효화
  byPattern: (pattern: string[]) => {
    queryClient.invalidateQueries({ queryKey: pattern });
  },
  
  // 실시간 데이터 무효화 (즉시 새로고침)
  realtime: () => {
    queryClient.invalidateQueries({ 
      queryKey: QUERY_KEYS.TRADING_SIGNALS,
      refetchType: 'active' // 활성 쿼리만 즉시 새로고침
    });
  },
};

// 프리페칭 헬퍼 함수들
export const prefetchQueries = {
  // 대시보드 데이터 프리페칭
  dashboard: async (userId?: string) => {
    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.DASHBOARD_DATA(userId),
      queryFn: () => import('@/services/api').then(api => api.getDashboardData(userId)),
      ...CACHE_STRATEGIES.FREQUENT,
    });
  },
  
  // 추천 데이터 프리페칭
  recommendations: async (userId?: string) => {
    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.RECOMMENDATIONS_DATA(userId),
      queryFn: () => import('@/services/api').then(api => api.getRecommendations(userId)),
      ...CACHE_STRATEGIES.FREQUENT,
    });
  },
  
  // 매매 신호 프리페칭
  tradingSignals: async (userId?: string, strategy?: string) => {
    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.TRADING_SIGNALS_DATA(userId, strategy),
      queryFn: () => import('@/services/api').then(api => api.getTradingSignals(userId, strategy)),
      ...CACHE_STRATEGIES.REALTIME,
    });
  },
  
  // 코인 목록 프리페칭
  coins: async (searchQuery?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', filterBy?: string) => {
    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.COINS_DATA(searchQuery, sortBy, sortOrder, filterBy),
      queryFn: () => import('@/services/api').then(api => api.getCoins(searchQuery, sortBy, sortOrder, filterBy)),
      ...CACHE_STRATEGIES.MODERATE,
    });
  },
  
  // 사용자 프로필 프리페칭
  userProfile: async (userId: string) => {
    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.USER_PROFILE_DATA(userId),
      queryFn: () => import('@/services/api').then(api => api.getUserProfile(userId)),
      ...CACHE_STRATEGIES.STATIC,
    });
  },
};

// 캐시 관리 헬퍼 함수들
export const cacheManager = {
  // 특정 쿼리 캐시 제거
  remove: (queryKey: readonly unknown[]) => {
    queryClient.removeQueries({ queryKey });
  },
  
  // 모든 캐시 제거
  clear: () => {
    queryClient.clear();
  },
  
  // 캐시된 데이터 가져오기
  get: (queryKey: readonly unknown[]) => {
    return queryClient.getQueryData(queryKey);
  },
  
  // 캐시된 데이터 설정
  set: (queryKey: readonly unknown[], data: unknown) => {
    queryClient.setQueryData(queryKey, data);
  },
  
  // 캐시 상태 확인
  getState: () => {
    return queryClient.getQueryCache().getAll();
  },
  
  // 캐시 크기 확인
  getCacheSize: () => {
    return queryClient.getQueryCache().getAll().length;
  },
};

export default queryClient;
