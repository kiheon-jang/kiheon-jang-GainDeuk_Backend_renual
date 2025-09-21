/**
 * 성능 모니터링을 위한 커스텀 훅
 */

import { useEffect, useRef, useCallback } from 'react';
import { mark, measure, measureApiRequest, measureUserInteraction } from '@/utils/performance';
import { storage } from '@/utils/storage';

interface PerformanceMetrics {
  renderTime: number;
  mountTime: number;
  updateCount: number;
  lastUpdateTime: number;
}

/**
 * 성능 모니터링이 활성화되어 있는지 확인
 */
const isPerformanceMonitoringEnabled = (): boolean => {
  try {
    const settings = storage.get('user-settings');
    return settings?.app?.performanceMonitoring ?? true; // 기본값은 true
  } catch {
    return true; // 오류 시 기본값은 true
  }
};

/**
 * 컴포넌트 성능 모니터링 훅
 */
export const usePerformanceMonitoring = (componentName: string) => {
  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    mountTime: 0,
    updateCount: 0,
    lastUpdateTime: 0
  });
  
  const mountTimeRef = useRef<number>(0);
  const renderStartTimeRef = useRef<number>(0);

  // 컴포넌트 마운트 시점 기록
  useEffect(() => {
    mountTimeRef.current = performance.now();
    metricsRef.current.mountTime = mountTimeRef.current;
    
    mark('component-render-start', componentName);
    
    return () => {
      const unmountTime = performance.now();
      const totalMountTime = unmountTime - mountTimeRef.current;
      
      if (process.env.NODE_ENV === 'development' && isPerformanceMonitoringEnabled()) {
        console.log(`🔧 ${componentName} total mount time: ${totalMountTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);

  // 렌더링 시간 측정 (throttled) - 의존성 배열 추가로 무한 루프 방지
  useEffect(() => {
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTimeRef.current;
    
    // 업데이트 횟수를 제한하여 과도한 로깅 방지
    const shouldLog = metricsRef.current.updateCount % 10 === 0 || renderTime > 16;
    
    metricsRef.current.renderTime = renderTime;
    metricsRef.current.updateCount += 1;
    metricsRef.current.lastUpdateTime = renderEndTime;
    
    mark('component-render-end', componentName);
    
    const duration = measure(
      `component-${componentName}`,
      'component-render-start',
      'component-render-end',
      componentName
    );
    
    if (process.env.NODE_ENV === 'development' && isPerformanceMonitoringEnabled() && duration && shouldLog) {
      console.log(`🎨 ${componentName} render time: ${duration.toFixed(2)}ms (update #${metricsRef.current.updateCount})`);
    }
  }, [componentName]); // componentName을 의존성으로 추가

  // 렌더링 시작 시간 기록
  renderStartTimeRef.current = performance.now();

  return {
    metrics: metricsRef.current,
    markRenderStart: useCallback(() => {
      renderStartTimeRef.current = performance.now();
      mark('component-render-start', componentName);
    }, [componentName]),
    markRenderEnd: useCallback(() => {
      const renderEndTime = performance.now();
      const renderTime = renderEndTime - renderStartTimeRef.current;
      
      metricsRef.current.renderTime = renderTime;
      metricsRef.current.updateCount += 1;
      metricsRef.current.lastUpdateTime = renderEndTime;
      
      mark('component-render-end', componentName);
      
      const duration = measure(
        `component-${componentName}`,
        'component-render-start',
        'component-render-end',
        componentName
      );
      
      if (process.env.NODE_ENV === 'development' && duration) {
        console.log(`🎨 ${componentName} render time: ${duration.toFixed(2)}ms`);
      }
    }, [componentName])
  };
};

/**
 * API 요청 성능 모니터링 훅
 */
export const useApiPerformanceMonitoring = () => {
  const measureRequest = useCallback(<T>(
    requestName: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    return measureApiRequest(requestName, apiCall);
  }, []);

  return { measureRequest };
};

/**
 * 사용자 상호작용 성능 모니터링 훅
 */
export const useInteractionPerformanceMonitoring = () => {
  const measureInteraction = useCallback((
    interactionName: string,
    callback: () => void | Promise<void>
  ) => {
    return measureUserInteraction(interactionName, callback);
  }, []);

  return { measureInteraction };
};

/**
 * 페이지 로드 성능 모니터링 훅
 */
export const usePageLoadPerformance = () => {
  useEffect(() => {
    const startTime = performance.now();
    
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📄 Page load time: ${loadTime.toFixed(2)}ms`);
      }
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);
};

/**
 * 메모리 사용량 모니터링 훅
 */
export const useMemoryMonitoring = (interval: number = 5000) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'memory' in window.performance) {
      const memory = (window.performance as any).memory;
      
      if (memory) {
        const logMemoryUsage = () => {
          const metrics = {
            used: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
            total: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
            limit: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)
          };
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`💾 Memory: ${metrics.used}MB / ${metrics.total}MB (limit: ${metrics.limit}MB)`);
          }
        };

        const intervalId = setInterval(logMemoryUsage, interval);
        return () => clearInterval(intervalId);
      }
    }
  }, [interval]);
};

/**
 * 성능 경고 훅
 */
export const usePerformanceWarnings = () => {
  const checkPerformance = useCallback((metrics: PerformanceMetrics) => {
    const warnings: string[] = [];
    
    // 렌더링 시간이 16ms (60fps)를 초과하는 경우
    if (metrics.renderTime > 16) {
      warnings.push(`Slow render: ${metrics.renderTime.toFixed(2)}ms`);
    }
    
    // 업데이트 횟수가 10회를 초과하는 경우
    if (metrics.updateCount > 10) {
      warnings.push(`Too many updates: ${metrics.updateCount} times`);
    }
    
    if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Performance warnings:', warnings);
    }
    
    return warnings;
  }, []);

  return { checkPerformance };
};
