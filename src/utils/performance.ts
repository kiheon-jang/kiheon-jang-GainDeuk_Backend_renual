/**
 * 고급 성능 모니터링 및 Core Web Vitals 추적을 위한 유틸리티 함수들
 */

import React from 'react';
import { storage } from './index';

// 성능 마크 타입 정의
export type PerformanceMark = 
  | 'page-load-start'
  | 'page-load-end'
  | 'component-render-start'
  | 'component-render-end'
  | 'api-request-start'
  | 'api-request-end'
  | 'user-interaction-start'
  | 'user-interaction-end'
  | 'route-change-start'
  | 'route-change-end'
  | 'data-fetch-start'
  | 'data-fetch-end';

// Core Web Vitals 타입 정의
export interface CoreWebVitals {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
}

// 성능 메트릭 타입 정의
export interface PerformanceMetrics {
  coreWebVitals: CoreWebVitals;
  customMetrics: Record<string, number>;
  memoryUsage: {
    used: number;
    total: number;
    limit: number;
  };
  networkMetrics: {
    requests: number;
    totalSize: number;
    averageResponseTime: number;
  };
  renderMetrics: {
    componentRenderTimes: Record<string, number>;
    averageRenderTime: number;
  };
}

// 성능 임계값 정의
export const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // ms
  FID: { good: 100, poor: 300 }, // ms
  CLS: { good: 0.1, poor: 0.25 }, // score
  FCP: { good: 1800, poor: 3000 }, // ms
  TTFB: { good: 800, poor: 1800 }, // ms
} as const;

// 성능 등급 타입
export type PerformanceGrade = 'good' | 'needs-improvement' | 'poor';

// 성능 데이터 저장소
let performanceData: PerformanceMetrics = {
  coreWebVitals: {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
  },
  customMetrics: {},
  memoryUsage: { used: 0, total: 0, limit: 0 },
  networkMetrics: { requests: 0, totalSize: 0, averageResponseTime: 0 },
  renderMetrics: { componentRenderTimes: {}, averageRenderTime: 0 },
};

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
 * 성능 마크 생성
 */
export const mark = (name: PerformanceMark, detail?: string): void => {
  if (typeof window !== 'undefined' && window.performance) {
    const markName = detail ? `${name}-${detail}` : name;
    window.performance.mark(markName);
    
    // 개발 환경에서 콘솔에 로그 (성능 모니터링이 활성화된 경우에만)
    if (process.env.NODE_ENV === 'development' && isPerformanceMonitoringEnabled()) {
      console.log(`📊 Performance Mark: ${markName}`);
    }
  }
};

/**
 * 성능 측정 생성
 */
