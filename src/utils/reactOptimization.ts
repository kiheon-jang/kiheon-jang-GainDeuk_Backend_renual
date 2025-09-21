/**
 * React 컴포넌트 최적화 유틸리티
 * React.memo, useMemo, useCallback 등을 활용한 성능 최적화
 */

import React, { memo, useMemo, useCallback, useRef, useEffect, useState } from 'react';

// React.memo 비교 함수 타입
export type MemoComparisonFunction<T> = (prevProps: T, nextProps: T) => boolean;

// 메모이제이션 옵션
export interface MemoizationOptions {
  deep?: boolean;
  customCompare?: MemoComparisonFunction<any>;
  displayName?: string;
}

// 성능 측정 결과
export interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  totalRenderTime: number;
}

// 성능 측정 훅
export const usePerformanceMetrics = (componentName: string) => {
  const renderCountRef = useRef(0);
  const renderTimesRef = useRef<number[]>([]);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = performance.now();
  });

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTimeRef.current;
    
    renderCountRef.current += 1;
    renderTimesRef.current.push(renderTime);
    
    // 최근 10번의 렌더링 시간만 유지
    if (renderTimesRef.current.length > 10) {
      renderTimesRef.current.shift();
    }
  });

  const metrics: PerformanceMetrics = useMemo(() => {
    const renderCount = renderCountRef.current;
    const renderTimes = renderTimesRef.current;
    const totalRenderTime = renderTimes.reduce((sum, time) => sum + time, 0);
    const averageRenderTime = renderTimes.length > 0 ? totalRenderTime / renderTimes.length : 0;
    const lastRenderTime = renderTimes.length > 0 ? renderTimes[renderTimes.length - 1] : 0;

    return {
      renderCount,
      lastRenderTime,
      averageRenderTime,
      totalRenderTime
    };
  }, [renderCountRef.current]);

  // 개발 모드에서만 로깅
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && renderCountRef.current > 1) {
      console.log(`[${componentName}] Render #${renderCountRef.current}:`, {
        lastRenderTime: `${metrics.lastRenderTime.toFixed(2)}ms`,
        averageRenderTime: `${metrics.averageRenderTime.toFixed(2)}ms`,
        totalRenders: metrics.renderCount
      });
    }
  }, [componentName, metrics]);

  return metrics;
};

// 깊은 비교 함수
export const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  
  if (obj1 == null || obj2 == null) return obj1 === obj2;
  
  if (typeof obj1 !== typeof obj2) return false;
  
  if (typeof obj1 !== 'object') return obj1 === obj2;
  
  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;
  
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) return false;
    }
    return true;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  
  return true;
};

// 얕은 비교 함수 (React.memo 기본값)
export const shallowEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  
  if (obj1 == null || obj2 == null) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
};

// 최적화된 React.memo 래퍼
export const optimizedMemo = <T extends React.ComponentType<any>>(
  Component: T,
  options: MemoizationOptions = {}
): T => {
  const { deep = false, customCompare, displayName } = options;
  
  const compareFunction = customCompare || (deep ? deepEqual : shallowEqual);
  
  const MemoizedComponent = memo(Component, compareFunction) as T;
  
  if (displayName) {
    MemoizedComponent.displayName = displayName;
  }
  
  return MemoizedComponent;
};

// 객체 메모이제이션 훅
export const useStableObject = <T extends Record<string, any>>(obj: T): T => {
  return useMemo(() => obj, Object.values(obj));
};

// 배열 메모이제이션 훅
export const useStableArray = <T>(arr: T[]): T[] => {
  return useMemo(() => arr, arr);
};

// 함수 메모이제이션 훅 (의존성 배열 자동 감지)
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps);
};

// 이전 값과 비교하여 변경된 경우에만 업데이트
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

// 값이 변경되었는지 확인하는 훅
export const useHasChanged = <T>(value: T): boolean => {
  const prevValue = usePrevious(value);
  return prevValue !== value;
};

