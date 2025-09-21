import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MainLayout from '@/components/common/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import TradingSignalCard from '@/components/cards/TradingSignalCard';
import TradeExecutionModal from '@/components/modals/TradeExecutionModal';
import StrategyFilter from '@/components/common/StrategyFilter';
import RealTimeIndicator from '@/components/common/RealTimeIndicator';
import { useTradingSignals, useExecuteTrade } from '@/hooks/useApi';
import { useRealTimeData, useNetworkStatus } from '@/hooks/useRealTimeData';
import { media, responsiveTypography, responsiveSpacing } from '@/utils/responsive';
// import { useOptimisticUpdates } from '@/hooks/useOptimisticUpdates';
import type { ApiTradingSignal } from '@/types';

const TradingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  ${media.max.sm`
    gap: 1.5rem;
  `}
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.danger}, ${({ theme }) => theme.colors.warning});
  color: white;
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  text-align: center;
  
  ${media.max.sm`
    padding: 1.5rem 1rem;
  `}
`;

const HeroTitle = styled.h2`
  ${responsiveTypography.h2}
  font-weight: 700;
  margin: 0 0 1rem 0;
`;

const HeroDescription = styled.p`
  ${responsiveTypography.body}
  margin: 0;
  opacity: 0.9;
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  
  ${media.max.sm`
    flex-direction: column;
    align-items: stretch;
  `}
`;

const SignalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  
  ${media.max.sm`
    grid-template-columns: 1fr;
    gap: 1rem;
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  box-shadow: ${({ theme }) => theme.shadows.MD};
  border: 2px dashed ${({ theme }) => theme.colors.border.primary};
  
  ${media.max.sm`
    padding: 2rem 1rem;
  `}
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  
  ${media.max.sm`
    font-size: 3rem;
  `}
`;

const EmptyStateTitle = styled.h3`
  ${responsiveTypography.h3}
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 0.5rem 0;
`;

const EmptyStateText = styled.p`
  ${responsiveTypography.body}
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0;
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.danger}15;
  color: ${({ theme }) => theme.colors.danger};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  text-align: center;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors.danger}40;
  
  ${media.max.sm`
    padding: 0.75rem;
  `}
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  ${media.max.sm`
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1rem;
  `}
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  box-shadow: ${({ theme }) => theme.shadows.SM};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  text-align: center;
  
  ${media.max.sm`
    padding: 0.75rem;
  `}
`;

const StatValue = styled.div`
  ${responsiveTypography.h2}
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  ${responsiveTypography.small}
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;

