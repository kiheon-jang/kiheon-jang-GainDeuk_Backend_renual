// src/utils/performance.test.ts
import { 
  mark, 
  measure, 
  measurePageLoad, 
  measureApiRequest, 
  measureUserInteraction,
  measureMemoryUsage,
  initPerformanceMonitoring,
  initCoreWebVitals,
  getPerformanceGrade,
  getPerformanceMetrics,
  addCustomMetric,
  trackComponentRender,
  updateNetworkMetrics,
  generatePerformanceReport,
  PERFORMANCE_THRESHOLDS
} from './performance';

// Mock performance API
const mockPerformance = {
  mark: jest.fn(),
  measure: jest.fn(),
  now: jest.fn(() => Date.now()),
  getEntriesByName: jest.fn(() => [{ duration: 100 }]),
  getEntriesByType: jest.fn(() => [{
    domContentLoadedEventEnd: 1000,
    domContentLoadedEventStart: 900,
    loadEventEnd: 2000,
    loadEventStart: 1900,
    fetchStart: 0,
    responseStart: 500,
    requestStart: 400,
    entryType: 'navigation'
  }]),
  getEntries: jest.fn(() => [])
};

const mockPerformanceObserver = jest.fn((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}));

// Mock window.performance
Object.defineProperty(window, 'performance', {
  writable: true,
  value: mockPerformance,
});

// Mock PerformanceObserver
Object.defineProperty(window, 'PerformanceObserver', {
  writable: true,
  value: mockPerformanceObserver,
});

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

// Mock navigator
Object.defineProperty(navigator, 'userAgent', {
  writable: true,
  value: 'Mozilla/5.0 (Test Browser)',
});

