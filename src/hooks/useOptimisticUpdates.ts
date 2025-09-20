import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/services/queryClient';
import { notify } from '@/services/notificationService';
import type { TradingSignal } from '@/types';

// 낙관적 업데이트를 위한 훅
export const useOptimisticUpdates = () => {
  const queryClient = useQueryClient();

  // 매매 실행 낙관적 업데이트
  const optimisticTradeExecution = useCallback((
    signalId: string,
    action: 'BUY' | 'SELL',
    amount: number,
    price: number
  ) => {
    // 현재 매매 신호 데이터 가져오기
    const currentSignals = queryClient.getQueryData(
      QUERY_KEYS.TRADING_SIGNALS
    ) as TradingSignal[] | undefined;

    if (currentSignals) {
      // 낙관적 업데이트: 매매 신호 상태를 "실행됨"으로 변경
      const updatedSignals = currentSignals.map(signal => 
        signal.id === signalId 
          ? { 
              ...signal, 
              status: 'executed' as const,
              executedAt: new Date().toISOString(),
              executedAction: action,
              executedAmount: amount,
              executedPrice: price
            }
          : signal
      );

      // 캐시 업데이트
      queryClient.setQueryData(QUERY_KEYS.TRADING_SIGNALS, updatedSignals);

      // 성공 알림
      notify.success(
        '매매 실행됨',
        `${action} 주문이 실행되었습니다. (${amount} @ ${price})`
      );
    }
  }, [queryClient]);

  // 관심목록 추가/제거 낙관적 업데이트
  const optimisticWatchlistUpdate = useCallback((
    coinId: string,
    action: 'add' | 'remove'
  ) => {
    // 대시보드 데이터 가져오기
    const currentDashboard = queryClient.getQueryData(
      QUERY_KEYS.DASHBOARD
    ) as any;

    if (currentDashboard) {
      // 관심목록 업데이트
      const currentWatchlist = currentDashboard.watchlist || [];
      const updatedWatchlist = action === 'add' 
        ? [...currentWatchlist, coinId]
        : currentWatchlist.filter((id: string) => id !== coinId);

      // 캐시 업데이트
      queryClient.setQueryData(QUERY_KEYS.DASHBOARD, {
        ...currentDashboard,
        watchlist: updatedWatchlist
      });

      // 성공 알림
      notify.success(
        '관심목록 업데이트',
        action === 'add' ? '관심목록에 추가되었습니다.' : '관심목록에서 제거되었습니다.'
      );
    }
  }, [queryClient]);

  // 사용자 프로필 업데이트 낙관적 업데이트
  const optimisticProfileUpdate = useCallback((
    userId: string,
    profileData: any
  ) => {
    // 현재 프로필 데이터 가져오기
    const currentProfile = queryClient.getQueryData(
      QUERY_KEYS.USER_PROFILE_DATA(userId)
    ) as any;

    if (currentProfile) {
      // 낙관적 업데이트
      const updatedProfile = {
        ...currentProfile,
        ...profileData,
        updatedAt: new Date().toISOString()
      };

      // 캐시 업데이트
      queryClient.setQueryData(QUERY_KEYS.USER_PROFILE_DATA(userId), updatedProfile);

      // 성공 알림
      notify.success('프로필 업데이트', '프로필이 업데이트되었습니다.');
    }
  }, [queryClient]);

  // 낙관적 업데이트 롤백
  const rollbackOptimisticUpdate = useCallback((
    queryKey: any,
    previousData: any,
    errorMessage: string
  ) => {
    // 이전 데이터로 롤백
    queryClient.setQueryData(queryKey, previousData);
    
    // 오류 알림
    notify.error('업데이트 실패', errorMessage);
  }, [queryClient]);

  return {
    optimisticTradeExecution,
    optimisticWatchlistUpdate,
    optimisticProfileUpdate,
    rollbackOptimisticUpdate,
  };
};

// 캐시 무효화 전략을 위한 훅
export const useCacheInvalidation = () => {
  const queryClient = useQueryClient();

  // 매매 실행 후 관련 쿼리 무효화
  const invalidateAfterTrade = useCallback((userId?: string) => {
    // 매매 신호, 대시보드, 추천 데이터 무효화
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRADING_SIGNALS });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECOMMENDATIONS });
    
    if (userId) {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE_DATA(userId) });
    }
  }, [queryClient]);

  // 프로필 업데이트 후 관련 쿼리 무효화
  const invalidateAfterProfileUpdate = useCallback((userId: string) => {
    // 사용자 관련 모든 데이터 무효화
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE_DATA(userId) });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECOMMENDATIONS });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRADING_SIGNALS });
  }, [queryClient]);

  // 코인 데이터 업데이트 후 관련 쿼리 무효화
  const invalidateAfterCoinUpdate = useCallback(() => {
    // 코인 관련 모든 데이터 무효화
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COINS });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECOMMENDATIONS });
  }, [queryClient]);

  // 특정 시간 후 자동 무효화
  const scheduleInvalidation = useCallback((
    queryKey: any,
    delay: number = 30000 // 30초
  ) => {
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey });
    }, delay);
  }, [queryClient]);

  return {
    invalidateAfterTrade,
    invalidateAfterProfileUpdate,
    invalidateAfterCoinUpdate,
    scheduleInvalidation,
  };
};

// 데이터 프리페칭을 위한 훅
export const useDataPrefetching = () => {
  const queryClient = useQueryClient();

  // 사용자가 다음에 볼 가능성이 높은 데이터 미리 로드
  const prefetchUserData = useCallback(async (userId: string) => {
    try {
      // 대시보드 데이터 프리페치
      await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.DASHBOARD_DATA(userId),
        staleTime: 5 * 60 * 1000, // 5분
      });

      // 추천 데이터 프리페치
      await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.RECOMMENDATIONS_DATA(userId),
        staleTime: 5 * 60 * 1000, // 5분
      });

      // 매매 신호 데이터 프리페치
      await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.TRADING_SIGNALS_DATA(userId),
        staleTime: 1 * 60 * 1000, // 1분
      });
    } catch (error) {
      console.error('Prefetch error:', error);
    }
  }, [queryClient]);

  // 코인 상세 정보 프리페치
  const prefetchCoinDetails = useCallback(async (coinId: string) => {
    try {
      await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.COIN_DETAIL(coinId),
        staleTime: 10 * 60 * 1000, // 10분
      });
    } catch (error) {
      console.error('Coin prefetch error:', error);
    }
  }, [queryClient]);

  // 페이지 로드 시 관련 데이터 프리페치
  const prefetchPageData = useCallback(async (page: string, userId?: string) => {
    switch (page) {
      case 'dashboard':
        if (userId) {
          await prefetchUserData(userId);
        }
        break;
      case 'trading':
        if (userId) {
          await queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.TRADING_SIGNALS_DATA(userId),
            staleTime: 1 * 60 * 1000,
          });
        }
        break;
      case 'coins':
        await queryClient.prefetchQuery({
          queryKey: QUERY_KEYS.COINS_DATA(),
          staleTime: 5 * 60 * 1000,
        });
        break;
    }
  }, [queryClient, prefetchUserData]);

  return {
    prefetchUserData,
    prefetchCoinDetails,
    prefetchPageData,
  };
};