// 디바운스된 값 훅
export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// 쓰로틀된 값 훅
export const useThrottledValue = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdateRef = useRef<number>(0);
  
  useEffect(() => {
    const now = Date.now();
    
    if (now - lastUpdateRef.current >= delay) {
      setThrottledValue(value);
      lastUpdateRef.current = now;
    } else {
      const timeout = setTimeout(() => {
        setThrottledValue(value);
        lastUpdateRef.current = Date.now();
      }, delay - (now - lastUpdateRef.current));
      
      return () => clearTimeout(timeout);
    }
  }, [value, delay]);
  
  return throttledValue;
};

// 조건부 메모이제이션 훅
export const useConditionalMemo = <T>(
  factory: () => T,
  deps: React.DependencyList,
  condition: boolean
): T => {
  return useMemo(() => {
    if (condition) {
      return factory();
    }
    return factory();
  }, condition ? deps : []);
};

// 안전한 메모이제이션 훅 (에러 처리 포함)
export const useSafeMemo = <T>(
  factory: () => T,
  deps: React.DependencyList,
  fallback: T
): T => {
  return useMemo(() => {
    try {
      return factory();
    } catch (error) {
      console.warn('useSafeMemo: Error in factory function:', error);
      return fallback;
    }
  }, deps);
};

// 컴포넌트 렌더링 최적화를 위한 HOC
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) => {
  const WrappedComponent = (props: P) => {
    const metrics = usePerformanceMetrics(componentName || Component.displayName || 'Unknown');
    
    return React.createElement(Component, props);
  };
  
  WrappedComponent.displayName = `withPerformanceTracking(${componentName || Component.displayName || 'Component'})`;
  
  return WrappedComponent;
};

// 렌더링 빈도 제한 HOC
export const withRenderThrottling = <P extends object>(
  Component: React.ComponentType<P>,
  throttleMs: number = 16 // ~60fps
) => {
  const ThrottledComponent = (props: P) => {
    const [throttledProps, setThrottledProps] = useState<P>(props);
    const lastRenderRef = useRef<number>(0);
    
    useEffect(() => {
      const now = Date.now();
      
      if (now - lastRenderRef.current >= throttleMs) {
        setThrottledProps(props);
        lastRenderRef.current = now;
      } else {
        const timeout = setTimeout(() => {
          setThrottledProps(props);
          lastRenderRef.current = Date.now();
        }, throttleMs - (now - lastRenderRef.current));
        
        return () => clearTimeout(timeout);
      }
    }, [props, throttleMs]);
    
    return React.createElement(Component, throttledProps);
  };
  
  ThrottledComponent.displayName = `withRenderThrottling(${Component.displayName || 'Component'})`;
  
  return ThrottledComponent;
};

// 메모이제이션 통계
export const getMemoizationStats = (): {
  memoizedComponents: number;
  totalRenders: number;
  skippedRenders: number;
  efficiency: number;
} => {
  // 실제 구현에서는 전역 상태나 컨텍스트를 통해 통계를 수집
  return {
    memoizedComponents: 0,
    totalRenders: 0,
    skippedRenders: 0,
    efficiency: 0
  };
};

// 성능 최적화 권장사항
export const getOptimizationRecommendations = (metrics: PerformanceMetrics): string[] => {
  const recommendations: string[] = [];
  
  if (metrics.averageRenderTime > 16) {
    recommendations.push('평균 렌더링 시간이 16ms를 초과합니다. React.memo를 고려해보세요.');
  }
  
  if (metrics.renderCount > 10) {
    recommendations.push('렌더링 횟수가 많습니다. useMemo나 useCallback을 사용해보세요.');
  }
  
  if (metrics.lastRenderTime > 50) {
    recommendations.push('마지막 렌더링 시간이 50ms를 초과합니다. 컴포넌트 분할을 고려해보세요.');
  }
  
  return recommendations;
};
