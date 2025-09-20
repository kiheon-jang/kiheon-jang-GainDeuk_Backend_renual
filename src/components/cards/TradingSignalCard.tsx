import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { TrendingUp, TrendingDown, Clock, Target, Shield, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import type { TradingSignal } from '@/types';
import { formatPrice, getSignalColor, getSignalText, formatTimeRemaining } from '@/utils';

interface TradingSignalCardProps {
  signal: TradingSignal;
  onExecuteTrade?: (signalId: string, action: 'BUY' | 'SELL', amount: number, price: number) => void;
  isExecuting?: boolean;
}

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Card = styled.div<{ signalType: 'BUY' | 'SELL' }>`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  box-shadow: ${({ theme }) => theme.shadows.LG};
  padding: 1.5rem;
  border: 2px solid ${({ signalType }) => getSignalColor(signalType)}40;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-out;
  transition: ${({ theme }) => theme.transitions.FAST};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.XL};
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${({ signalType }) => getSignalColor(signalType)}, ${({ signalType }) => getSignalColor(signalType)}80);
  }
`;

const SignalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CoinImage = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
`;

const CoinDetails = styled.div`
  flex: 1;
`;

const CoinName = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 0.25rem 0;
`;

const CoinPrice = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const SignalBadge = styled.div<{ signalType: 'BUY' | 'SELL' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ signalType }) => getSignalColor(signalType)}15;
  color: ${({ signalType }) => getSignalColor(signalType)};
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-weight: 700;
  font-size: ${({ theme }) => theme.fonts.size.SM};
  animation: ${pulse} 2s infinite;
`;

const SignalContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.MD}) {
    grid-template-columns: 1fr;
  }
`;

const TradingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
`;

const InfoIcon = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${({ color, theme }) => color ? `${color}15` : theme.colors.gray[100]};
  color: ${({ color, theme }) => color || theme.colors.gray[600]};
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.XS};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.gray[900]};
  font-weight: 600;
`;

const StrategyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StrategyBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.primary}15;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-weight: 600;
  font-size: ${({ theme }) => theme.fonts.size.SM};
  width: fit-content;
`;

const ConfidenceBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background: ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  overflow: hidden;
`;

const ConfidenceFill = styled.div<{ confidence: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.danger}, ${({ theme }) => theme.colors.warning}, ${({ theme }) => theme.colors.secondary});
  width: ${({ confidence }) => confidence}%;
  transition: width 0.3s ease;
`;

const RationaleSection = styled.div`
  margin-bottom: 1.5rem;
`;

const RationaleTitle = styled.h4`
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RationaleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RationaleItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.gray[700]};
  line-height: 1.5;
`;

const ChecklistSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ChecklistTitle = styled.h4`
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChecklistList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ChecklistItem = styled.div<{ completed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${({ completed, theme }) => completed ? `${theme.colors.secondary}15` : theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ completed, theme }) => completed ? theme.colors.secondary : theme.colors.gray[700]};
  text-decoration: ${({ completed }) => completed ? 'line-through' : 'none'};
  opacity: ${({ completed }) => completed ? 0.7 : 1};
`;

const ActionSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ExecuteButton = styled.button<{ signalType: 'BUY' | 'SELL'; disabled?: boolean }>`
  flex: 1;
  background: ${({ signalType, disabled }) => disabled ? '#9CA3AF' : getSignalColor(signalType)};
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  font-weight: 700;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: ${({ theme }) => theme.transitions.FAST};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: ${({ signalType }) => getSignalColor(signalType)}dd;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const TimerSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.warning};
  font-weight: 600;
  font-size: ${({ theme }) => theme.fonts.size.SM};
