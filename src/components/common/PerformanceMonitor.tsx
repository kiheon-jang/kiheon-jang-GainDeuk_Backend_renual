/**
 * 성능 모니터링 컴포넌트
 * 개발 환경에서만 표시되며, 실시간 성능 메트릭을 보여줍니다.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Activity, Clock, HardDrive, Zap, AlertTriangle } from 'lucide-react';
// import { usePerformanceMonitoring, useMemoryMonitoring } from '@/hooks/usePerformance';
import { useSettings } from '@/hooks/useSettings';

interface PerformanceMonitorProps {
  show?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const MonitorContainer = styled.div<{ $position: string }>`
  position: fixed;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.4;
  min-width: 200px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  ${({ $position }) => {
    switch ($position) {
      case 'top-left':
        return 'top: 1rem; left: 1rem;';
      case 'top-right':
        return 'top: 1rem; right: 1rem;';
      case 'bottom-left':
        return 'bottom: 1rem; left: 1rem;';
      case 'bottom-right':
        return 'bottom: 1rem; right: 1rem;';
      default:
        return 'top: 1rem; right: 1rem;';
    }
  }}

  /* 개발 환경에서만 표시 */
  display: ${process.env.NODE_ENV === 'development' ? 'block' : 'none'};
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MetricLabel = styled.span`
  color: #a0a0a0;
  margin-right: 0.5rem;
`;

const MetricValue = styled.span<{ $warning?: boolean; $good?: boolean }>`
  color: ${({ $warning, $good }) => 
    $warning ? '#ff6b6b' : 
    $good ? '#51cf66' : 
    '#ffffff'
  };
  font-weight: 500;
`;

const MetricIcon = styled.span`
  margin-right: 0.25rem;
  display: inline-flex;
  align-items: center;
`;

const Separator = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0;
`;

// 성능 메트릭 컴포넌트 (조건부 실행을 위해 분리)
const PerformanceMetricsComponent: React.FC<{ onMetricsUpdate: (metrics: any) => void }> = ({ onMetricsUpdate }) => {
  // 성능 훅 대신 간단한 메트릭 수집
  const [updateCount, setUpdateCount] = React.useState(0);
  
  React.useEffect(() => {
    const startTime = performance.now();
    
    const updateMetrics = () => {
      const endTime = performance.now();
      const currentRenderTime = endTime - startTime;
      
      setUpdateCount(prev => {
        const newCount = prev + 1;
        onMetricsUpdate({
          renderTime: currentRenderTime,
          updateCount: newCount,
          mountTime: 0,
          lastUpdateTime: endTime
        });
        return newCount;
      });
    };
    
    // 5초마다 메트릭 업데이트
    const interval = setInterval(updateMetrics, 5000);
    
    return () => clearInterval(interval);
  }, [onMetricsUpdate, updateCount]);
  
  return null; // 이 컴포넌트는 메트릭 수집만 담당
};

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  show = true,
  position = 'top-right'
}) => {
  const { settings } = useSettings();
  const [fps, setFps] = useState<number>(0);
  const [memoryUsage, setMemoryUsage] = useState<{
    used: number;
    total: number;
    limit: number;
  }>({ used: 0, total: 0, limit: 0 });
  const [metrics, setMetrics] = useState<{
    renderTime: number;
    mountTime: number;
    updateCount: number;
    lastUpdateTime: number;
  }>({ renderTime: 0, mountTime: 0, updateCount: 0, lastUpdateTime: 0 });

  // 설정에서 성능 모니터링이 활성화되어 있고 show가 true일 때만 모니터링
  const isMonitoringEnabled = settings.app.performanceMonitoring && show;
  
  // 메트릭 업데이트 핸들러
  const handleMetricsUpdate = React.useCallback((newMetrics: any) => {
    setMetrics(newMetrics);
  }, []);
  
  // 성능 모니터링 자체가 성능 문제를 일으키지 않도록 제한적으로 사용
  // 조건부로 훅 실행을 위해 별도 컴포넌트로 분리
  const PerformanceMetrics = isMonitoringEnabled ? (
    <PerformanceMetricsComponent onMetricsUpdate={handleMetricsUpdate} />
  ) : null;

  // FPS 측정
  useEffect(() => {
    if (!isMonitoringEnabled) return;

    let animationId: number;
    let lastTimestamp = performance.now();
    let frameCount = 0;

    const measureFPS = (timestamp: number) => {
      frameCount++;
      
      if (timestamp - lastTimestamp >= 1000) {
        const currentFPS = Math.round((frameCount * 1000) / (timestamp - lastTimestamp));
        setFps(currentFPS);
        lastTimestamp = timestamp;
        frameCount = 0;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isMonitoringEnabled]);

  // 메모리 사용량 측정 (5초마다 업데이트)
  useEffect(() => {
    if (!isMonitoringEnabled) return;

    const updateMemoryUsage = () => {
      if (typeof window !== 'undefined' && 'memory' in window.performance) {
        const memory = (window.performance as any).memory;
        if (memory) {
          setMemoryUsage({
            used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
            limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
          });
        }
      }
    };

    updateMemoryUsage();
    const interval = setInterval(updateMemoryUsage, 5000); // 5초마다 업데이트
    return () => clearInterval(interval);
  }, [isMonitoringEnabled]);

  if (!isMonitoringEnabled || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'good';
    if (fps >= 30) return undefined;
    return 'warning';
  };

  const getMemoryColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return 'warning';
    if (percentage >= 70) return undefined;
    return 'good';
  };

  return (
    <>
      {PerformanceMetrics}
      <MonitorContainer $position={position}>
        <MetricRow>
          <MetricLabel>
            <MetricIcon><Activity size={12} /></MetricIcon>
            FPS
          </MetricLabel>
          <MetricValue $warning={getFPSColor(fps) === 'warning'} $good={getFPSColor(fps) === 'good'}>
            {fps}
          </MetricValue>
        </MetricRow>

        <MetricRow>
          <MetricLabel>
            <MetricIcon><Clock size={12} /></MetricIcon>
            Render
          </MetricLabel>
          <MetricValue $warning={metrics.renderTime > 16} $good={metrics.renderTime < 8}>
            {metrics.renderTime.toFixed(1)}ms
          </MetricValue>
        </MetricRow>

        <MetricRow>
          <MetricLabel>
            <MetricIcon><HardDrive size={12} /></MetricIcon>
            Memory
          </MetricLabel>
          <MetricValue 
            $warning={getMemoryColor(memoryUsage.used, memoryUsage.limit) === 'warning'}
            $good={getMemoryColor(memoryUsage.used, memoryUsage.limit) === 'good'}
          >
            {memoryUsage.used}MB
          </MetricValue>
        </MetricRow>

        <Separator />

        <MetricRow>
          <MetricLabel>
            <MetricIcon><Zap size={12} /></MetricIcon>
            Updates
          </MetricLabel>
          <MetricValue $warning={metrics.updateCount > 10}>
            {metrics.updateCount}
          </MetricValue>
        </MetricRow>

        {metrics.updateCount > 10 && (
          <MetricRow>
            <MetricLabel>
              <MetricIcon><AlertTriangle size={12} /></MetricIcon>
              Warning
            </MetricLabel>
            <MetricValue $warning>
              Too many updates
            </MetricValue>
          </MetricRow>
        )}
      </MonitorContainer>
    </>
  );
};

export default PerformanceMonitor;
