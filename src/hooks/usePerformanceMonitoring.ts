// src/hooks/usePerformanceMonitoring.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getPerformanceMetrics, 
  addCustomMetric, 
  trackComponentRender,
  getPerformanceGrade,
  generatePerformanceReport,
  type PerformanceMetrics,
  type PerformanceGrade
} from '@/utils/performance';

/**
 * 성능 모니터링 훅
 */
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    metric: string;
    value: number;
    grade: PerformanceGrade;
    timestamp: number;
  }>>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 성능 메트릭 업데이트
  const updateMetrics = useCallback(() => {
    const currentMetrics = getPerformanceMetrics();
    setMetrics(currentMetrics);
    
    // 성능 이슈 확인
    const issues = JSON.parse(localStorage.getItem('performance-issues') || '[]');
    setAlerts(issues.slice(-10)); // 최근 10개만 표시
  }, []);

  // 모니터링 시작
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    updateMetrics();
    
    intervalRef.current = setInterval(updateMetrics, 5000); // 5초마다 업데이트
  }, [updateMetrics]);

  // 모니터링 중지
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 커스텀 메트릭 추가
  const addMetric = useCallback((name: string, value: number) => {
    addCustomMetric(name, value);
    updateMetrics();
  }, [updateMetrics]);

  // 성능 리포트 생성
  const generateReport = useCallback(() => {
    return generatePerformanceReport();
  }, []);

  // 성능 이슈 정리
  const clearAlerts = useCallback(() => {
    localStorage.removeItem('performance-issues');
    setAlerts([]);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    metrics,
    isMonitoring,
    alerts,
    startMonitoring,
    stopMonitoring,
    addMetric,
    generateReport,
    clearAlerts,
    updateMetrics,
  };
};

/**
 * 컴포넌트 성능 추적 훅
 */
export const useComponentPerformance = (componentName: string) => {
  const renderStartRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);

  // 렌더링 시작 마크
  const markRenderStart = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  // 렌더링 완료 마크
  const markRenderEnd = useCallback(() => {
    if (renderStartRef.current > 0) {
      const renderTime = performance.now() - renderStartRef.current;
      renderCountRef.current += 1;
      
      trackComponentRender(componentName, renderTime);
      
      // 개발 환경에서 로그
      if (process.env.NODE_ENV === 'development') {
        console.log(`🎨 ${componentName} render #${renderCountRef.current}: ${renderTime.toFixed(2)}ms`);
      }
    }
  }, [componentName]);

  return {
    markRenderStart,
    markRenderEnd,
    renderCount: renderCountRef.current,
  };
};

/**
 * 성능 등급 확인 훅
 */
export const usePerformanceGrade = () => {
  const [grades, setGrades] = useState<Record<string, PerformanceGrade>>({});

  const checkGrade = useCallback((metric: string, value: number) => {
    const grade = getPerformanceGrade(metric as any, value);
    setGrades(prev => ({ ...prev, [metric]: grade }));
    return grade;
  }, []);

  const getGradeColor = useCallback((grade: PerformanceGrade) => {
    switch (grade) {
      case 'good': return '#10B981'; // green
      case 'needs-improvement': return '#F59E0B'; // yellow
      case 'poor': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  }, []);

  const getGradeIcon = useCallback((grade: PerformanceGrade) => {
    switch (grade) {
      case 'good': return '✅';
      case 'needs-improvement': return '⚠️';
      case 'poor': return '❌';
      default: return '❓';
    }
  }, []);

  return {
    grades,
    checkGrade,
    getGradeColor,
    getGradeIcon,
  };
};

/**
 * 성능 알림 훅
 */
export const usePerformanceAlerts = () => {
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    metric: string;
    value: number;
    grade: PerformanceGrade;
    timestamp: number;
    dismissed: boolean;
  }>>([]);

  // 알림 로드
  const loadAlerts = useCallback(() => {
    try {
      const storedAlerts = JSON.parse(localStorage.getItem('performance-issues') || '[]');
      setAlerts(storedAlerts.map((alert: any, index: number) => ({
        ...alert,
        id: `alert-${index}`,
        dismissed: false,
      })));
    } catch (error) {
      console.warn('Failed to load performance alerts:', error);
    }
  }, []);

  // 알림 해제
  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  }, []);

  // 모든 알림 해제
  const dismissAllAlerts = useCallback(() => {
    setAlerts(prev => prev.map(alert => ({ ...alert, dismissed: true })));
  }, []);

  // 알림 정리
  const clearAlerts = useCallback(() => {
    localStorage.removeItem('performance-issues');
    setAlerts([]);
  }, []);

  useEffect(() => {
    loadAlerts();
    
    // 주기적으로 알림 업데이트
    const interval = setInterval(loadAlerts, 10000); // 10초마다
    
    return () => clearInterval(interval);
  }, [loadAlerts]);

  return {
    alerts: alerts.filter(alert => !alert.dismissed),
    dismissAlert,
    dismissAllAlerts,
    clearAlerts,
    loadAlerts,
  };
};

/**
 * 성능 벤치마크 훅
 */
export const usePerformanceBenchmark = () => {
  const [benchmarks, setBenchmarks] = useState<Record<string, number[]>>({});
  const [isRunning, setIsRunning] = useState(false);

  // 벤치마크 시작
  const startBenchmark = useCallback((name: string) => {
    if (!benchmarks[name]) {
      setBenchmarks(prev => ({ ...prev, [name]: [] }));
    }
    setIsRunning(true);
    return performance.now();
  }, [benchmarks]);

  // 벤치마크 종료
  const endBenchmark = useCallback((name: string, startTime: number) => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    setBenchmarks(prev => ({
      ...prev,
      [name]: [...(prev[name] || []), duration].slice(-100) // 최근 100개만 유지
    }));
    
    setIsRunning(false);
    return duration;
  }, []);

  // 벤치마크 통계 계산
  const getBenchmarkStats = useCallback((name: string) => {
    const times = benchmarks[name] || [];
    if (times.length === 0) return null;
    
    const sorted = [...times].sort((a, b) => a - b);
    const sum = times.reduce((acc, time) => acc + time, 0);
    
    return {
      count: times.length,
      average: sum / times.length,
      median: sorted[Math.floor(sorted.length / 2)],
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }, [benchmarks]);

  // 벤치마크 정리
  const clearBenchmark = useCallback((name: string) => {
    setBenchmarks(prev => {
      const newBenchmarks = { ...prev };
      delete newBenchmarks[name];
      return newBenchmarks;
    });
  }, []);

  return {
    benchmarks,
    isRunning,
    startBenchmark,
    endBenchmark,
    getBenchmarkStats,
    clearBenchmark,
  };
};
