/**
 * 성능 모니터링 훅 테스트
 */

import { renderHook, act } from '@testing-library/react';
import {
  usePerformanceMonitoring,
  useApiPerformanceMonitoring,
  useInteractionPerformanceMonitoring,
  usePageLoadPerformance,
  useMemoryMonitoring,
  usePerformanceWarnings
} from './usePerformance';

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => [])
};

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true
});

// Mock performance utilities
jest.mock('@/utils/performance', () => ({
  mark: jest.fn(),
  measure: jest.fn(() => 100),
  measureApiRequest: jest.fn(),
  measureUserInteraction: jest.fn()
}));

describe('Performance Monitoring Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('usePerformanceMonitoring', () => {
    it('should track component performance metrics', () => {
      const { result } = renderHook(() => usePerformanceMonitoring('TestComponent'));
      
      expect(result.current.metrics).toHaveProperty('renderTime');
      expect(result.current.metrics).toHaveProperty('mountTime');
      expect(result.current.metrics).toHaveProperty('updateCount');
      expect(result.current.metrics).toHaveProperty('lastUpdateTime');
    });

    it('should provide render tracking functions', () => {
      const { result } = renderHook(() => usePerformanceMonitoring('TestComponent'));
      
      expect(typeof result.current.markRenderStart).toBe('function');
      expect(typeof result.current.markRenderEnd).toBe('function');
    });

    it('should track render start and end', () => {
      const { result } = renderHook(() => usePerformanceMonitoring('TestComponent'));
      
      act(() => {
        result.current.markRenderStart();
      });
      
      act(() => {
        result.current.markRenderEnd();
      });
      
      expect(result.current.metrics.updateCount).toBeGreaterThan(0);
    });
  });

  describe('useApiPerformanceMonitoring', () => {
    it('should provide API request measurement function', () => {
      const { result } = renderHook(() => useApiPerformanceMonitoring());
      
      expect(typeof result.current.measureRequest).toBe('function');
    });

    it('should measure API request performance', async () => {
      const { result } = renderHook(() => useApiPerformanceMonitoring());
      const mockApiCall = jest.fn().mockResolvedValue('success');
      
      await act(async () => {
        await result.current.measureRequest('test-api', mockApiCall);
      });
      
      expect(mockApiCall).toHaveBeenCalled();
    });
  });

  describe('useInteractionPerformanceMonitoring', () => {
    it('should provide interaction measurement function', () => {
      const { result } = renderHook(() => useInteractionPerformanceMonitoring());
      
      expect(typeof result.current.measureInteraction).toBe('function');
    });

    it('should measure user interaction performance', async () => {
      const { result } = renderHook(() => useInteractionPerformanceMonitoring());
      const mockCallback = jest.fn().mockResolvedValue(undefined);
      
      const wrappedCallback = result.current.measureInteraction('test-interaction', mockCallback);
      
      await act(async () => {
        await wrappedCallback();
      });
      
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('usePageLoadPerformance', () => {
    it('should track page load performance', () => {
      const { result } = renderHook(() => usePageLoadPerformance());
      
      // Hook should not throw errors
      expect(result.current).toBeUndefined();
    });
  });

  describe('useMemoryMonitoring', () => {
    it('should monitor memory usage', () => {
      const { result } = renderHook(() => useMemoryMonitoring(1000));
      
      // Hook should not throw errors
      expect(result.current).toBeUndefined();
    });
  });

  describe('usePerformanceWarnings', () => {
    it('should provide performance warning function', () => {
      const { result } = renderHook(() => usePerformanceWarnings());
      
      expect(typeof result.current.checkPerformance).toBe('function');
    });

    it('should detect slow render warnings', () => {
      const { result } = renderHook(() => usePerformanceWarnings());
      
      const metrics = {
        renderTime: 20, // Exceeds 16ms threshold
        mountTime: Date.now(),
        updateCount: 5,
        lastUpdateTime: Date.now()
      };
      
      const warnings = result.current.checkPerformance(metrics);
      
      expect(warnings).toContain('Slow render: 20.00ms');
    });

    it('should detect too many updates warnings', () => {
      const { result } = renderHook(() => usePerformanceWarnings());
      
      const metrics = {
        renderTime: 10,
        mountTime: Date.now(),
        updateCount: 15, // Exceeds 10 updates threshold
        lastUpdateTime: Date.now()
      };
      
      const warnings = result.current.checkPerformance(metrics);
      
      expect(warnings).toContain('Too many updates: 15 times');
    });

    it('should return empty warnings for good performance', () => {
      const { result } = renderHook(() => usePerformanceWarnings());
      
      const metrics = {
        renderTime: 8,
        mountTime: Date.now(),
        updateCount: 3,
        lastUpdateTime: Date.now()
      };
      
      const warnings = result.current.checkPerformance(metrics);
      
      expect(warnings).toHaveLength(0);
    });
  });
});
