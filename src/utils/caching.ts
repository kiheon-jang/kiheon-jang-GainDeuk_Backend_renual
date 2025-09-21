// src/utils/caching.ts
import { queryClient, QUERY_KEYS, CACHE_STRATEGIES } from '@/services/queryClient';

/**
 * 캐싱 전략 유틸리티 함수들
 */

// 캐시 상태 타입
export interface CacheStatus {
  isOnline: boolean;
  cacheSize: number;
  lastUpdated: Date;
  strategies: Record<string, number>;
}

// 캐시 전략 타입
export type CacheStrategy = 'REALTIME' | 'FREQUENT' | 'MODERATE' | 'STATIC' | 'OFFLINE_FIRST';

/**
 * 네트워크 상태 확인
 */
export const getNetworkStatus = (): boolean => {
  return navigator.onLine;
};

/**
 * 캐시 상태 정보 가져오기
 */
export const getCacheStatus = async (): Promise<CacheStatus> => {
  const cacheState = queryClient.getQueryCache().getAll();
  const cacheSize = cacheState.length;
  
  // Service Worker에서 캐시 크기 가져오기
  let swCacheSize = 0;
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      const messageChannel = new MessageChannel();
      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_CACHE_SIZE' },
        [messageChannel.port2]
      );
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_SIZE') {
          swCacheSize = event.data.size;
        }
      };
    } catch (error) {
      console.warn('Failed to get SW cache size:', error);
    }
  }
  
  return {
    isOnline: getNetworkStatus(),
    cacheSize: cacheSize + swCacheSize,
    lastUpdated: new Date(),
    strategies: {
      REALTIME: cacheState.filter(q => q.queryKey.includes('trading')).length,
      FREQUENT: cacheState.filter(q => q.queryKey.includes('dashboard')).length,
      MODERATE: cacheState.filter(q => q.queryKey.includes('coins')).length,
      STATIC: cacheState.filter(q => q.queryKey.includes('profile')).length,
    }
  };
};

/**
 * 특정 전략의 캐시 정리
 */
export const clearCacheByStrategy = (strategy: CacheStrategy): void => {
  const cacheState = queryClient.getQueryCache().getAll();
  
  cacheState.forEach(query => {
    const queryKey = query.queryKey;
    
    // 전략별 쿼리 키 패턴 매칭
    switch (strategy) {
      case 'REALTIME':
        if (queryKey.includes('trading') || queryKey.includes('signals')) {
          queryClient.removeQueries({ queryKey });
        }
        break;
      case 'FREQUENT':
        if (queryKey.includes('dashboard') || queryKey.includes('recommendations')) {
          queryClient.removeQueries({ queryKey });
        }
        break;
      case 'MODERATE':
        if (queryKey.includes('coins') || queryKey.includes('market')) {
          queryClient.removeQueries({ queryKey });
        }
        break;
      case 'STATIC':
        if (queryKey.includes('profile') || queryKey.includes('settings')) {
          queryClient.removeQueries({ queryKey });
        }
        break;
    }
  });
};

/**
 * 모든 캐시 정리
 */
export const clearAllCache = (): void => {
  queryClient.clear();
  
  // Service Worker 캐시도 정리
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
  }
};

/**
 * 캐시 만료 시간 계산
 */
export const getCacheExpiry = (strategy: CacheStrategy): number => {
  return CACHE_STRATEGIES[strategy]?.staleTime || CACHE_STRATEGIES.MODERATE.staleTime;
};

/**
 * 캐시 히트율 계산
 */
export const calculateCacheHitRate = (): number => {
  const cacheState = queryClient.getQueryCache().getAll();
  const totalQueries = cacheState.length;
  
  if (totalQueries === 0) return 0;
  
  const cachedQueries = cacheState.filter(query => 
    query.state.dataUpdatedAt > 0 && 
    query.state.dataUpdatedAt < Date.now()
  ).length;
  
  return (cachedQueries / totalQueries) * 100;
};

/**
 * 오프라인 모드 감지 및 처리
 */
