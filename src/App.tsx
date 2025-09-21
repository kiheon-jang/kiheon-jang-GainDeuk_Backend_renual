import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { queryClient } from '@/services/queryClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PerformanceMonitor from '@/components/common/PerformanceMonitor';
import PerformanceDashboard from '@/components/common/PerformanceDashboard';
import { initPerformanceMonitoring } from '@/utils/performance';
import { registerServiceWorker } from '@/utils/serviceWorker';
import { preloadCriticalResources } from '@/utils/preloading';
import { handleOfflineMode, scheduleCacheInvalidation } from '@/utils/caching';
import { updateExchangeRate } from '@/utils';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const TradingGuide = lazy(() => import('@/pages/TradingGuide'));
const ProfileAnalysis = lazy(() => import('@/pages/ProfileAnalysis'));
const CoinList = lazy(() => import('@/pages/CoinList'));
const Settings = lazy(() => import('@/pages/Settings'));

// Global styles
import './index.css';

// Loading fallback component for Suspense
const PageLoadingFallback: React.FC = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh',
    background: 'var(--color-bg-secondary, #f9fafb)'
  }}>
    <LoadingSpinner size="lg" text="페이지를 불러오는 중..." />
  </div>
);

const App: React.FC = () => {
  // 성능 모니터링, 서비스 워커, 프리로딩, 캐싱 전략, 환율 초기화
  useEffect(() => {
    initPerformanceMonitoring();
    registerServiceWorker();
    preloadCriticalResources();
    handleOfflineMode();
    scheduleCacheInvalidation();
    updateExchangeRate(); // 환율 업데이트
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              {/* 메인 대시보드 */}
              <Route path="/" element={<Dashboard />} />
              
              {/* 실시간 매매 가이드 */}
              <Route path="/trading" element={<TradingGuide />} />
              
              {/* 내 성향 분석 */}
              <Route path="/profile" element={<ProfileAnalysis />} />
              
              {/* 코인 목록 */}
              <Route path="/coins" element={<CoinList />} />
              
              {/* 설정 */}
              <Route path="/settings" element={<Settings />} />
              
              {/* 기본 리다이렉트 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          
          {/* 성능 모니터링 컴포넌트 */}
          <PerformanceMonitor />
          
          {/* 성능 대시보드 (개발 환경에서만 표시) */}
          {process.env.NODE_ENV === 'development' && <PerformanceDashboard />}
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;