const TradingGuide: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState('all');
  const [selectedSignal, setSelectedSignal] = useState<TradingSignal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  const { data: signals, isLoading, error, isFetching } = useTradingSignals();
  const executeTradeMutation = useExecuteTrade();
  
  // 실시간 데이터 및 네트워크 상태 훅
  const { startTradingSignalsUpdates, stopRealTimeUpdates } = useRealTimeData();
  const { isOnline, connectionType } = useNetworkStatus();
  // const { optimisticTradeExecution } = useOptimisticUpdates();

  // 실시간 업데이트 시작
  useEffect(() => {
    if (isOnline) {
      startTradingSignalsUpdates(
        'user123',
        selectedStrategy === 'all' ? undefined : selectedStrategy,
        (newSignal) => {
          console.log('New trading signal received:', newSignal);
          setLastUpdateTime(new Date());
        }
      );
    }

    return () => {
      stopRealTimeUpdates();
    };
  }, [selectedStrategy, isOnline, startTradingSignalsUpdates, stopRealTimeUpdates]);

  // 데이터 업데이트 시 시간 갱신
  useEffect(() => {
    if (signals && !isLoading) {
      setLastUpdateTime(new Date());
    }
  }, [signals, isLoading]);

  // 필터링된 신호들
  const filteredSignals = signals?.filter(signal => 
    selectedStrategy === 'all' || signal.timeframe === selectedStrategy
  ) || [];

  // 통계 계산
  const totalSignals = signals?.length || 0;
  const buySignals = signals?.filter(s => s.action === 'BUY').length || 0;
  const sellSignals = signals?.filter(s => s.action === 'SELL').length || 0;
  const holdSignals = signals?.filter(s => s.action === 'HOLD').length || 0;

  const handleExecuteTrade = (signalId: string, action: 'BUY' | 'SELL', amount: number, price: number) => {
    executeTradeMutation.mutate(
      { signalId, action, amount, price },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setSelectedSignal(null);
        }
      }
    );
  };

  const handleSignalClick = (signalId: string, _action: 'BUY' | 'SELL', _amount: number, _price: number) => {
    const signal = signals?.find(s => s.id === signalId);
    if (signal) {
      setSelectedSignal(signal);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSignal(null);
  };

  if (isLoading) {
    return (
      <MainLayout 
        title="🎯 실시간 매매 가이드" 
        description="AI가 분석한 실시간 매매 신호를 확인하고 바로 실행하세요"
      >
        <LoadingSpinner size="lg" text="매매 신호를 불러오는 중..." />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout 
        title="🎯 실시간 매매 가이드" 
        description="AI가 분석한 실시간 매매 신호를 확인하고 바로 실행하세요"
      >
        <ErrorMessage>
          매매 신호를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </ErrorMessage>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="🎯 실시간 매매 가이드" 
      description="AI가 분석한 실시간 매매 신호를 확인하고 바로 실행하세요"
    >
      <TradingContainer>
        <HeroSection>
          <HeroTitle>🚨 지금 바로 매매하세요!</HeroTitle>
          <HeroDescription>
            AI가 모든 것을 분석하고 계산했습니다. 당신은 신호만 따라하세요!
          </HeroDescription>
        </HeroSection>

        <HeaderSection>
          <StrategyFilter
            selectedStrategy={selectedStrategy}
            onStrategyChange={setSelectedStrategy}
          />
          <RealTimeIndicator
            isOnline={isOnline}
            isRefreshing={isFetching}
            lastUpdateTime={lastUpdateTime}
            connectionType={connectionType}
          />
        </HeaderSection>

        <StatsSection>
          <StatCard>
            <StatValue>{totalSignals}</StatValue>
            <StatLabel>전체 신호</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue style={{ color: '#10B981' }}>{buySignals}</StatValue>
            <StatLabel>매수 신호</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue style={{ color: '#EF4444' }}>{sellSignals}</StatValue>
            <StatLabel>매도 신호</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue style={{ color: '#F59E0B' }}>{holdSignals}</StatValue>
            <StatLabel>관망 신호</StatLabel>
          </StatCard>
        </StatsSection>

        {filteredSignals.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>📊</EmptyStateIcon>
            <EmptyStateTitle>매매 신호가 없습니다</EmptyStateTitle>
            <EmptyStateText>
              {selectedStrategy === 'all' 
                ? '현재 활성화된 매매 신호가 없습니다. 잠시 후 다시 확인해주세요.'
                : `${selectedStrategy} 전략에 해당하는 신호가 없습니다.`
              }
            </EmptyStateText>
          </EmptyState>
        ) : (
          <SignalsGrid>
            {filteredSignals.map((signal) => (
              <TradingSignalCard
                key={signal.id}
                signal={signal}
                onExecuteTrade={handleSignalClick}
                isExecuting={executeTradeMutation.isPending}
              />
            ))}
          </SignalsGrid>
        )}

        <TradeExecutionModal
          isOpen={isModalOpen}
          signal={selectedSignal}
          onClose={handleCloseModal}
          onConfirm={handleExecuteTrade}
          isExecuting={executeTradeMutation.isPending}
        />
      </TradingContainer>
    </MainLayout>
  );
};

export default TradingGuide;