export const measure = (
  name: string, 
  startMark: PerformanceMark, 
  endMark: PerformanceMark,
  detail?: string
): number | null => {
  if (typeof window !== 'undefined' && window.performance) {
    const measureName = detail ? `${name}-${detail}` : name;
    const startMarkName = detail ? `${startMark}-${detail}` : startMark;
    const endMarkName = detail ? `${endMark}-${detail}` : endMark;
    
    try {
      window.performance.measure(measureName, startMarkName, endMarkName);
      const measure = window.performance.getEntriesByName(measureName)[0];
      const duration = measure ? measure.duration : 0;
      
      // 개발 환경에서 콘솔에 로그 (성능 모니터링이 활성화된 경우에만)
      if (process.env.NODE_ENV === 'development' && isPerformanceMonitoringEnabled()) {
        console.log(`⏱️ Performance Measure: ${measureName} - ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    } catch (error) {
      console.warn(`Failed to measure performance: ${measureName}`, error);
      return null;
    }
  }
  return null;
};

/**
 * 페이지 로드 시간 측정
 */
export const measurePageLoad = (): void => {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const metrics = {
          'DOM Content Loaded': navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          'Load Complete': navigation.loadEventEnd - navigation.loadEventStart,
          'Total Load Time': navigation.loadEventEnd - navigation.fetchStart,
          'First Paint': 0,
          'First Contentful Paint': 0,
          'Largest Contentful Paint': 0
        };
        
        // Core Web Vitals 측정
        if ('PerformanceObserver' in window) {
          // First Paint
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              metrics['First Paint'] = entries[0].startTime;
            }
          }).observe({ entryTypes: ['paint'] });
          
          // First Contentful Paint
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              metrics['First Contentful Paint'] = entries[0].startTime;
            }
          }).observe({ entryTypes: ['paint'] });
          
          // Largest Contentful Paint
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              metrics['Largest Contentful Paint'] = lastEntry.startTime;
            }
          }).observe({ entryTypes: ['largest-contentful-paint'] });
        }
        
        // 개발 환경에서 성능 메트릭 로그
        if (process.env.NODE_ENV === 'development') {
          console.group('🚀 Page Load Performance');
          Object.entries(metrics).forEach(([key, value]) => {
            console.log(`${key}: ${value.toFixed(2)}ms`);
          });
          console.groupEnd();
        }
      }
    });
  }
};

/**
 * 컴포넌트 렌더링 시간 측정을 위한 HOC
 */
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return React.memo((props: P) => {
    const startTime = performance.now();
    
    React.useEffect(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🎨 ${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    });
    
    return React.createElement(Component, props);
  });
};

/**
 * API 요청 시간 측정
 */
export const measureApiRequest = async <T>(
  requestName: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  mark('api-request-start', requestName);
  
  try {
    const result = await apiCall();
    mark('api-request-end', requestName);
    
    const duration = measure(
      `api-${requestName}`,
      'api-request-start',
      'api-request-end',
      requestName
    );
    
    if (process.env.NODE_ENV === 'development' && duration) {
      console.log(`🌐 API Request: ${requestName} - ${duration.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    mark('api-request-end', requestName);
    throw error;
  }
};

/**
 * 사용자 상호작용 시간 측정
 */
export const measureUserInteraction = (
  interactionName: string,
  callback: () => void | Promise<void>
) => {
  return async () => {
    mark('user-interaction-start', interactionName);
    
    try {
      await callback();
    } finally {
      mark('user-interaction-end', interactionName);
      
      const duration = measure(
        `interaction-${interactionName}`,
        'user-interaction-start',
        'user-interaction-end',
        interactionName
      );
      
      if (process.env.NODE_ENV === 'development' && duration) {
        console.log(`👆 User Interaction: ${interactionName} - ${duration.toFixed(2)}ms`);
      }
    }
  };
};

// 메모리 로그 시간 추적을 위한 전역 변수
let lastMemoryLogTime: number | null = null;

/**
 * 메모리 사용량 측정
 */
export const measureMemoryUsage = (): void => {
  if (typeof window !== 'undefined' && 'memory' in window.performance) {
    const memory = (window.performance as any).memory;
    
    if (memory) {
      const metrics = {
        'Used JS Heap Size': `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        'Total JS Heap Size': `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        'JS Heap Size Limit': `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      };
      
      // 메모리 사용량 로그를 제한적으로 출력 (60초마다 또는 메모리 사용량이 높을 때만)
      if (process.env.NODE_ENV === 'development') {
        const now = Date.now();
        const memoryUsageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        const shouldLog = !lastMemoryLogTime || 
                         (now - lastMemoryLogTime) > 60000 || // 60초마다
                         memoryUsageRatio > 0.9; // 90% 이상 사용시만
        
        if (shouldLog) {
          console.group('💾 Memory Usage');
          Object.entries(metrics).forEach(([key, value]) => {
            console.log(`${key}: ${value}`);
          });
          if (memoryUsageRatio > 0.8) {
            console.warn(`⚠️ High memory usage: ${(memoryUsageRatio * 100).toFixed(1)}%`);
          }
          console.groupEnd();
          lastMemoryLogTime = now;
        }
      }
    }
  }
};

/**
 * Core Web Vitals 추적 초기화
 */
export const initCoreWebVitals = (): void => {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  // Largest Contentful Paint (LCP)
  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      if (lastEntry) {
        performanceData.coreWebVitals.lcp = lastEntry.startTime;
        reportCoreWebVital('LCP', lastEntry.startTime);
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (error) {
    console.warn('LCP observer failed:', error);
  }

  // First Input Delay (FID)
  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        performanceData.coreWebVitals.fid = entry.processingStart - entry.startTime;
        reportCoreWebVital('FID', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });
  } catch (error) {
    console.warn('FID observer failed:', error);
  }

  // Cumulative Layout Shift (CLS)
  try {
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      performanceData.coreWebVitals.cls = clsValue;
      reportCoreWebVital('CLS', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  } catch (error) {
    console.warn('CLS observer failed:', error);
  }

  // First Contentful Paint (FCP)
  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.name === 'first-contentful-paint') {
          performanceData.coreWebVitals.fcp = entry.startTime;
          reportCoreWebVital('FCP', entry.startTime);
        }
      });
    }).observe({ entryTypes: ['paint'] });
  } catch (error) {
    console.warn('FCP observer failed:', error);
  }

  // Time to First Byte (TTFB)
  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.entryType === 'navigation') {
          performanceData.coreWebVitals.ttfb = entry.responseStart - entry.requestStart;
          reportCoreWebVital('TTFB', entry.responseStart - entry.requestStart);
        }
      });
    }).observe({ entryTypes: ['navigation'] });
  } catch (error) {
    console.warn('TTFB observer failed:', error);
  }
};

/**
 * Core Web Vital 보고
 */
const reportCoreWebVital = (metric: string, value: number): void => {
  const grade = getPerformanceGrade(metric as keyof typeof PERFORMANCE_THRESHOLDS, value);
  
  if (process.env.NODE_ENV === 'development' && isPerformanceMonitoringEnabled()) {
    console.log(`📊 ${metric}: ${value.toFixed(2)} (${grade})`);
  }

  // 성능 알림 시스템에 전송
  if (grade === 'poor') {
    reportPerformanceIssue(metric, value, grade);
  }
};

/**
 * 성능 등급 계산
 */
export const getPerformanceGrade = (
  metric: keyof typeof PERFORMANCE_THRESHOLDS, 
  value: number
): PerformanceGrade => {
  const threshold = PERFORMANCE_THRESHOLDS[metric];
  
  if (value <= threshold.good) {
    return 'good';
  } else if (value <= threshold.poor) {
    return 'needs-improvement';
  } else {
    return 'poor';
  }
};

/**
 * 성능 이슈 보고
 */
const reportPerformanceIssue = (metric: string, value: number, grade: PerformanceGrade): void => {
  const issue = {
    metric,
    value,
    grade,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };

  // 로컬 스토리지에 저장
  try {
    const existingIssues = JSON.parse(localStorage.getItem('performance-issues') || '[]');
    existingIssues.push(issue);
    localStorage.setItem('performance-issues', JSON.stringify(existingIssues.slice(-50))); // 최근 50개만 유지
  } catch (error) {
    console.warn('Failed to store performance issue:', error);
  }

  // 개발 환경에서 알림
  if (process.env.NODE_ENV === 'development') {
    console.warn(`⚠️ Performance Issue: ${metric} is ${grade} (${value.toFixed(2)})`);
  }
};

/**
 * 성능 메트릭 가져오기
 */
export const getPerformanceMetrics = (): PerformanceMetrics => {
  return { ...performanceData };
};

/**
 * 커스텀 메트릭 추가
 */
export const addCustomMetric = (name: string, value: number): void => {
  performanceData.customMetrics[name] = value;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`📈 Custom Metric: ${name} = ${value.toFixed(2)}`);
  }
};

/**
 * 컴포넌트 렌더링 시간 추적
 */
export const trackComponentRender = (componentName: string, renderTime: number): void => {
  performanceData.renderMetrics.componentRenderTimes[componentName] = renderTime;
  
  // 평균 렌더링 시간 계산
  const times = Object.values(performanceData.renderMetrics.componentRenderTimes);
  performanceData.renderMetrics.averageRenderTime = times.reduce((sum, time) => sum + time, 0) / times.length;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎨 ${componentName} render: ${renderTime.toFixed(2)}ms`);
  }
};

/**
 * 네트워크 메트릭 업데이트
 */
export const updateNetworkMetrics = (responseTime: number, responseSize: number): void => {
  performanceData.networkMetrics.requests += 1;
  performanceData.networkMetrics.totalSize += responseSize;
  
  // 평균 응답 시간 계산
  const totalTime = performanceData.networkMetrics.averageResponseTime * (performanceData.networkMetrics.requests - 1) + responseTime;
  performanceData.networkMetrics.averageResponseTime = totalTime / performanceData.networkMetrics.requests;
};

/**
 * 성능 리포트 생성
 */
export const generatePerformanceReport = (): string => {
  const metrics = getPerformanceMetrics();
  const report = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    coreWebVitals: metrics.coreWebVitals,
    customMetrics: metrics.customMetrics,
    memoryUsage: metrics.memoryUsage,
    networkMetrics: metrics.networkMetrics,
    renderMetrics: metrics.renderMetrics,
    performanceIssues: JSON.parse(localStorage.getItem('performance-issues') || '[]'),
  };

  return JSON.stringify(report, null, 2);
};

/**
 * 성능 모니터링 초기화
 */
export const initPerformanceMonitoring = (): void => {
  if (typeof window !== 'undefined') {
    // Core Web Vitals 추적 초기화
    initCoreWebVitals();
    
    // 페이지 로드 시간 측정
    measurePageLoad();
    
    // 메모리 사용량 측정 (30초마다)
    setInterval(measureMemoryUsage, 30000);
    
    // 성능 데이터 정리 (1시간마다)
    setInterval(() => {
      performanceData.customMetrics = {};
      performanceData.renderMetrics.componentRenderTimes = {};
    }, 60 * 60 * 1000);
    
    // 개발 환경에서 성능 정보 출력 (성능 모니터링이 활성화된 경우에만)
    if (process.env.NODE_ENV === 'development' && isPerformanceMonitoringEnabled()) {
      console.log('🔍 Advanced performance monitoring initialized');
    }
  }
};
