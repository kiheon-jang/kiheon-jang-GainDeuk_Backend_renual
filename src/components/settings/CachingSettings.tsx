// src/components/settings/CachingSettings.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Trash2, 
  RefreshCw, 
  Download, 
  Wifi, 
  WifiOff, 
  BarChart3, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useCaching, useOfflineStatus, useCachePerformance, useCacheOptimization } from '@/hooks/useCaching';
import { CACHE_STRATEGIES } from '@/services/queryClient';
import { media, responsiveTypography } from '@/utils/responsive';

const SettingsContainer = styled.div`
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  box-shadow: ${({ theme }) => theme.shadows.MD};
  max-width: 800px;
  margin: 0 auto;

  ${media.max.md`
    padding: 1rem;
  `}
`;

const Section = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  ${responsiveTypography('lg', 'semibold')}
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusCard = styled.div<{ status: 'online' | 'offline' | 'warning' }>`
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  background: ${({ theme, status }) => {
    switch (status) {
      case 'online': return theme.colors.success;
      case 'offline': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      default: return theme.colors.gray[100];
    }
  }};
  border: 1px solid ${({ theme, status }) => {
    switch (status) {
      case 'online': return theme.colors.success;
      case 'offline': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      default: return theme.colors.gray[300];
    }
  }};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const StatusText = styled.div`
  flex: 1;
`;

const StatusTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const StatusDescription = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  ${media.max.sm`
    grid-template-columns: 1fr;
  `}
`;

