import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { queryClient } from '@/services/queryClient';

// Pages
import Dashboard from '@/pages/Dashboard';
import TradingGuide from '@/pages/TradingGuide';
import ProfileAnalysis from '@/pages/ProfileAnalysis';
import CoinList from '@/pages/CoinList';
import Settings from '@/pages/Settings';

// Global styles
import './index.css';

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
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
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;