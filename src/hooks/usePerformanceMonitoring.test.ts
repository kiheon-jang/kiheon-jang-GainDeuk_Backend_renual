// src/hooks/usePerformanceMonitoring.test.ts
import { renderHook, act } from '@testing-library/react';
import { 
  usePerformanceMonitoring, 
  useComponentPerformance, 
  usePerformanceGrade, 
  usePerformanceAlerts,
  usePerformanceBenchmark 
} from './usePerformanceMonitoring';
import * as performanceUtils from '@/utils/performance';

// Mock performance utilities
jest.mock('@/utils/performance', () => ({
  getPerformanceMetrics: jest.fn(),
  addCustomMetric: jest.fn(),
  trackComponentRender: jest.fn(),
  getPerformanceGrade: jest.fn(),
  generatePerformanceReport: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock performance.now
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
  },
});

describe('usePerformanceMonitoring Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('[]');
    (performanceUtils.getPerformanceMetrics as jest.Mock).mockReturnValue({
      coreWebVitals: { lcp: 2000, fid: 50, cls: 0.05, fcp: 1500, ttfb: 600 },
      customMetrics: {},
      memoryUsage: { used: 1024, total: 2048, limit: 4096 },
      networkMetrics: { requests: 10, totalSize: 5120, averageResponseTime: 200 },
      renderMetrics: { componentRenderTimes: {}, averageRenderTime: 0 },
    });
    (performanceUtils.generatePerformanceReport as jest.Mock).mockReturnValue('{"test": "report"}');
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => usePerformanceMonitoring());
    
    expect(result.current.isMonitoring).toBe(false);
    expect(result.current.metrics).toBe(null);
    expect(result.current.alerts).toEqual([]);
  });

  it('should start monitoring', () => {
    const { result } = renderHook(() => usePerformanceMonitoring());
    
    act(() => {
      result.current.startMonitoring();
    });
    
    expect(result.current.isMonitoring).toBe(true);
    expect(performanceUtils.getPerformanceMetrics).toHaveBeenCalled();
  });

  it('should stop monitoring', () => {
    const { result } = renderHook(() => usePerformanceMonitoring());
    
    act(() => {
      result.current.startMonitoring();
    });
    
    expect(result.current.isMonitoring).toBe(true);
    
    act(() => {
      result.current.stopMonitoring();
    });
    
    expect(result.current.isMonitoring).toBe(false);
  });

  it('should add custom metric', () => {
    const { result } = renderHook(() => usePerformanceMonitoring());
    
    act(() => {
      result.current.addMetric('test-metric', 100);
    });
    
    expect(performanceUtils.addCustomMetric).toHaveBeenCalledWith('test-metric', 100);
  });

  it('should generate performance report', () => {
    const { result } = renderHook(() => usePerformanceMonitoring());
    
    const report = result.current.generateReport();
    
    expect(performanceUtils.generatePerformanceReport).toHaveBeenCalled();
    expect(report).toBe('{"test": "report"}');
  });

  it('should clear alerts', () => {
    const { result } = renderHook(() => usePerformanceMonitoring());
    
    act(() => {
      result.current.clearAlerts();
    });
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('performance-issues');
  });
});

describe('useComponentPerformance Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should track component render time', () => {
    const { result } = renderHook(() => useComponentPerformance('TestComponent'));
    
    act(() => {
      result.current.markRenderStart();
    });
    
    act(() => {
      result.current.markRenderEnd();
    });
    
    expect(performanceUtils.trackComponentRender).toHaveBeenCalledWith('TestComponent', expect.any(Number));
  });

  it('should increment render count', () => {
    const { result } = renderHook(() => useComponentPerformance('TestComponent'));
    
    act(() => {
      result.current.markRenderStart();
      result.current.markRenderEnd();
    });
    
    act(() => {
      result.current.markRenderStart();
      result.current.markRenderEnd();
    });
    
    expect(result.current.renderCount).toBe(2);
  });
});

