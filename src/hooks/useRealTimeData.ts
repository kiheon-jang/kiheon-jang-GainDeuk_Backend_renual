import { useEffect, useRef, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/services/queryClient';
import { notify } from '@/services/notificationService';
import type { TradingSignal, CoinRecommendation } from '@/types';

// 실시간 데이터 업데이트를 위한 훅
export const useRealTimeData = () => {
  const queryClient = useQueryClient();
  const intervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  // const lastUpdateRef = useRef<Map<string, any>>(new Map());

  // 실시간 업데이트 중지
  const stopRealTimeUpdates = useCallback(() => {
    intervalsRef.current.forEach((interval) => {
      clearInterval(interval);
    });
    intervalsRef.current.clear();
  }, []);

  // 특정 쿼리의 실시간 업데이트 중지
  const stopQueryUpdates = useCallback((queryKey: string) => {
    const interval = intervalsRef.current.get(queryKey);
    if (interval) {
      clearInterval(interval);
      intervalsRef.current.delete(queryKey);
    }
  }, []);

  // 매매 신호 실시간 업데이트
  const startTradingSignalsUpdates = useCallback((
    userId?: string, 
    strategy?: string,
    onNewSignal?: (signal: TradingSignal) => void
  ) => {
    // userId가 없을 때 기본값 사용
    const effectiveUserId = userId || 'default';
    const queryKey = `trading-signals-${effectiveUserId}-${strategy}`;
    
    // 기존 업데이트 중지
    stopQueryUpdates(queryKey);

    const interval = setInterval(async () => {
      try {
        // 현재 캐시된 데이터 가져오기
        const currentData = queryClient.getQueryData(
          QUERY_KEYS.TRADING_SIGNALS_DATA(effectiveUserId, strategy)
        ) as TradingSignal[] | undefined;

        // 새로운 데이터 가져오기
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.TRADING_SIGNALS_DATA(effectiveUserId, strategy),
        });

        // 새로운 데이터 확인
        const newData = queryClient.getQueryData(
          QUERY_KEYS.TRADING_SIGNALS_DATA(effectiveUserId, strategy)
        ) as TradingSignal[] | undefined;

        // 새로운 신호가 있는지 확인
        if (currentData && newData && onNewSignal) {
          const newSignals = newData.filter(
            newSignal => !currentData.some(
              currentSignal => currentSignal.id === newSignal.id
            )
          );

          // 새로운 신호에 대한 알림
          newSignals.forEach(signal => {
            const signalType = signal.signal.action.toLowerCase();
            const coinName = signal.coin.name;
            const price = (signal as any).currentPrice || 'N/A';
            
            notify.tradingSignal(
              `새로운 ${signalType} 신호`,
              `${coinName} ${signalType} 신호가 감지되었습니다. (${price})`,
              [
                {
                  label: '상세보기',
                  action: () => {
                    // TODO: 신호 상세 모달 열기
                    console.log('Show signal details:', signal.id);
                  }
                },
                {
                  label: '거래하기',
                  action: () => {
                    // TODO: 거래 모달 열기
                    console.log('Execute trade:', signal.id);
                  }
                }
              ]
            );

            onNewSignal(signal);
          });
        }
      } catch (error) {
        console.error('Trading signals update error:', error);
      }
    }, 10000); // 10초마다 업데이트

    intervalsRef.current.set(queryKey, interval);
  }, [queryClient, stopQueryUpdates]);

  // 대시보드 데이터 실시간 업데이트
  const startDashboardUpdates = useCallback((
    userId?: string,
    onNewRecommendation?: (recommendation: CoinRecommendation) => void
  ) => {
    // userId가 없을 때 기본값 사용
    const effectiveUserId = userId || 'default';
    const queryKey = `dashboard-${effectiveUserId}`;
    
    // 기존 업데이트 중지
    stopQueryUpdates(queryKey);

    const interval = setInterval(async () => {
      try {
        // 현재 캐시된 데이터 가져오기
        const currentData = queryClient.getQueryData(
          QUERY_KEYS.DASHBOARD_DATA(effectiveUserId)
        ) as any;

        // 새로운 데이터 가져오기
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.DASHBOARD_DATA(effectiveUserId),
        });

        // 새로운 데이터 확인
        const newData = queryClient.getQueryData(
          QUERY_KEYS.DASHBOARD_DATA(effectiveUserId)
        ) as any;

        // 새로운 추천이 있는지 확인
        if (currentData?.recommendations && newData?.recommendations && onNewRecommendation) {
          const newRecommendations = newData.recommendations.filter(
            (newRec: any) => !currentData.recommendations.some(
              (currentRec: any) => currentRec.id === newRec.id
            )
          );

          // 새로운 추천에 대한 알림
          newRecommendations.forEach((recommendation: CoinRecommendation) => {
            notify.info(
              '새로운 AI 추천',
              `${recommendation.coin.name}에 대한 새로운 AI 추천이 있습니다.`,
              {
                duration: 6000,
                actions: [
                  {
                    label: '확인하기',
                    action: () => {
                      // TODO: 추천 상세보기
                      console.log('Show recommendation:', (recommendation as any).id);
                    }
                  }
                ]
              }
            );

            onNewRecommendation(recommendation);
          });
        }
      } catch (error) {
        console.error('Dashboard update error:', error);
      }
    }, 30000); // 30초마다 업데이트

    intervalsRef.current.set(queryKey, interval);
  }, [queryClient, stopQueryUpdates]);

  // 코인 데이터 실시간 업데이트
  const startCoinsUpdates = useCallback((
    searchQuery?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    filterBy?: string
  ) => {
    const queryKey = `coins-${searchQuery}-${sortBy}-${sortOrder}-${filterBy}`;
    
    // 기존 업데이트 중지
    stopQueryUpdates(queryKey);

    const interval = setInterval(async () => {
      try {
        // 현재 캐시된 데이터 가져오기
        const currentData = queryClient.getQueryData(
          QUERY_KEYS.COINS_DATA(searchQuery, sortBy, sortOrder, filterBy)
        ) as any;

        // 새로운 데이터 가져오기
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.COINS_DATA(searchQuery, sortBy, sortOrder, filterBy),
        });

        // 새로운 데이터 확인
        const newData = queryClient.getQueryData(
          QUERY_KEYS.COINS_DATA(searchQuery, sortBy, sortOrder, filterBy)
        ) as any;

        // 큰 가격 변동이 있는지 확인
        if (currentData?.coins && newData?.coins) {
          const significantChanges = newData.coins.filter((newCoin: any) => {
            const currentCoin = currentData.coins.find((c: any) => c.id === newCoin.id);
            if (!currentCoin) return false;
            
            const priceChange = Math.abs(newCoin.priceChange24h - currentCoin.priceChange24h);
            return priceChange > 5; // 5% 이상 변동
          });

          // 큰 가격 변동에 대한 알림
          significantChanges.forEach((coin: any) => {
            const change = coin.priceChange24h > 0 ? '상승' : '하락';
            const changePercent = Math.abs(coin.priceChange24h);
            
            notify.priceAlert(
              `${coin.name} 급등락`,
              `${coin.name}이 ${changePercent.toFixed(2)}% ${change}했습니다.`,
              [
                {
                  label: '차트 보기',
                  action: () => {
                    // TODO: 차트 페이지로 이동
                    console.log('Show chart:', coin.id);
                  }
                }
              ]
            );
          });
        }
      } catch (error) {
        console.error('Coins update error:', error);
      }
    }, 60000); // 1분마다 업데이트

    intervalsRef.current.set(queryKey, interval);
  }, [queryClient, stopQueryUpdates]);

  // 컴포넌트 언마운트 시 모든 업데이트 중지
  useEffect(() => {
    return () => {
      stopRealTimeUpdates();
    };
  }, [stopRealTimeUpdates]);

  return {
    startTradingSignalsUpdates,
    startDashboardUpdates,
    startCoinsUpdates,
    stopRealTimeUpdates,
    stopQueryUpdates,
  };
};

