import React, { useState } from 'react';
import styled from 'styled-components';
import MainLayout from '@/components/common/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import TradingSignalCard from '@/components/cards/TradingSignalCard';
import TradeExecutionModal from '@/components/modals/TradeExecutionModal';
import StrategyFilter from '@/components/common/StrategyFilter';
import RealTimeIndicator from '@/components/common/RealTimeIndicator';
import { useTradingSignals, useExecuteTrade } from '@/hooks/useApi';
import type { TradingSignal } from '@/types';

const TradingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.danger}, ${({ theme }) => theme.colors.warning});
  color: white;
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  text-align: center;
`;

const HeroTitle = styled.h2`
  font-size: ${({ theme }) => theme.fonts.size['2XL']};
  font-weight: 700;
  margin: 0 0 1rem 0;
`;

const HeroDescription = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  margin: 0;
  opacity: 0.9;
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SignalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  box-shadow: ${({ theme }) => theme.shadows.MD};
  border: 2px dashed ${({ theme }) => theme.colors.gray[200]};
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyStateTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.XL};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[500]};
  margin: 0 0 0.5rem 0;
`;

const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.gray[400]};
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
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  box-shadow: ${({ theme }) => theme.shadows.SM};
  border: 1px solid ${({ theme }) => theme.colors.gray[100]};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fonts.size['2XL']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-weight: 500;
`;

const TradingGuide: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState('all');
  const [selectedSignal, setSelectedSignal] = useState<TradingSignal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: signals, isLoading, error, isFetching } = useTradingSignals();
  const executeTradeMutation = useExecuteTrade();

  // 필터링된 신호들
  const filteredSignals = signals?.filter(signal => 
    selectedStrategy === 'all' || signal.timeframe.strategy === selectedStrategy
  ) || [];

  // 통계 계산
  const totalSignals = signals?.length || 0;
  const buySignals = signals?.filter(s => s.signal.action === 'BUY').length || 0;
  const sellSignals = signals?.filter(s => s.signal.action === 'SELL').length || 0;
  const holdSignals = signals?.filter(s => s.signal.action === 'HOLD').length || 0;

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
            isConnected={!isFetching}
            lastUpdate={new Date().toLocaleTimeString('ko-KR')}
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