`;

const TradingSignalCard: React.FC<TradingSignalCardProps> = ({
  signal,
  onExecuteTrade,
  isExecuting = false
}) => {
  const [timeRemaining, setTimeRemaining] = useState(formatTimeRemaining(signal.timeframe.validUntil));
  const [checklistItems, setChecklistItems] = useState(signal.checklist);

  // 타이머 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(signal.timeframe.validUntil));
    }, 1000);

    return () => clearInterval(interval);
  }, [signal.timeframe.validUntil]);

  const handleExecuteTrade = () => {
    if (onExecuteTrade && !isExecuting && signal.signal.action !== 'HOLD') {
      onExecuteTrade(
        signal.id,
        signal.signal.action as 'BUY' | 'SELL',
        signal.targets.positionSize,
        signal.targets.entryPrice
      );
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const isExpired = timeRemaining === '만료됨';
  const allChecklistCompleted = checklistItems.every(item => item.completed);
  const isHoldSignal = signal.signal.action === 'HOLD';

  return (
    <Card signalType={isHoldSignal ? 'BUY' : signal.signal.action as 'BUY' | 'SELL'}>
      <SignalHeader>
        <CoinInfo>
          <CoinImage src={signal.coin.image} alt={signal.coin.name} />
          <CoinDetails>
            <CoinName>{signal.coin.name}</CoinName>
            <CoinPrice>{formatPrice(signal.coin.currentPrice)}</CoinPrice>
          </CoinDetails>
        </CoinInfo>
        <SignalBadge signalType={isHoldSignal ? 'BUY' : signal.signal.action as 'BUY' | 'SELL'}>
          {signal.signal.action === 'BUY' ? <TrendingUp size={20} /> : signal.signal.action === 'SELL' ? <TrendingDown size={20} /> : <Clock size={20} />}
          {getSignalText(signal.signal.action)}
        </SignalBadge>
      </SignalHeader>

      <SignalContent>
        <TradingInfo>
          <InfoItem>
            <InfoIcon color={getSignalColor('SELL')}>
              <Shield size={16} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>손절가</InfoLabel>
              <InfoValue>{formatPrice(signal.targets.stopLoss)}</InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon color={getSignalColor('BUY')}>
              <Target size={16} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>목표가</InfoLabel>
              <InfoValue>{formatPrice(signal.targets.targetPrice)}</InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon color="#3B82F6">
              <DollarSign size={16} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>포지션 크기</InfoLabel>
              <InfoValue>{formatPrice(signal.targets.positionSize)}</InfoValue>
            </InfoContent>
          </InfoItem>
        </TradingInfo>

        <StrategyInfo>
          <StrategyBadge>
            📊 {signal.timeframe.strategy}
          </StrategyBadge>
          
          <div>
            <InfoLabel>AI 신뢰도</InfoLabel>
            <ConfidenceBar>
              <ConfidenceFill confidence={signal.signal.confidence} />
            </ConfidenceBar>
            <InfoValue style={{ marginTop: '0.5rem' }}>{signal.signal.confidence}%</InfoValue>
          </div>
        </StrategyInfo>
      </SignalContent>

      <RationaleSection>
        <RationaleTitle>
          <AlertCircle size={16} />
          신호 근거
        </RationaleTitle>
        <RationaleList>
          {[...signal.reasons.technical, ...signal.reasons.fundamental, ...signal.reasons.sentiment, ...signal.reasons.news].slice(0, 4).map((reason, index) => (
            <RationaleItem key={index}>
              💡 {reason}
            </RationaleItem>
          ))}
        </RationaleList>
      </RationaleSection>

      <ChecklistSection>
        <ChecklistTitle>
          <CheckCircle size={16} />
          매매 체크리스트
        </ChecklistTitle>
        <ChecklistList>
          {checklistItems.map((item) => (
            <ChecklistItem
              key={item.id}
              completed={item.completed}
              onClick={() => toggleChecklistItem(item.id)}
              style={{ cursor: 'pointer' }}
            >
              {item.completed ? '✅' : '⭕'} {item.text}
            </ChecklistItem>
          ))}
        </ChecklistList>
      </ChecklistSection>

      <ActionSection>
        <ExecuteButton
          signalType={isHoldSignal ? 'BUY' : signal.signal.action as 'BUY' | 'SELL'}
          disabled={isExecuting || isExpired || !allChecklistCompleted || isHoldSignal}
          onClick={handleExecuteTrade}
        >
          {isExecuting ? (
            <>⏳ 실행 중...</>
          ) : isExpired ? (
            <>⏰ 신호 만료</>
          ) : isHoldSignal ? (
            <>⏸️ 관망 신호</>
          ) : !allChecklistCompleted ? (
            <>📋 체크리스트 완료 필요</>
          ) : (
            <>
              {signal.signal.action === 'BUY' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              {signal.signal.action === 'BUY' ? '매수 실행' : '매도 실행'}
            </>
          )}
        </ExecuteButton>

        <TimerSection>
          <Clock size={16} />
          {timeRemaining}
        </TimerSection>
      </ActionSection>
    </Card>
  );
};

export default TradingSignalCard;
