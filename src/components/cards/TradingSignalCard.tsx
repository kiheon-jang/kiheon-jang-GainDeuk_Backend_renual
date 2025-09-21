import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { TrendingUp, TrendingDown, Clock, Target, Shield, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import type { ApiTradingSignal } from '@/types';
import { getCoinIcon, getCoinColor } from '@/utils/imageUtils';
import { formatPrice, getSignalColor, getSignalText } from '@/utils';
import { media } from '@/utils/responsive';
import { optimizedMemo } from '../../utils/reactOptimization';

interface TradingSignalCardProps {
  signal: ApiTradingSignal;
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

const Card = styled.div<{ $signalType: 'BUY' | 'SELL' }>`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  box-shadow: ${({ theme }) => theme.shadows.LG};
  padding: 1.5rem;
  border: 2px solid ${({ $signalType }) => getSignalColor($signalType)}40;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-out;
  transition: ${({ theme }) => theme.transitions.FAST};

  ${media.max.sm`
    padding: 1rem;
  `}

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
    background: linear-gradient(90deg, ${({ $signalType }) => getSignalColor($signalType)}, ${({ $signalType }) => getSignalColor($signalType)}80);
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

const CoinIconContainer = styled.div<{ $color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ $color }) => $color}20, ${({ $color }) => $color}40);
  border: 2px solid ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${({ theme }) => theme.transitions.FAST};

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px ${({ $color }) => $color}40;
  }
`;

const CoinIconText = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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

const SignalBadge = styled.div<{ $signalType: 'BUY' | 'SELL' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ $signalType }) => getSignalColor($signalType)}15;
  color: ${({ $signalType }) => getSignalColor($signalType)};
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

const ConfidenceFill = styled.div<{ $confidence: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.danger}, ${({ theme }) => theme.colors.warning}, ${({ theme }) => theme.colors.secondary});
  width: ${({ $confidence }) => $confidence}%;
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

const ChecklistItem = styled.div<{ $completed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${({ $completed, theme }) => $completed ? `${theme.colors.secondary}15` : theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ $completed, theme }) => $completed ? theme.colors.secondary : theme.colors.gray[700]};
  text-decoration: ${({ $completed }) => $completed ? 'line-through' : 'none'};
  opacity: ${({ $completed }) => $completed ? 0.7 : 1};