// 백그라운드 새로고침 상태를 관리하는 훅
export const useBackgroundRefresh = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);

  const refreshAllData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECOMMENDATIONS }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRADING_SIGNALS }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COINS }),
      ]);
      
      setLastRefreshTime(new Date());
      notify.success('데이터 새로고침', '모든 데이터가 최신 상태로 업데이트되었습니다.');
    } catch (error) {
      console.error('Background refresh error:', error);
      notify.error('새로고침 오류', '데이터 새로고침 중 오류가 발생했습니다.');
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient]);

  return {
    isRefreshing,
    lastRefreshTime,
    refreshAllData,
  };
};

// 네트워크 상태를 모니터링하는 훅
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      notify.success('네트워크 연결', '인터넷 연결이 복구되었습니다.');
    };

    const handleOffline = () => {
      setIsOnline(false);
      notify.warning('네트워크 연결 끊김', '인터넷 연결이 끊어졌습니다. 일부 기능이 제한될 수 있습니다.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 연결 타입 확인 (지원하는 브라우저에서만)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection.effectiveType || 'unknown');
      
      const handleConnectionChange = () => {
        setConnectionType(connection.effectiveType || 'unknown');
      };
      
      connection.addEventListener('change', handleConnectionChange);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    connectionType,
  };
};
