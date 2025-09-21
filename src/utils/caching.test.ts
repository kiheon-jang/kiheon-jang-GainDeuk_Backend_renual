// src/utils/caching.test.ts
import { 
  getNetworkStatus, 
  getCacheStatus, 
  clearCacheByStrategy, 
  clearAllCache,
  getCacheExpiry,
  calculateCacheHitRate,
  getCacheOptimizationTips,
  getCacheMetrics
} from './caching';
import { queryClient } from '@/services/queryClient';

// Mock queryClient
jest.mock('@/services/queryClient', () => ({
  queryClient: {
    getQueryCache: jest.fn(() => ({
      getAll: jest.fn(() => [
        {
          queryKey: ['dashboard'],
          state: { data: {}, dataUpdatedAt: Date.now() - 1000 }
        },
        {
          queryKey: ['trading-signals'],
          state: { data: {}, dataUpdatedAt: Date.now() - 2000 }
        },
        {
          queryKey: ['coins'],
          state: { data: null, dataUpdatedAt: 0 }
        }
      ])
    })),
    clear: jest.fn(),
    removeQueries: jest.fn()
  }
}));

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
});

// Mock Service Worker
Object.defineProperty(navigator, 'serviceWorker', {
  writable: true,
  value: {
    controller: {
      postMessage: jest.fn()
    }
  },
});

describe('Caching Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNetworkStatus', () => {
    it('should return true when online', () => {
      navigator.onLine = true;
      expect(getNetworkStatus()).toBe(true);
    });

    it('should return false when offline', () => {
      navigator.onLine = false;
      expect(getNetworkStatus()).toBe(false);
    });
  });

  describe('getCacheStatus', () => {
    it('should return cache status with correct structure', async () => {
      const status = await getCacheStatus();
      
      expect(status).toHaveProperty('isOnline');
      expect(status).toHaveProperty('cacheSize');
      expect(status).toHaveProperty('lastUpdated');
      expect(status).toHaveProperty('strategies');
      expect(status.isOnline).toBe(true);
      expect(typeof status.cacheSize).toBe('number');
      expect(status.lastUpdated).toBeInstanceOf(Date);
    });
  });

  describe('clearCacheByStrategy', () => {
    it('should clear cache for specific strategy', () => {
      const removeQueriesSpy = jest.spyOn(queryClient, 'removeQueries');
      
      clearCacheByStrategy('REALTIME');
      
      expect(removeQueriesSpy).toHaveBeenCalled();
    });

    it('should clear cache for FREQUENT strategy', () => {
      const removeQueriesSpy = jest.spyOn(queryClient, 'removeQueries');
      
      clearCacheByStrategy('FREQUENT');
      
      expect(removeQueriesSpy).toHaveBeenCalled();
    });
  });

  describe('clearAllCache', () => {
    it('should clear all cache', () => {
      const clearSpy = jest.spyOn(queryClient, 'clear');
      const postMessageSpy = jest.spyOn(navigator.serviceWorker.controller, 'postMessage');
      
      clearAllCache();
      
      expect(clearSpy).toHaveBeenCalled();
      expect(postMessageSpy).toHaveBeenCalledWith({ type: 'CLEAR_CACHE' });
    });
  });

  describe('getCacheExpiry', () => {
    it('should return correct expiry time for REALTIME strategy', () => {
      const expiry = getCacheExpiry('REALTIME');
      expect(expiry).toBe(30000); // 30 seconds
    });

    it('should return correct expiry time for FREQUENT strategy', () => {
      const expiry = getCacheExpiry('FREQUENT');
      expect(expiry).toBe(120000); // 2 minutes
    });

    it('should return default expiry for unknown strategy', () => {
      const expiry = getCacheExpiry('UNKNOWN' as any);
      expect(expiry).toBe(300000); // 5 minutes (MODERATE default)
    });
  });

  describe('calculateCacheHitRate', () => {
    it('should calculate correct hit rate', () => {
      const hitRate = calculateCacheHitRate();
      expect(typeof hitRate).toBe('number');
      expect(hitRate).toBeGreaterThanOrEqual(0);
      expect(hitRate).toBeLessThanOrEqual(100);
    });
  });

  describe('getCacheOptimizationTips', () => {
    it('should return array of tips', () => {
      const tips = getCacheOptimizationTips();
      expect(Array.isArray(tips)).toBe(true);
    });

    it('should include tip for large cache size', () => {
      // Mock large cache
      const mockGetAll = jest.fn(() => Array(150).fill({}));
      jest.spyOn(queryClient, 'getQueryCache').mockReturnValue({
        getAll: mockGetAll
      } as any);

      const tips = getCacheOptimizationTips();
      expect(tips.some(tip => tip.includes('캐시된 쿼리가 많습니다'))).toBe(true);
    });

    it('should include tip for offline status', () => {
      navigator.onLine = false;
      const tips = getCacheOptimizationTips();
      expect(tips.some(tip => tip.includes('오프라인 상태'))).toBe(true);
    });
  });

  describe('getCacheMetrics', () => {
    it('should return metrics with correct structure', () => {
      const metrics = getCacheMetrics();
      
      expect(metrics).toHaveProperty('totalQueries');
      expect(metrics).toHaveProperty('activeQueries');
      expect(metrics).toHaveProperty('cachedQueries');
      expect(metrics).toHaveProperty('errorQueries');
      expect(metrics).toHaveProperty('hitRate');
      expect(metrics).toHaveProperty('memoryUsage');
      
      expect(typeof metrics.totalQueries).toBe('number');
      expect(typeof metrics.activeQueries).toBe('number');
      expect(typeof metrics.cachedQueries).toBe('number');
      expect(typeof metrics.errorQueries).toBe('number');
      expect(typeof metrics.hitRate).toBe('number');
      expect(typeof metrics.memoryUsage).toBe('number');
    });
  });
});