describe('usePerformanceGrade Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (performanceUtils.getPerformanceGrade as jest.Mock).mockReturnValue('good');
  });

  it('should check performance grade', () => {
    const { result } = renderHook(() => usePerformanceGrade());
    
    const grade = result.current.checkGrade('LCP', 2000);
    
    expect(performanceUtils.getPerformanceGrade).toHaveBeenCalledWith('LCP', 2000);
    expect(grade).toBe('good');
  });

  it('should return correct grade color', () => {
    const { result } = renderHook(() => usePerformanceGrade());
    
    expect(result.current.getGradeColor('good')).toBe('#10B981');
    expect(result.current.getGradeColor('needs-improvement')).toBe('#F59E0B');
    expect(result.current.getGradeColor('poor')).toBe('#EF4444');
  });

  it('should return correct grade icon', () => {
    const { result } = renderHook(() => usePerformanceGrade());
    
    expect(result.current.getGradeIcon('good')).toBe('✅');
    expect(result.current.getGradeIcon('needs-improvement')).toBe('⚠️');
    expect(result.current.getGradeIcon('poor')).toBe('❌');
  });
});

describe('usePerformanceAlerts Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(JSON.stringify([
      { metric: 'LCP', value: 5000, grade: 'poor', timestamp: Date.now() },
      { metric: 'FID', value: 400, grade: 'poor', timestamp: Date.now() - 1000 },
    ]));
  });

  it('should load performance alerts', () => {
    const { result } = renderHook(() => usePerformanceAlerts());
    
    expect(result.current.alerts).toHaveLength(2);
    expect(result.current.alerts[0]).toHaveProperty('metric', 'LCP');
    expect(result.current.alerts[1]).toHaveProperty('metric', 'FID');
  });

  it('should dismiss individual alert', () => {
    const { result } = renderHook(() => usePerformanceAlerts());
    
    const alertId = result.current.alerts[0].id;
    
    act(() => {
      result.current.dismissAlert(alertId);
    });
    
    expect(result.current.alerts).toHaveLength(1);
  });

  it('should dismiss all alerts', () => {
    const { result } = renderHook(() => usePerformanceAlerts());
    
    act(() => {
      result.current.dismissAllAlerts();
    });
    
    expect(result.current.alerts).toHaveLength(0);
  });

  it('should clear all alerts', () => {
    const { result } = renderHook(() => usePerformanceAlerts());
    
    act(() => {
      result.current.clearAlerts();
    });
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('performance-issues');
    expect(result.current.alerts).toHaveLength(0);
  });
});

describe('usePerformanceBenchmark Hook', () => {
  it('should track benchmark times', () => {
    const { result } = renderHook(() => usePerformanceBenchmark());
    
    const startTime = result.current.startBenchmark('test-benchmark');
    
    act(() => {
      result.current.endBenchmark('test-benchmark', startTime);
    });
    
    const stats = result.current.getBenchmarkStats('test-benchmark');
    expect(stats).toBeDefined();
    expect(stats?.count).toBe(1);
  });

  it('should calculate benchmark statistics', () => {
    const { result } = renderHook(() => usePerformanceBenchmark());
    
    // Add multiple benchmark times
    const startTime1 = result.current.startBenchmark('test-benchmark');
    act(() => {
      result.current.endBenchmark('test-benchmark', startTime1);
    });
    
    const startTime2 = result.current.startBenchmark('test-benchmark');
    act(() => {
      result.current.endBenchmark('test-benchmark', startTime2);
    });
    
    const stats = result.current.getBenchmarkStats('test-benchmark');
    expect(stats?.count).toBe(2);
    expect(stats?.average).toBeDefined();
    expect(stats?.min).toBeDefined();
    expect(stats?.max).toBeDefined();
  });

  it('should clear benchmark data', () => {
    const { result } = renderHook(() => usePerformanceBenchmark());
    
    const startTime = result.current.startBenchmark('test-benchmark');
    act(() => {
      result.current.endBenchmark('test-benchmark', startTime);
    });
    
    expect(result.current.getBenchmarkStats('test-benchmark')).toBeDefined();
    
    act(() => {
      result.current.clearBenchmark('test-benchmark');
    });
    
    expect(result.current.getBenchmarkStats('test-benchmark')).toBeNull();
  });
});
