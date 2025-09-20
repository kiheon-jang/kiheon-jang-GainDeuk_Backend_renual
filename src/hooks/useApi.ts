import { useQuery, useMutation } from '@tanstack/react-query';
import { notify } from '@/services/notificationService';
import { api } from '@/services/api';
import { QUERY_KEYS, invalidateQueries } from '@/services/queryClient';
import type { 
  UserProfile
} from '@/types';

// 대시보드 데이터 훅
export const useDashboardData = (userId?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_DATA(userId),
    queryFn: () => api.getDashboardData(userId),
    refetchInterval: 60000, // 1분마다 새로고침
    staleTime: 30000, // 30초간 캐시 유지
  });
};

// AI 추천 코인 훅
export const useRecommendations = (userId?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.RECOMMENDATIONS_DATA(userId),
    queryFn: () => api.getRecommendations(userId),
    refetchInterval: 30000, // 30초마다 새로고침
    staleTime: 10000, // 10초간 캐시 유지
  });
};

// 실시간 매매 신호 훅 (핵심!)
export const useTradingSignals = (userId?: string, strategy?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.TRADING_SIGNALS_DATA(userId, strategy),
    queryFn: () => api.getTradingSignals(userId, strategy),
    refetchInterval: 10000, // 10초마다 새로고침 (매매는 빠른 판단이 중요!)
    staleTime: 5000, // 5초간 캐시 유지
    refetchOnWindowFocus: true, // 창 포커스 시 즉시 새로고침
  });
};

// 코인 목록 훅
export const useCoins = (searchQuery?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', filterBy?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.COINS_DATA(searchQuery, sortBy, sortOrder, filterBy),
    queryFn: () => api.getCoins(searchQuery, sortBy, sortOrder, filterBy),
    refetchInterval: 60000, // 1분마다 새로고침
    staleTime: 30000, // 30초간 캐시 유지
  });
};

// 매매 신호 상세 정보 훅
export const useTradingSignalDetail = (signalId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.TRADING_SIGNAL_DETAIL(signalId),
    queryFn: () => api.getTradingSignalDetail(signalId),
    enabled: !!signalId, // signalId가 있을 때만 실행
  });
};

// 매매 실행 훅
export const useExecuteTrade = () => {
  return useMutation({
    mutationFn: (tradeData: { signalId: string; action: 'BUY' | 'SELL'; amount: number; price: number }) =>
      api.executeTrade(tradeData),
    onSuccess: (data) => {
      // 매매 성공 시 관련 쿼리들 새로고침
      invalidateQueries.tradingSignals();
      invalidateQueries.dashboard();
      invalidateQueries.recommendations();
      
      notify.success('매매 실행 완료', '매매가 성공적으로 실행되었습니다!');
      console.log('Trade executed successfully:', data);
    },
    onError: (error) => {
      notify.error('매매 실행 오류', '매매 실행 중 오류가 발생했습니다.');
      console.error('Trade execution error:', error);
    },
  });
};

// 사용자 성향 분석 훅
export const useAnalyzeUserProfile = () => {
  return useMutation({
    mutationFn: (testAnswers: any[]) => api.analyzeUserProfile(testAnswers),
    onSuccess: (data) => {
      // 성향 분석 완료 시 관련 쿼리들 새로고침
      invalidateQueries.dashboard();
      invalidateQueries.recommendations();
      invalidateQueries.tradingSignals();
      
      notify.success('분석 완료', '투자 성향 분석이 완료되었습니다!');
      console.log('User profile analyzed successfully:', data);
    },
    onError: (error) => {
      notify.error('분석 오류', '성향 분석 중 오류가 발생했습니다.');
      console.error('User profile analysis error:', error);
    },
  });
};


// 코인 상세 정보 훅
export const useCoinDetails = (coinId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.COIN_DETAIL(coinId),
    queryFn: () => api.getCoinDetails(coinId),
    enabled: !!coinId, // coinId가 있을 때만 실행
    staleTime: 60000, // 1분간 캐시 유지
  });
};

// 투자 성향 테스트 훅
export const useInvestmentTest = () => {
  return useQuery({
    queryKey: QUERY_KEYS.INVESTMENT_TEST,
    queryFn: () => api.getInvestmentTest(),
    staleTime: 24 * 60 * 60 * 1000, // 24시간간 캐시 유지 (테스트는 자주 바뀌지 않음)
  });
};

// 사용자 프로필 저장 훅
export const useSaveUserProfile = () => {
  return useMutation({
    mutationFn: (profile: UserProfile) => api.saveUserProfile(profile),
    onSuccess: (data) => {
      // 프로필 저장 성공 시 관련 쿼리들 새로고침
      invalidateQueries.userProfile(data.id);
      invalidateQueries.dashboard();
      invalidateQueries.recommendations();
      invalidateQueries.tradingSignals();
      
      notify.success('프로필 저장 완료', '프로필이 저장되었습니다!');
      console.log('User profile saved successfully:', data);
    },
    onError: (error) => {
      notify.error('프로필 저장 오류', '프로필 저장 중 오류가 발생했습니다.');
      console.error('User profile save error:', error);
    },
  });
};

// 사용자 프로필 조회 훅
export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_PROFILE_DATA(userId),
    queryFn: () => api.getUserProfile(userId),
    enabled: !!userId, // userId가 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};

// 서버 상태 확인 훅
export const useHealthCheck = () => {
  return useQuery({
    queryKey: QUERY_KEYS.HEALTH_CHECK,
    queryFn: () => api.healthCheck(),
    refetchInterval: 30000, // 30초마다 새로고침
    staleTime: 10000, // 10초간 캐시 유지
    retry: 1, // 1번만 재시도
  });
};

// 쿼리 무효화 헬퍼 훅
export const useInvalidateQueries = () => {
  return {
    dashboard: invalidateQueries.dashboard,
    recommendations: invalidateQueries.recommendations,
    tradingSignals: invalidateQueries.tradingSignals,
    coins: invalidateQueries.coins,
    userProfile: invalidateQueries.userProfile,
    all: invalidateQueries.all,
  };
};