describe('Performance Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('[]');
  });

  describe('mark', () => {
    it('should create a performance mark', () => {
      mark('page-load-start');
      expect(mockPerformance.mark).toHaveBeenCalledWith('page-load-start');
    });

    it('should create a performance mark with detail', () => {
      mark('page-load-start', 'test');
      expect(mockPerformance.mark).toHaveBeenCalledWith('page-load-start-test');
    });

    it('should not create mark in SSR environment', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      
      mark('page-load-start');
      expect(mockPerformance.mark).not.toHaveBeenCalled();
      
      global.window = originalWindow;
    });
  });

  describe('measure', () => {
    it('should create a performance measure', () => {
      measure('page-load', 'page-load-start', 'page-load-end');
      expect(mockPerformance.measure).toHaveBeenCalledWith('page-load', 'page-load-start', 'page-load-end');
    });

    it('should return duration from measure', () => {
      const duration = measure('page-load', 'page-load-start', 'page-load-end');
      expect(duration).toBe(100);
    });

    it('should handle measure errors gracefully', () => {
      mockPerformance.measure.mockImplementation(() => {
        throw new Error('Measure failed');
      });
      
      const duration = measure('page-load', 'page-load-start', 'page-load-end');
      expect(duration).toBeNull();
    });
  });

  describe('measurePageLoad', () => {
    it('should set up page load measurement', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      measurePageLoad();
      expect(addEventListenerSpy).toHaveBeenCalledWith('load', expect.any(Function));
    });
  });

  describe('measureApiRequest', () => {
    it('should measure API request duration', async () => {
      const mockApiCall = jest.fn().mockResolvedValue('success');
      
      const result = await measureApiRequest('test-api', mockApiCall);
      
      expect(result).toBe('success');
      expect(mockApiCall).toHaveBeenCalled();
      expect(mockPerformance.mark).toHaveBeenCalledWith('api-test-api-start');
      expect(mockPerformance.mark).toHaveBeenCalledWith('api-test-api-end');
    });

    it('should handle API request errors', async () => {
      const mockApiCall = jest.fn().mockRejectedValue(new Error('API Error'));
      
      await expect(measureApiRequest('test-api', mockApiCall)).rejects.toThrow('API Error');
      expect(mockPerformance.mark).toHaveBeenCalledWith('api-test-api-end');
    });
  });

  describe('measureUserInteraction', () => {
    it('should measure user interaction duration', async () => {
      const mockCallback = jest.fn().mockResolvedValue(undefined);
      
      const wrappedCallback = measureUserInteraction('test-interaction', mockCallback);
      await wrappedCallback();
      
      expect(mockCallback).toHaveBeenCalled();
      expect(mockPerformance.mark).toHaveBeenCalledWith('user-interaction-start-test-interaction');
      expect(mockPerformance.mark).toHaveBeenCalledWith('user-interaction-end-test-interaction');
    });
  });

  describe('measureMemoryUsage', () => {
    it('should measure memory usage when available', () => {
      const mockMemory = {
        usedJSHeapSize: 1024 * 1024,
        totalJSHeapSize: 2048 * 1024,
        jsHeapSizeLimit: 4096 * 1024
      };
      
      Object.defineProperty(mockPerformance, 'memory', {
        value: mockMemory,
        writable: true
      });
      
      measureMemoryUsage();
      // Should not throw error
    });

    it('should handle missing memory API gracefully', () => {
      Object.defineProperty(mockPerformance, 'memory', {
        value: undefined,
        writable: true
      });
      
      expect(() => measureMemoryUsage()).not.toThrow();
    });
  });

  describe('initCoreWebVitals', () => {
    it('should initialize Core Web Vitals observers', () => {
      initCoreWebVitals();
      expect(mockPerformanceObserver).toHaveBeenCalled();
    });

    it('should handle missing PerformanceObserver gracefully', () => {
      const originalObserver = window.PerformanceObserver;
      // @ts-ignore
      delete window.PerformanceObserver;
      
      expect(() => initCoreWebVitals()).not.toThrow();
      
      window.PerformanceObserver = originalObserver;
    });
  });

  describe('getPerformanceGrade', () => {
    it('should return correct grade for LCP', () => {
      expect(getPerformanceGrade('LCP', 2000)).toBe('good');
      expect(getPerformanceGrade('LCP', 3000)).toBe('needs-improvement');
      expect(getPerformanceGrade('LCP', 5000)).toBe('poor');
    });

    it('should return correct grade for FID', () => {
      expect(getPerformanceGrade('FID', 50)).toBe('good');
      expect(getPerformanceGrade('FID', 200)).toBe('needs-improvement');
      expect(getPerformanceGrade('FID', 400)).toBe('poor');
    });

    it('should return correct grade for CLS', () => {
      expect(getPerformanceGrade('CLS', 0.05)).toBe('good');
      expect(getPerformanceGrade('CLS', 0.15)).toBe('needs-improvement');
      expect(getPerformanceGrade('CLS', 0.3)).toBe('poor');
    });
  });

  describe('getPerformanceMetrics', () => {
    it('should return performance metrics', () => {
      const metrics = getPerformanceMetrics();
      expect(metrics).toHaveProperty('coreWebVitals');
      expect(metrics).toHaveProperty('customMetrics');
      expect(metrics).toHaveProperty('memoryUsage');
      expect(metrics).toHaveProperty('networkMetrics');
      expect(metrics).toHaveProperty('renderMetrics');
    });
  });

  describe('addCustomMetric', () => {
    it('should add custom metric', () => {
      addCustomMetric('test-metric', 100);
      const metrics = getPerformanceMetrics();
      expect(metrics.customMetrics['test-metric']).toBe(100);
    });
  });

  describe('trackComponentRender', () => {
    it('should track component render time', () => {
      trackComponentRender('TestComponent', 50);
      const metrics = getPerformanceMetrics();
      expect(metrics.renderMetrics.componentRenderTimes['TestComponent']).toBe(50);
      expect(metrics.renderMetrics.averageRenderTime).toBe(50);
    });

    it('should calculate average render time for multiple components', () => {
      trackComponentRender('Component1', 30);
      trackComponentRender('Component2', 70);
      const metrics = getPerformanceMetrics();
      expect(metrics.renderMetrics.averageRenderTime).toBe(50);
    });
  });

  describe('updateNetworkMetrics', () => {
    it('should update network metrics', () => {
      updateNetworkMetrics(200, 1024);
      const metrics = getPerformanceMetrics();
      expect(metrics.networkMetrics.requests).toBe(1);
      expect(metrics.networkMetrics.totalSize).toBe(1024);
      expect(metrics.networkMetrics.averageResponseTime).toBe(200);
    });

    it('should calculate average response time correctly', () => {
      updateNetworkMetrics(100, 512);
      updateNetworkMetrics(300, 1024);
      const metrics = getPerformanceMetrics();
      expect(metrics.networkMetrics.requests).toBe(2);
      expect(metrics.networkMetrics.averageResponseTime).toBe(200);
    });
  });

  describe('generatePerformanceReport', () => {
    it('should generate performance report', () => {
      const report = generatePerformanceReport();
      const parsedReport = JSON.parse(report);
      
      expect(parsedReport).toHaveProperty('timestamp');
      expect(parsedReport).toHaveProperty('url');
      expect(parsedReport).toHaveProperty('coreWebVitals');
      expect(parsedReport).toHaveProperty('customMetrics');
      expect(parsedReport).toHaveProperty('memoryUsage');
      expect(parsedReport).toHaveProperty('networkMetrics');
      expect(parsedReport).toHaveProperty('renderMetrics');
      expect(parsedReport).toHaveProperty('performanceIssues');
    });
  });

  describe('initPerformanceMonitoring', () => {
    it('should initialize performance monitoring', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const setIntervalSpy = jest.spyOn(global, 'setInterval');
      
      initPerformanceMonitoring();
      
      expect(addEventListenerSpy).toHaveBeenCalled();
      expect(setIntervalSpy).toHaveBeenCalled();
    });

    it('should not initialize in SSR environment', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      
      expect(() => initPerformanceMonitoring()).not.toThrow();
      
      global.window = originalWindow;
    });
  });
});