`;

const ActionSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ExecuteButton = styled.button<{ $signalType: 'BUY' | 'SELL'; $disabled?: boolean }>`
  flex: 1;
  background: ${({ $signalType, $disabled }) => $disabled ? '#9CA3AF' : getSignalColor($signalType)};
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  font-weight: 700;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  transition: ${({ theme }) => theme.transitions.FAST};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: ${({ $signalType }) => getSignalColor($signalType)}dd;
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
  const [timeRemaining, setTimeRemaining] = useState('24시간');
  const [checklistItems, setChecklistItems] = useState([
    { id: '1', text: '시장 상황 확인', completed: false },
    { id: '2', text: '리스크 관리 계획 수립', completed: false },
    { id: '3', text: '포지션 크기 결정', completed: false },
    { id: '4', text: '손절가/목표가 설정', completed: false }
  ]);

  // 아이콘과 색상 정보
  const coinIcon = getCoinIcon(signal.symbol);
  const coinColor = getCoinColor(signal.symbol);

  // 타이머 업데이트 (ApiTradingSignal에는 validUntil이 없으므로 임시로 처리)
  useEffect(() => {
    const interval = setInterval(() => {
      // 임시로 24시간 고정
      setTimeRemaining('24시간');
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 메모이제이션된 핸들러들
  const handleExecuteTrade = useCallback(() => {
    if (onExecuteTrade && !isExecuting && signal.action !== 'HOLD') {
      onExecuteTrade(
        signal.id,
        signal.action as 'BUY' | 'SELL',
        100000, // 기본 금액 (ApiTradingSignal에는 targets가 없음)
        signal.price
      );
    }
  }, [onExecuteTrade, isExecuting, signal.id, signal.action, signal.price]);

  const toggleChecklistItem = useCallback((id: string) => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }, []);

  // 메모이제이션된 계산값들
  const isExpired = useMemo(() => timeRemaining === '만료됨', [timeRemaining]);
  const allChecklistCompleted = useMemo(() => checklistItems.every(item => item.completed), [checklistItems]);
  const isHoldSignal = useMemo(() => signal.action === 'HOLD', [signal.action]);
  const signalType = useMemo(() => isHoldSignal ? 'BUY' : signal.action as 'BUY' | 'SELL', [isHoldSignal, signal.action]);
  
  // 메모이제이션된 포맷된 값들 (달러를 원화로 변환)
  const formattedCoinPrice = useMemo(() => formatPrice(signal.price, true), [signal.price]);
  const formattedStopLoss = useMemo(() => formatPrice(signal.price * 0.95, true), [signal.price]); // 임시로 5% 손절가
  const formattedTargetPrice = useMemo(() => formatPrice(signal.price * 1.1, true), [signal.price]); // 임시로 10% 목표가
  const formattedPositionSize = useMemo(() => formatPrice(100000, true), []); // 기본 포지션 크기 (10만원)
  
  // 신뢰도 값 안전하게 파싱 (NaN 방지)
  const confidenceValue = useMemo(() => {
    const parsed = parseInt(signal.confidence, 10);
    return isNaN(parsed) ? 0 : Math.max(0, Math.min(100, parsed)); // 0-100 범위로 제한
  }, [signal.confidence]);

  return (
    <Card $signalType={signalType}>
      <SignalHeader>
        <CoinInfo>
          <CoinIconContainer $color={coinColor}>
            <CoinIconText>{coinIcon}</CoinIconText>
          </CoinIconContainer>
          <CoinDetails>
            <CoinName>{signal.name}</CoinName>
            <CoinPrice>{formattedCoinPrice}</CoinPrice>
          </CoinDetails>
        </CoinInfo>
        <SignalBadge $signalType={signalType}>
          {signal.action === 'BUY' ? <TrendingUp size={20} /> : signal.action === 'SELL' ? <TrendingDown size={20} /> : <Clock size={20} />}
          {getSignalText(signal.action)}
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
              <InfoValue>{formattedStopLoss}</InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon color={getSignalColor('BUY')}>
              <Target size={16} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>목표가</InfoLabel>
              <InfoValue>{formattedTargetPrice}</InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon color="#3B82F6">
              <DollarSign size={16} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>포지션 크기</InfoLabel>
              <InfoValue>{formattedPositionSize}</InfoValue>
            </InfoContent>
          </InfoItem>
        </TradingInfo>

        <StrategyInfo>
          <StrategyBadge>
            📊 {signal.timeframe}
          </StrategyBadge>
          
          <div>
            <InfoLabel>AI 신뢰도</InfoLabel>
            <ConfidenceBar>
              <ConfidenceFill $confidence={confidenceValue} />
            </ConfidenceBar>
            <InfoValue style={{ marginTop: '0.5rem' }}>{confidenceValue}%</InfoValue>
          </div>
        </StrategyInfo>
      </SignalContent>

      <RationaleSection>
        <RationaleTitle>
          <AlertCircle size={16} />
          신호 근거
        </RationaleTitle>
        <RationaleList>
          {[
            `기술적 분석 점수: ${signal.score}`,
            `신뢰도: ${confidenceValue}%`,
            `우선순위: ${signal.priority}`,
            `시간대: ${signal.timeframe}`
          ].map((reason, index) => (
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
              $completed={item.completed}
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
          $signalType={isHoldSignal ? 'BUY' : signal.action as 'BUY' | 'SELL'}
          $disabled={isExecuting || isExpired || !allChecklistCompleted || isHoldSignal}
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
              {signal.action === 'BUY' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              {signal.action === 'BUY' ? '매수 실행' : '매도 실행'}
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

// React.memo로 최적화된 컴포넌트 내보내기
export default optimizedMemo(TradingSignalCard, {
  displayName: 'TradingSignalCard',
  deep: false // 얕은 비교 사용 (기본값)
});
