// src/hooks/useCaching.ts
import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  getCacheStatus, 
  getCacheMetrics, 
  clearCacheByStrategy, 
  clearAllCache,
  getCacheOptimizationTips,
  smartPreload,
  handleOfflineMode,
  type CacheStatus,
  type CacheStrategy
} from '@/utils/caching';

/**
 * 캐싱 상태 및 관리 훅
 */
export const useCaching = () => {
  const queryClient = useQueryClient();
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 캐시 상태 업데이트
  const updateCacheStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const status = await getCacheStatus();
      setCacheStatus(status);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get cache status');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 캐시 정리
  const clearCache = useCallback(async (strategy?: CacheStrategy) => {
    try {
      if (strategy) {
        clearCacheByStrategy(strategy);
      } else {
        clearAllCache();
      }
      await updateCacheStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cache');
    }
  }, [updateCacheStatus]);

  // 스마트 프리로딩
  const preloadData = useCallback(async (userId?: string) => {
    try {
      await smartPreload(userId);
      await updateCacheStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to preload data');
    }
  }, [updateCacheStatus]);

  // 초기화
  useEffect(() => {
    updateCacheStatus();
    handleOfflineMode();
    
    // 주기적으로 캐시 상태 업데이트
    const interval = setInterval(updateCacheStatus, 30000); // 30초마다
    
    return () => clearInterval(interval);
  }, [updateCacheStatus]);

  return {
    cacheStatus,
    isLoading,
    error,
    updateCacheStatus,
    clearCache,
    preloadData,
    metrics: getCacheMetrics(),
    optimizationTips: getCacheOptimizationTips(),
  };
};

/**
 * 캐시 성능 모니터링 훅
 */
export const useCachePerformance = () => {
  const [metrics, setMetrics] = useState(getCacheMetrics());
  const [isMonitoring, setIsMonitoring] = useState(false);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    const interval = setInterval(() => {
      setMetrics(getCacheMetrics());
    }, 5000); // 5초마다 업데이트
    
    return () => clearInterval(interval);
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  useEffect(() => {
    if (isMonitoring) {
      return startMonitoring();
    }
  }, [isMonitoring, startMonitoring]);

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
  };
};

/**
 * 오프라인 상태 관리 훅
 */
export const useOfflineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null);
  const [lastOfflineTime, setLastOfflineTime] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnlineTime(new Date());
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastOfflineTime(new Date());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getOfflineDuration = useCallback(() => {
    if (isOnline || !lastOfflineTime) return 0;
    return Date.now() - lastOfflineTime.getTime();
  }, [isOnline, lastOfflineTime]);

  const getOnlineDuration = useCallback(() => {
    if (!isOnline || !lastOnlineTime) return 0;
    return Date.now() - lastOnlineTime.getTime();
  }, [isOnline, lastOnlineTime]);

  return {
    isOnline,
    lastOnlineTime,
    lastOfflineTime,
    offlineDuration: getOfflineDuration(),
    onlineDuration: getOnlineDuration(),
  };
};

/**
 * 캐시 히트율 추적 훅
 */
export const useCacheHitRate = () => {
  const [hitRate, setHitRate] = useState(0);
  const [hitCount, setHitCount] = useState(0);
  const [missCount, setMissCount] = useState(0);

  const recordHit = useCallback(() => {
    setHitCount(prev => prev + 1);
  }, []);

  const recordMiss = useCallback(() => {
    setMissCount(prev => prev + 1);
  }, []);

  const resetStats = useCallback(() => {
    setHitCount(0);
    setMissCount(0);
    setHitRate(0);
  }, []);

  useEffect(() => {
    const total = hitCount + missCount;
    if (total > 0) {
      setHitRate((hitCount / total) * 100);
    }
  }, [hitCount, missCount]);

  return {
    hitRate,
    hitCount,
    missCount,
    totalRequests: hitCount + missCount,
    recordHit,
    recordMiss,
    resetStats,
  };
};

/**
 * 캐시 최적화 권장사항 훅
 */
export const useCacheOptimization = () => {
  const [tips, setTips] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCache = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const optimizationTips = getCacheOptimizationTips();
      setTips(optimizationTips);
    } catch (error) {
      console.error('Failed to analyze cache:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  useEffect(() => {
    analyzeCache();
    
    // 주기적으로 분석
    const interval = setInterval(analyzeCache, 60000); // 1분마다
    
    return () => clearInterval(interval);
  }, [analyzeCache]);

  return {
    tips,
    isAnalyzing,
    analyzeCache,
  };
};