export const handleOfflineMode = (): void => {
  const handleOnline = () => {
    console.log('🌐 Network reconnected, refreshing data...');
    // 네트워크 재연결 시 중요 데이터 새로고침
    queryClient.invalidateQueries({ 
      queryKey: QUERY_KEYS.TRADING_SIGNALS,
      refetchType: 'active'
    });
  };
  
  const handleOffline = () => {
    console.log('📴 Network disconnected, using cached data...');
    // 오프라인 상태에서는 캐시된 데이터만 사용
    queryClient.setDefaultOptions({
      queries: {
        ...CACHE_STRATEGIES.OFFLINE_FIRST,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      }
    });
  };
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // 초기 상태 확인
  if (!navigator.onLine) {
    handleOffline();
  }
};

/**
 * 캐시 최적화 권장사항
 */
export const getCacheOptimizationTips = (): string[] => {
  const tips: string[] = [];
  const cacheStatus = queryClient.getQueryCache().getAll();
  
  // 캐시 크기 확인
  if (cacheStatus.length > 100) {
    tips.push('캐시된 쿼리가 많습니다. 불필요한 캐시를 정리해보세요.');
  }
  
  // 오래된 캐시 확인
  const oldCaches = cacheStatus.filter(query => 
    Date.now() - query.state.dataUpdatedAt > 24 * 60 * 60 * 1000 // 24시간
  );
  
  if (oldCaches.length > 0) {
    tips.push(`${oldCaches.length}개의 오래된 캐시가 있습니다. 새로고침을 고려해보세요.`);
  }
  
  // 네트워크 상태 확인
  if (!navigator.onLine) {
    tips.push('오프라인 상태입니다. 캐시된 데이터를 사용 중입니다.');
  }
  
  return tips;
};

/**
 * 캐시 성능 메트릭
 */
export const getCacheMetrics = () => {
  const cacheState = queryClient.getQueryCache().getAll();
  
  return {
    totalQueries: cacheState.length,
    activeQueries: cacheState.filter(q => q.state.status === 'pending').length,
    cachedQueries: cacheState.filter(q => q.state.data).length,
    errorQueries: cacheState.filter(q => q.state.status === 'error').length,
    hitRate: calculateCacheHitRate(),
    memoryUsage: cacheState.reduce((total, query) => {
      return total + JSON.stringify(query.state.data || {}).length;
    }, 0)
  };
};

/**
 * 스마트 캐시 프리로딩
 */
export const smartPreload = async (userId?: string): Promise<void> => {
  if (!navigator.onLine) return;
  
  try {
    // 사용자 행동 패턴 기반 프리로딩
    const preloadPromises = [];
    
    // 대시보드 데이터 (높은 우선순위)
    preloadPromises.push(
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.DASHBOARD_DATA(userId),
        queryFn: () => import('@/services/api').then(api => api.getDashboardData(userId)),
        ...CACHE_STRATEGIES.FREQUENT,
      })
    );
    
    // 추천 데이터 (중간 우선순위)
    preloadPromises.push(
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.RECOMMENDATIONS_DATA(userId),
        queryFn: () => import('@/services/api').then(api => api.getRecommendations(userId)),
        ...CACHE_STRATEGIES.FREQUENT,
      })
    );
    
    // 코인 목록 (낮은 우선순위)
    preloadPromises.push(
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.COINS_DATA(),
        queryFn: () => import('@/services/api').then(api => api.getCoins()),
        ...CACHE_STRATEGIES.MODERATE,
      })
    );
    
    await Promise.allSettled(preloadPromises);
    console.log('✅ Smart preload completed');
  } catch (error) {
    console.error('❌ Smart preload failed:', error);
  }
};

/**
 * 캐시 무효화 스케줄러
 */
export const scheduleCacheInvalidation = (): void => {
  // 실시간 데이터는 30초마다 무효화
  setInterval(() => {
    queryClient.invalidateQueries({ 
      queryKey: QUERY_KEYS.TRADING_SIGNALS,
      refetchType: 'active'
    });
  }, 30 * 1000);
  
  // 자주 변경되는 데이터는 2분마다 무효화
  setInterval(() => {
    queryClient.invalidateQueries({ 
      queryKey: QUERY_KEYS.DASHBOARD,
      refetchType: 'active'
    });
  }, 2 * 60 * 1000);
  
  // 중간 빈도 데이터는 5분마다 무효화
  setInterval(() => {
    queryClient.invalidateQueries({ 
      queryKey: QUERY_KEYS.COINS,
      refetchType: 'active'
    });
  }, 5 * 60 * 1000);
};
