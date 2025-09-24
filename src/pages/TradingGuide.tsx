import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MainLayout from '@/components/common/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CompactTradingSignalCard from '@/components/cards/CompactTradingSignalCard';
import TradeExecutionModal from '@/components/modals/TradeExecutionModal';
import StrategyFilter from '@/components/common/StrategyFilter';
import RealTimeIndicator from '@/components/common/RealTimeIndicator';
import { useTradingSignals, useExecuteTrade } from '@/hooks/useApi';
import { useRealTimeData, useNetworkStatus } from '@/hooks/useRealTimeData';
import { media } from '@/utils/responsive';
// import { useOptimisticUpdates } from '@/hooks/useOptimisticUpdates';
import type { ApiTradingSignal, TradingSignal } from '@/types';

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
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 700;
  margin: 0 0 1rem 0;

  @media (min-width: 640px) {
    font-size: 2.5rem;
  }

  @media (min-width: 1024px) {
    font-size: 3rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  opacity: 0.9;

  @media (min-width: 640px) {
    font-size: 1.125rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.25rem;
  }
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

const SignalsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  ${media.max.sm`
    gap: 0.5rem;
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
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 0.5rem 0;

  @media (min-width: 640px) {
    font-size: 1.875rem;
  }

  @media (min-width: 1024px) {
    font-size: 2.25rem;
  }
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0;

  @media (min-width: 640px) {
    font-size: 1.125rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.25rem;
  }
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

const StatCard = styled.div<{ $isClickable?: boolean; $isActive?: boolean }>`
  background: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary + '15' : theme.colors.background.primary};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  box-shadow: ${({ theme }) => theme.shadows.SM};
  border: 1px solid ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary + '40' : theme.colors.border.primary};
  text-align: center;
  cursor: ${({ $isClickable }) => $isClickable ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  
  ${({ $isClickable, theme }) => $isClickable && `
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.MD};
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  ${media.max.sm`
    padding: 0.75rem;
  `}
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  line-height: 1.2;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;

  @media (min-width: 640px) {
    font-size: 2rem;
  }

  @media (min-width: 1024px) {
    font-size: 2.5rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;

  @media (min-width: 640px) {
    font-size: 0.875rem;
  }

  @media (min-width: 1024px) {
    font-size: 1rem;
  }
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

  // 백엔드 데이터를 기반으로 전략 분류 (백엔드 수정 전 임시 해결책)
  // 중복 제거: 같은 symbol에 대해 최고 점수만 유지
  const uniqueSignals = signals?.reduce((acc, signal) => {
    const existing = acc.find(s => s.symbol === signal.symbol);
    if (!existing || signal.score > existing.score) {
      return acc.filter(s => s.symbol !== signal.symbol).concat(signal);
    }
    return acc;
  }, [] as typeof signals) || [];

  const classifiedSignals = uniqueSignals.map(signal => {
    const score = signal.score;
    const change24h = signal.metadata?.priceData?.change_24h || 0;
    const volatility = Math.abs(change24h);
    const volumeRatio = signal.metadata?.volumeRatio || 1;
    
    // 백엔드 로직과 동일한 전략 분류
    let timeframe = 'LONG_TERM';
    let action = signal.action;
    let priority = signal.priority;
    
    if (score >= 80 && volatility < 10) {
      timeframe = 'SCALPING';
      action = 'BUY';
      priority = 'high_priority';
    } else if (score >= 70 && volatility < 20) {
      timeframe = 'DAY_TRADING';
      action = score > 75 ? 'BUY' : 'HOLD';
      priority = 'medium_priority';
    } else if (score >= 60) {
      timeframe = 'SWING_TRADING';
      // 매도 신호 조건: 과도한 상승 후 조정 신호 또는 거래량 급증 + 고래 활동
      const isOverheated = change24h > 50 && volatility > 30; // 50% 이상 급등 + 30% 이상 변동
      const isVolumeWhaleSpike = volumeRatio > 5 && signal.metadata?.whaleActivity > 60; // 거래량 5배 + 고래 활동
      const isLowScoreHighVolatility = score < 65 && volatility > 25; // 낮은 점수 + 높은 변동률
      
      action = (isOverheated || isVolumeWhaleSpike || isLowScoreHighVolatility) ? 'SELL' : 'BUY';
      priority = 'medium_priority';
    } else {
      timeframe = 'LONG_TERM';
      action = 'HOLD';
      priority = 'low_priority';
    }
    
    return {
      ...signal,
      timeframe,
      action,
      priority,
    };
  }) || [];

  // 필터링된 신호들
  const filteredSignals = classifiedSignals.filter(signal => {
    if (selectedStrategy === 'all') return true;
    if (selectedStrategy === 'BUY') return signal.action === 'BUY';
    if (selectedStrategy === 'SELL') return signal.action === 'SELL';
    if (selectedStrategy === 'HOLD') return signal.action === 'HOLD';
    return signal.timeframe === selectedStrategy;
  });

  // 생성순서대로 정렬
  const sortedSignals = filteredSignals.sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // 통계 계산 (전체 데이터 기반 - 필터와 무관하게 고정)
  const totalSignals = classifiedSignals.length;
  const buySignals = classifiedSignals.filter(s => s.action === 'BUY').length;
  const sellSignals = classifiedSignals.filter(s => s.action === 'SELL').length;
  const holdSignals = classifiedSignals.filter(s => s.action === 'HOLD').length;

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

  const convertApiSignalToTradingSignal = (apiSignal: ApiTradingSignal): TradingSignal => {
    // API 데이터에서 실제 변동률 추출
    const change24h = apiSignal.metadata?.priceData?.change_24h || 0;
    const volumeRatio = apiSignal.metadata?.volumeRatio || 1;
    const whaleActivity = apiSignal.metadata?.whaleActivity || 50;
    
    // 점수 기반으로 동적 계산
    const score = apiSignal.score;
    const breakdown = apiSignal.breakdown;
    
    // 점수에 따른 예상 수익률 계산 (매수/매도에 따라 다르게 계산)
    const baseReturn = Math.max(5, Math.min(25, (score - 50) * 0.4 + 5));
    const expectedReturn = apiSignal.action === 'SELL' ? -baseReturn : baseReturn;
    
    // 점수에 따른 최대 손실 계산 (높은 점수일수록 낮은 손실)
    const maxLoss = Math.max(2, Math.min(10, 10 - (score - 50) * 0.16));
    
    // 위험도 계산 (점수와 변동률 기반)
    const volatility = Math.abs(change24h);
    let riskLevel = 3; // 기본값
    if (score >= 80 && volatility < 10) riskLevel = 1; // 낮음
    else if (score >= 60 && volatility < 20) riskLevel = 2; // 보통
    else if (score < 50 || volatility > 30) riskLevel = 4; // 높음
    else if (score < 40 || volatility > 50) riskLevel = 5; // 매우 높음
    
    // 타겟 가격 계산 (매수/매도에 따라 다르게 계산)
    const targetMultiplier = 1 + (expectedReturn / 100);
    const stopLossMultiplier = apiSignal.action === 'SELL' 
      ? 1 + (maxLoss / 100)  // 매도 시 손절가는 현재가보다 높음
      : 1 - (maxLoss / 100); // 매수 시 손절가는 현재가보다 낮음
    const takeProfitMultiplier = 1 + (expectedReturn * 1.5 / 100);
    
    // 포지션 크기 계산 (점수와 위험도 기반)
    const basePositionSize = 100000;
    const positionSizeMultiplier = Math.min(2, Math.max(0.5, score / 50));
    const positionSize = Math.round(basePositionSize * positionSizeMultiplier);
    const positionSizePercentage = Math.min(20, Math.max(5, score / 5));
    const maxRiskAmount = Math.round(positionSize * (maxLoss / 100));
    
    // 기술적 분석 이유 생성
    const technicalReasons = [];
    if (breakdown?.price && breakdown.price >= 70) technicalReasons.push(`가격 지표 우수 (${breakdown.price}점)`);
    if (breakdown?.volume && breakdown.volume >= 80) technicalReasons.push(`거래량 급증 (${breakdown.volume}점)`);
    if (breakdown?.market && breakdown.market >= 60) technicalReasons.push(`시장 상황 양호 (${breakdown.market}점)`);
    if (volumeRatio > 2) technicalReasons.push(`거래량 비율 ${volumeRatio.toFixed(1)}배 증가`);
    
    // 펀더멘털 분석 이유 생성
    const fundamentalReasons = [];
    if (breakdown?.sentiment && breakdown.sentiment >= 60) fundamentalReasons.push(`시장 심리 긍정적 (${breakdown.sentiment}점)`);
    if (whaleActivity > 60) fundamentalReasons.push(`고래 활동 증가 (${whaleActivity}점)`);
    if (apiSignal.priority === 'high_priority') fundamentalReasons.push('높은 우선순위 신호');
    
    // 뉴스/센티먼트 이유 생성
    const sentimentReasons = [];
    if (change24h > 0) sentimentReasons.push(`24시간 상승률 ${change24h.toFixed(1)}%`);
    if (apiSignal.metadata?.newsCount && apiSignal.metadata.newsCount > 0) sentimentReasons.push(`관련 뉴스 ${apiSignal.metadata.newsCount}건`);
    
    // 동적 체크리스트 생성 (매수/매도에 따라 다르게)
    const checklist = [
      { id: '1', text: '시장 상황 및 뉴스 확인', completed: false },
      { id: '2', text: `리스크 관리 (최대 ${maxLoss}% 손실 한도)`, completed: false },
      { id: '3', text: `포지션 크기 결정 (${positionSizePercentage}% 권장)`, completed: false },
      { id: '4', text: `손절가 설정 (${(apiSignal.price * stopLossMultiplier).toFixed(4)})`, completed: false },
      { id: '5', text: `익절가 설정 (${(apiSignal.price * takeProfitMultiplier).toFixed(4)})`, completed: false },
    ];
    
    // 위험도 텍스트 변환
    const riskTexts = ['매우 낮음', '낮음', '보통', '높음', '매우 높음'];
    const riskText = riskTexts[riskLevel - 1] || '보통';

    return {
      id: apiSignal.id,
      coin: {
        id: apiSignal.coinId,
        symbol: apiSignal.symbol,
        name: apiSignal.name,
        currentPrice: apiSignal.price,
        change24h: change24h,
        image: '', // API에서 제공하지 않음
      },
      signal: {
        action: apiSignal.action,
        strength: apiSignal.confidence === 'HIGH' ? 'STRONG' : apiSignal.confidence === 'MEDIUM' ? 'MEDIUM' : 'WEAK',
        confidence: apiSignal.score,
      },
      targets: {
        entryPrice: apiSignal.price,
        targetPrice: apiSignal.price * targetMultiplier,
        stopLoss: apiSignal.price * stopLossMultiplier,
        takeProfit: apiSignal.price * takeProfitMultiplier,
        positionSize: positionSize,
        positionSizePercentage: positionSizePercentage,
        maxRiskAmount: maxRiskAmount,
      },
      timeframe: {
        strategy: apiSignal.timeframe === 'LONG_TERM' ? 'LONG_TERM' : 
                 apiSignal.timeframe === 'SHORT_TERM' ? 'SWING_TRADING' : 'DAY_TRADING',
        duration: apiSignal.timeframe,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      reasons: {
        technical: technicalReasons.length > 0 ? technicalReasons : [`AI 점수: ${apiSignal.score}/100`],
        fundamental: fundamentalReasons.length > 0 ? fundamentalReasons : [`우선순위: ${apiSignal.priority}`],
        sentiment: sentimentReasons,
        news: [],
      },
      checklist: checklist,
      riskLevel: riskLevel as 1 | 2 | 3 | 4 | 5,
      expectedReturn: expectedReturn,
      maxLoss: maxLoss,
      riskText: riskText,
    };
  };

  const handleSignalClick = (signalId: string, _action: 'BUY' | 'SELL', _amount: number, _price: number) => {
    const apiSignal = signals?.find(s => s.id === signalId);
    if (apiSignal) {
      const tradingSignal = convertApiSignalToTradingSignal(apiSignal);
      setSelectedSignal(tradingSignal);
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
          <StatCard 
            $isClickable 
            $isActive={selectedStrategy === 'all'}
            onClick={() => setSelectedStrategy('all')}
          >
            <StatValue>{totalSignals}</StatValue>
            <StatLabel>전체 신호</StatLabel>
          </StatCard>
          <StatCard 
            $isClickable 
            $isActive={selectedStrategy === 'BUY'}
            onClick={() => setSelectedStrategy('BUY')}
          >
            <StatValue style={{ color: '#10B981' }}>{buySignals}</StatValue>
            <StatLabel>매수 신호</StatLabel>
          </StatCard>
          <StatCard 
            $isClickable 
            $isActive={selectedStrategy === 'SELL'}
            onClick={() => setSelectedStrategy('SELL')}
          >
            <StatValue style={{ color: '#EF4444' }}>{sellSignals}</StatValue>
            <StatLabel>매도 신호</StatLabel>
          </StatCard>
          <StatCard 
            $isClickable 
            $isActive={selectedStrategy === 'HOLD'}
            onClick={() => setSelectedStrategy('HOLD')}
          >
            <StatValue style={{ color: '#F59E0B' }}>{holdSignals}</StatValue>
            <StatLabel>관망 신호</StatLabel>
          </StatCard>
        </StatsSection>

        {sortedSignals.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>📊</EmptyStateIcon>
            <EmptyStateTitle>매매 신호가 없습니다</EmptyStateTitle>
            <EmptyStateText>
              현재 활성화된 매매 신호가 없습니다. 잠시 후 다시 확인해주세요.
            </EmptyStateText>
          </EmptyState>
        ) : (
          <SignalsList>
            {sortedSignals.map((signal) => (
              <CompactTradingSignalCard
                key={signal.id}
                signal={signal}
                onExecuteTrade={handleSignalClick}
                isExecuting={executeTradeMutation.isPending}
              />
            ))}
          </SignalsList>
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