const MetricCard = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const MetricTitle = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;

  ${media.max.sm`
    flex-direction: column;
  `}
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: none;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  min-width: 120px;
  justify-content: center;

  ${({ variant = 'secondary', theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: white;
          &:hover {
            background: ${theme.colors.primary};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.danger};
          color: white;
          &:hover {
            background: ${theme.colors.danger};
          }
        `;
      default:
        return `
          background: ${theme.colors.background.secondary};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border};
          &:hover {
            background: ${theme.colors.gray[100]};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TipsList = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const TipItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const TipIcon = styled.div`
  color: ${({ theme }) => theme.colors.warning};
  margin-top: 0.125rem;
`;

const TipText = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  line-height: 1.4;
`;

const StrategyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  ${media.max.sm`
    grid-template-columns: 1fr;
  `}
`;

const StrategyCard = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StrategyTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const StrategyDescription = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.75rem;
`;

const StrategyDetails = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  line-height: 1.3;
`;

const CachingSettings: React.FC = () => {
  const { 
    cacheStatus, 
    isLoading, 
    error, 
    updateCacheStatus, 
    clearCache, 
    preloadData,
    metrics,
    optimizationTips 
  } = useCaching();
  
  const { isOnline, offlineDuration, onlineDuration } = useOfflineStatus();
  const { metrics: performanceMetrics, isMonitoring, startMonitoring, stopMonitoring } = useCachePerformance();
  const { tips, isAnalyzing, analyzeCache } = useCacheOptimization();
  
  const [isClearing, setIsClearing] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);

  const handleClearCache = async (strategy?: string) => {
    setIsClearing(true);
    try {
      await clearCache(strategy as any);
    } finally {
      setIsClearing(false);
    }
  };

  const handlePreloadData = async () => {
    setIsPreloading(true);
    try {
      await preloadData();
    } finally {
      setIsPreloading(false);
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}시간 ${minutes % 60}분`;
    if (minutes > 0) return `${minutes}분 ${seconds % 60}초`;
    return `${seconds}초`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <SettingsContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <RefreshCw className="animate-spin" size={24} />
          <div style={{ marginTop: '1rem' }}>캐시 상태를 불러오는 중...</div>
        </div>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <Section>
        <SectionTitle>
          <Settings size={20} />
          캐싱 설정
        </SectionTitle>
        
        {/* 네트워크 상태 */}
        <StatusCard status={isOnline ? 'online' : 'offline'}>
          {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
          <StatusText>
            <StatusTitle>
              {isOnline ? '온라인' : '오프라인'}
            </StatusTitle>
            <StatusDescription>
              {isOnline 
                ? `연결됨 (${formatDuration(onlineDuration)})`
                : `연결 끊김 (${formatDuration(offlineDuration)})`
              }
            </StatusDescription>
          </StatusText>
        </StatusCard>

        {/* 캐시 메트릭 */}
        <MetricsGrid>
          <MetricCard>
            <MetricTitle>캐시된 쿼리</MetricTitle>
            <MetricValue>{metrics.totalQueries}</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricTitle>활성 쿼리</MetricTitle>
            <MetricValue>{metrics.activeQueries}</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricTitle>히트율</MetricTitle>
            <MetricValue>{metrics.hitRate.toFixed(1)}%</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricTitle>메모리 사용량</MetricTitle>
            <MetricValue>{formatBytes(metrics.memoryUsage)}</MetricValue>
          </MetricCard>
        </MetricsGrid>

        {/* 액션 버튼들 */}
        <ButtonGroup>
          <ActionButton 
            variant="primary" 
            onClick={handlePreloadData}
            disabled={isPreloading || !isOnline}
          >
            <Download size={16} />
            {isPreloading ? '프리로딩 중...' : '데이터 프리로딩'}
          </ActionButton>
          
          <ActionButton 
            variant="secondary" 
            onClick={updateCacheStatus}
          >
            <RefreshCw size={16} />
            상태 새로고침
          </ActionButton>
          
          <ActionButton 
            variant="secondary" 
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
          >
            <BarChart3 size={16} />
            {isMonitoring ? '모니터링 중지' : '성능 모니터링'}
          </ActionButton>
          
          <ActionButton 
            variant="danger" 
            onClick={() => handleClearCache()}
            disabled={isClearing}
          >
            <Trash2 size={16} />
            {isClearing ? '정리 중...' : '모든 캐시 정리'}
          </ActionButton>
        </ButtonGroup>
      </Section>

      {/* 캐시 전략 */}
      <Section>
        <SectionTitle>
          <BarChart3 size={20} />
          캐시 전략
        </SectionTitle>
        
        <StrategyGrid>
          {Object.entries(CACHE_STRATEGIES).map(([key, strategy]) => (
            <StrategyCard key={key}>
              <StrategyTitle>{key}</StrategyTitle>
              <StrategyDescription>
                {key === 'REALTIME' && '실시간 데이터 (매매 신호, 가격 정보)'}
                {key === 'FREQUENT' && '자주 변경되는 데이터 (추천, 대시보드)'}
                {key === 'MODERATE' && '중간 빈도 데이터 (코인 목록, 사용자 프로필)'}
                {key === 'STATIC' && '거의 변경되지 않는 데이터 (설정, 정적 정보)'}
                {key === 'OFFLINE_FIRST' && '오프라인 우선 데이터 (캐시된 데이터 우선 사용)'}
              </StrategyDescription>
              <StrategyDetails>
                <div>Stale Time: {strategy.staleTime / 1000}초</div>
                <div>GC Time: {strategy.gcTime / 1000}초</div>
                {strategy.refetchInterval && (
                  <div>Refetch: {strategy.refetchInterval / 1000}초</div>
                )}
              </StrategyDetails>
            </StrategyCard>
          ))}
        </StrategyGrid>
      </Section>

      {/* 최적화 권장사항 */}
      {(tips.length > 0 || optimizationTips.length > 0) && (
        <Section>
          <SectionTitle>
            <AlertTriangle size={20} />
            최적화 권장사항
          </SectionTitle>
          
          <TipsList>
            {[...tips, ...optimizationTips].map((tip, index) => (
              <TipItem key={`tip-${index}-${tip.slice(0, 10)}`}>
                <TipIcon>
                  <AlertTriangle size={16} />
                </TipIcon>
                <TipText>{tip}</TipText>
              </TipItem>
            ))}
          </TipsList>
        </Section>
      )}

      {/* 에러 표시 */}
      {error && (
        <Section>
          <StatusCard status="warning">
            <AlertTriangle size={20} />
            <StatusText>
              <StatusTitle>오류 발생</StatusTitle>
              <StatusDescription>{error}</StatusDescription>
            </StatusText>
          </StatusCard>
        </Section>
      )}
    </SettingsContainer>
  );
};

export default CachingSettings;
