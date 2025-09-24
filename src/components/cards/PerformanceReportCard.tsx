import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '@/services/api';
import type { PerformanceReport } from '@/types';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

const PerformanceContainer = styled(Card)`
  padding: 24px;
  margin-bottom: 24px;
`;

const PerformanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PerformanceTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const RefreshButton = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary}90;
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.text.secondary};
    cursor: not-allowed;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const MetricCard = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const MetricName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  text-transform: capitalize;
`;

const StatusBadge = styled.span<{ status: 'GOOD' | 'NEEDS_IMPROVEMENT' }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${({ theme, status }) => 
    status === 'GOOD' ? theme.colors.success + '20' : theme.colors.warning + '20'};
  color: ${({ theme, status }) => 
    status === 'GOOD' ? theme.colors.success : theme.colors.warning};
`;

const MetricStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const StatValue = styled.div<{ positive?: boolean; negative?: boolean }>`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme, positive, negative }) => {
    if (positive) return theme.colors.success;
    if (negative) return theme.colors.danger;
    return theme.colors.text.primary;
  }};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
`;

const ProgressFill = styled.div<{ percentage: number; positive?: boolean }>`
  height: 100%;
  width: ${({ percentage }) => Math.min(percentage, 100)}%;
  background: ${({ theme, positive }) => 
    positive ? theme.colors.success : theme.colors.primary};
  transition: width 0.3s ease;
`;

const RecommendationsSection = styled.div`
  margin-top: 24px;
`;

const RecommendationsTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 16px 0;
`;

const RecommendationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RecommendationItem = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.warning + '10'};
  border: 1px solid ${({ theme }) => theme.colors.warning + '30'};
  border-radius: 8px;
`;

const RecommendationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const RecommendationTimeframe = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  text-transform: capitalize;
`;

const RecommendationIssue = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 4px;
`;

const RecommendationSuggestion = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

interface PerformanceReportCardProps {
  className?: string;
  onGetReport?: () => void;
  report?: any;
}

const PerformanceReportCard: React.FC<PerformanceReportCardProps> = ({ 
  className, 
  onGetReport, 
  report: externalReport 
}) => {
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPerformanceReport = async () => {
    setIsLoading(true);
    try {
      const data = await api.getPerformanceReport();
      setReport(data);
    } catch (error) {
      console.error('Failed to fetch performance report:', error);
      toast.error('성과 리포트 조회에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!externalReport) {
      fetchPerformanceReport();
    }
  }, [externalReport]);

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getPerformanceColor = (current: number, target: number) => {
    const ratio = current / target;
    if (ratio >= 1) return 'positive';
    if (ratio >= 0.8) return undefined;
    return 'negative';
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const currentReport = externalReport || report;

  if (isLoading && !currentReport) {
    return (
      <PerformanceContainer className={className}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <LoadingSpinner />
          <p style={{ marginTop: '16px', color: '#666' }}>성과 리포트를 불러오는 중...</p>
        </div>
      </PerformanceContainer>
    );
  }

  if (!currentReport) {
    return (
      <PerformanceContainer className={className}>
        <EmptyState>
          <p>성과 리포트를 불러올 수 없습니다.</p>
          <RefreshButton onClick={onGetReport || fetchPerformanceReport}>
            다시 시도
          </RefreshButton>
        </EmptyState>
      </PerformanceContainer>
    );
  }

  return (
    <PerformanceContainer className={className}>
      <PerformanceHeader>
        <PerformanceTitle>성과 리포트</PerformanceTitle>
        <RefreshButton onClick={onGetReport || fetchPerformanceReport} disabled={isLoading}>
          {isLoading ? <LoadingSpinner size="sm" /> : '새로고침'}
        </RefreshButton>
      </PerformanceHeader>

      <MetricsGrid>
        {Object.entries(currentReport.metrics).map(([timeframe, metrics]: [string, any]) => {
          const isPositive = getPerformanceColor(metrics.current, metrics.target) === 'positive';
          const isNegative = getPerformanceColor(metrics.current, metrics.target) === 'negative';
          const progressPercentage = getProgressPercentage(metrics.current, metrics.target);

          return (
            <MetricCard key={timeframe}>
              <MetricHeader>
                <MetricName>{timeframe.replace(/([A-Z])/g, ' $1').trim()}</MetricName>
                <StatusBadge status={metrics.status}>
                  {metrics.status === 'GOOD' ? '양호' : '개선 필요'}
                </StatusBadge>
              </MetricHeader>

              <MetricStats>
                <StatItem>
                  <StatLabel>현재 성과</StatLabel>
                  <StatValue positive={isPositive} negative={isNegative}>
                    {formatPercentage(metrics.current)}
                  </StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>목표 성과</StatLabel>
                  <StatValue>{formatPercentage(metrics.target)}</StatValue>
                </StatItem>
              </MetricStats>

              <ProgressBar>
                <ProgressFill 
                  percentage={progressPercentage} 
                  positive={isPositive}
                />
              </ProgressBar>

              <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#666' }}>
                샘플 수: {metrics.samples}
              </div>
            </MetricCard>
          );
        })}
      </MetricsGrid>

      {currentReport.recommendations?.length > 0 && (
        <RecommendationsSection>
          <RecommendationsTitle>개선 권장사항</RecommendationsTitle>
          <RecommendationList>
            {currentReport.recommendations?.map((rec: any, index: number) => (
              <RecommendationItem key={index}>
                <RecommendationHeader>
                  <RecommendationTimeframe>
                    {rec.timeframe.replace(/([A-Z])/g, ' $1').trim()}
                  </RecommendationTimeframe>
                </RecommendationHeader>
                <RecommendationIssue>{rec.issue}</RecommendationIssue>
                <RecommendationSuggestion>{rec.suggestion}</RecommendationSuggestion>
              </RecommendationItem>
            ))}
          </RecommendationList>
        </RecommendationsSection>
      )}

      <div style={{ marginTop: '16px', fontSize: '0.75rem', color: '#666', textAlign: 'center' }}>
        마지막 업데이트: {new Date(currentReport.timestamp).toLocaleString('ko-KR')}
      </div>
    </PerformanceContainer>
  );
};

export default PerformanceReportCard;
