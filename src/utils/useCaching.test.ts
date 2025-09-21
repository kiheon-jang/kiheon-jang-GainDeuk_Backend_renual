// src/hooks/useCaching.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCaching, useOfflineStatus, useCachePerformance, useCacheOptimization } from './useCaching';
import * as cachingUtils from '@/utils/caching';

// Mock caching utilities
jest.mock('@/utils/caching', () => ({
  getCacheStatus: jest.fn(),
  getCacheMetrics: jest.fn(),
  clearCacheByStrategy: jest.fn(),
  clearAllCache: jest.fn(),
  getCacheOptimizationTips: jest.fn(),
  smartPreload: jest.fn(),
  handleOfflineMode: jest.fn(),
}));

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
});

describe('useCaching Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (cachingUtils.getCacheStatus as jest.Mock).mockResolvedValue({
      isOnline: true,
      cacheSize: 10,
      lastUpdated: new Date(),
      strategies: { REALTIME: 2, FREQUENT: 3, MODERATE: 4, STATIC: 1 }
    });
    (cachingUtils.getCacheMetrics as jest.Mock).mockReturnValue({
      totalQueries: 10,
      activeQueries: 2,
      cachedQueries: 8,
      errorQueries: 0,
      hitRate: 80,
      memoryUsage: 1024
    });
    (cachingUtils.getCacheOptimizationTips as jest.Mock).mockReturnValue([
      '캐시 최적화 권장사항 1',
      '캐시 최적화 권장사항 2'
    ]);
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useCaching());
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.cacheStatus).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should load cache status on mount', async () => {
    const { result } = renderHook(() => useCaching());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(cachingUtils.getCacheStatus).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.cacheStatus).toBeDefined();
  });

  it('should handle cache clearing', async () => {
    const { result } = renderHook(() => useCaching());
    
    await act(async () => {
      await result.current.clearCache('REALTIME');
    });
    
    expect(cachingUtils.clearCacheByStrategy).toHaveBeenCalledWith('REALTIME');
  });

  it('should handle data preloading', async () => {
    const { result } = renderHook(() => useCaching());
    
    await act(async () => {
      await result.current.preloadData('user123');
    });
    
    expect(cachingUtils.smartPreload).toHaveBeenCalledWith('user123');
  });

  it('should update cache status periodically', async () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useCaching());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    const initialCallCount = (cachingUtils.getCacheStatus as jest.Mock).mock.calls.length;
    
    act(() => {
      jest.advanceTimersByTime(30000); // 30 seconds
    });
    
    expect((cachingUtils.getCacheStatus as jest.Mock).mock.calls.length).toBeGreaterThan(initialCallCount);
    
    jest.useRealTimers();
  });
});

describe('useOfflineStatus Hook', () => {
  beforeEach(() => {
    navigator.onLine = true;
  });

  it('should track online status', () => {
    const { result } = renderHook(() => useOfflineStatus());
    
    expect(result.current.isOnline).toBe(true);
    expect(result.current.lastOnlineTime).toBe(null);
    expect(result.current.lastOfflineTime).toBe(null);
  });

  it('should update status when going offline', () => {
    const { result } = renderHook(() => useOfflineStatus());
    
    act(() => {
      navigator.onLine = false;
      window.dispatchEvent(new Event('offline'));
    });
    
    expect(result.current.isOnline).toBe(false);
    expect(result.current.lastOfflineTime).toBeInstanceOf(Date);
  });

  it('should update status when going online', () => {
    const { result } = renderHook(() => useOfflineStatus());
    
    // First go offline
    act(() => {
      navigator.onLine = false;
      window.dispatchEvent(new Event('offline'));
    });
    
    // Then go online
    act(() => {
      navigator.onLine = true;
      window.dispatchEvent(new Event('online'));
    });
    
    expect(result.current.isOnline).toBe(true);
    expect(result.current.lastOnlineTime).toBeInstanceOf(Date);
  });

  it('should calculate offline duration', () => {
    const { result } = renderHook(() => useOfflineStatus());
    
    act(() => {
      navigator.onLine = false;
      window.dispatchEvent(new Event('offline'));
    });
    
    // Wait a bit
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.offlineDuration).toBeGreaterThan(0);
  });
});

describe('useCachePerformance Hook', () => {
  beforeEach(() => {
    (cachingUtils.getCacheMetrics as jest.Mock).mockReturnValue({
      totalQueries: 10,
      activeQueries: 2,
      cachedQueries: 8,
      errorQueries: 0,
      hitRate: 80,
      memoryUsage: 1024
    });
  });

  it('should initialize with default metrics', () => {
    const { result } = renderHook(() => useCachePerformance());
    
    expect(result.current.isMonitoring).toBe(false);
    expect(result.current.metrics).toBeDefined();
  });

  it('should start monitoring when requested', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useCachePerformance());
    
    act(() => {
      result.current.startMonitoring();
    });
    
    expect(result.current.isMonitoring).toBe(true);
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(cachingUtils.getCacheMetrics).toHaveBeenCalledTimes(2); // Initial + after 5 seconds
    
    jest.useRealTimers();
  });

  it('should stop monitoring when requested', () => {
    const { result } = renderHook(() => useCachePerformance());
    
    act(() => {
      result.current.startMonitoring();
    });
    
    expect(result.current.isMonitoring).toBe(true);
    
    act(() => {
      result.current.stopMonitoring();
    });
    
    expect(result.current.isMonitoring).toBe(false);
  });
});

describe('useCacheOptimization Hook', () => {
  beforeEach(() => {
    (cachingUtils.getCacheOptimizationTips as jest.Mock).mockReturnValue([
      '캐시 최적화 권장사항 1',
      '캐시 최적화 권장사항 2'
    ]);
  });

  it('should initialize with tips', () => {
    const { result } = renderHook(() => useCacheOptimization());
    
    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.tips).toEqual([
      '캐시 최적화 권장사항 1',
      '캐시 최적화 권장사항 2'
    ]);
  });

  it('should analyze cache on mount', () => {
    renderHook(() => useCacheOptimization());
    
    expect(cachingUtils.getCacheOptimizationTips).toHaveBeenCalled();
  });

  it('should analyze cache periodically', () => {
    jest.useFakeTimers();
    
    renderHook(() => useCacheOptimization());
    
    const initialCallCount = (cachingUtils.getCacheOptimizationTips as jest.Mock).mock.calls.length;
    
    act(() => {
      jest.advanceTimersByTime(60000); // 1 minute
    });
    
    expect((cachingUtils.getCacheOptimizationTips as jest.Mock).mock.calls.length).toBeGreaterThan(initialCallCount);
    
    jest.useRealTimers();
  });

  it('should handle manual analysis', async () => {
    const { result } = renderHook(() => useCacheOptimization());
    
    await act(async () => {
      await result.current.analyzeCache();
    });
    
    expect(cachingUtils.getCacheOptimizationTips).toHaveBeenCalled();
  });
});
