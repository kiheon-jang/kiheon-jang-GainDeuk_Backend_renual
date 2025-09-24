import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Clock, Target, DollarSign, CheckCircle } from 'lucide-react';
import type { ApiTradingSignal } from '@/types';
import { getCoinIcon, getCoinColor } from '@/utils/imageUtils';
import { formatPrice, getSignalColor, getSignalText } from '@/utils';
import { media } from '@/utils/responsive';

interface CompactTradingSignalCardProps {
  signal: ApiTradingSignal;
  onExecuteTrade?: (signalId: string, action: 'BUY' | 'SELL', amount: number, price: number) => void;
  isExecuting?: boolean;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideDown = keyframes`
  from { max-height: 0; opacity: 0; }
  to { max-height: 500px; opacity: 1; }
`;

const slideUp = keyframes`
  from { max-height: 500px; opacity: 1; }
  to { max-height: 0; opacity: 0; }
`;

const Card = styled.div<{ $signalType: 'BUY' | 'SELL' | 'HOLD'; $isExpanded: boolean }>`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  box-shadow: ${({ theme }) => theme.shadows.SM};
  border: 1px solid ${({ $signalType }) => getSignalColor($signalType)}30;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-out;
  transition: ${({ theme }) => theme.transitions.FAST};
  cursor: pointer;

  ${media.max.sm`
    margin-bottom: 0.5rem;
  `}

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.MD};
    transform: translateY(-1px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ $signalType }) => getSignalColor($signalType)};
  }
`;

const CompactHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  min-height: 70px;

  ${media.max.sm`
    padding: 0.75rem 1rem;
    min-height: 60px;
  `}
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
`;

const CoinIconContainer = styled.div<{ $color: string }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ $color }) => $color}20, ${({ $color }) => $color}40);
  border: 2px solid ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${media.max.sm`
    width: 2rem;
    height: 2rem;
  `}
`;

const CoinIconText = styled.span`
  font-size: 1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};

  ${media.max.sm`
    font-size: 0.875rem;
  `}
`;

const CoinDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const CoinName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${media.max.sm`
    font-size: 0.875rem;
  `}
`;

const CoinSymbol = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;

const MiddleInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 100px;
  flex-shrink: 0;
  padding: 0 0.5rem;

  ${media.max.sm`
    min-width: 80px;
    gap: 0.375rem;
    padding: 0 0.25rem;
  `}
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
`;

const InfoLabel = styled.div`
  font-size: 0.625rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
  text-align: center;
  opacity: 0.8;

  ${media.max.sm`
    font-size: 0.5rem;
  `}
`;

const Timeframe = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
  text-align: center;

  ${media.max.sm`
    font-size: 0.625rem;
  `}
`;

const ExpectedReturn = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: #10B981;
  text-align: center;

  ${media.max.sm`
    font-size: 0.75rem;
  `}
`;

const SignalInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  min-width: 100px;
  flex-shrink: 0;
  padding: 0 0.5rem;

  ${media.max.sm`
    min-width: 80px;
    gap: 0.25rem;
    padding: 0 0.25rem;
  `}
`;

const SignalBadge = styled.div<{ $signalType: 'BUY' | 'SELL' | 'HOLD' }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  background: ${({ $signalType }) => getSignalColor($signalType)}20;
  color: ${({ $signalType }) => getSignalColor($signalType)};
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid ${({ $signalType }) => getSignalColor($signalType)}40;

  ${media.max.sm`
    font-size: 0.625rem;
    padding: 0.25rem 0.5rem;
  `}
`;

const SignalIcon = styled.div<{ $signalType: 'BUY' | 'SELL' | 'HOLD' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;

  ${media.max.sm`
    width: 0.875rem;
    height: 0.875rem;
  `}
`;

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.375rem;
  min-width: 100px;
  flex-shrink: 0;
  padding: 0 0.5rem;

  ${media.max.sm`
    min-width: 80px;
    gap: 0.25rem;
    padding: 0 0.25rem;
  `}
`;

const PriceInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
`;

const Price = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};

  ${media.max.sm`
    font-size: 0.75rem;
  `}
`;

const Confidence = styled.div`
  font-size: 0.625rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;

  ${media.max.sm`
    font-size: 0.5rem;
  `}
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  transition: ${({ theme }) => theme.transitions.FAST};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ExpandedContent = styled.div<{ $isExpanded: boolean }>`
  max-height: ${({ $isExpanded }) => $isExpanded ? '800px' : '0'};
  overflow: hidden;
  animation: ${({ $isExpanded }) => $isExpanded ? slideDown : slideUp} 0.3s ease-out;
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const ExpandedInner = styled.div`
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.secondary};

  ${media.max.sm`
    padding: 1rem;
  `}
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  ${media.max.sm`
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  `}
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const DetailLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 700;
`;

const ConfidenceBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  overflow: hidden;
  margin: 0.5rem 0;
`;

const ConfidenceFill = styled.div<{ $confidence: number }>`
  height: 100%;
  background: linear-gradient(90deg, #EF4444, #F59E0B, #10B981);
  width: ${({ $confidence }) => $confidence}%;
  transition: width 0.3s ease;
`;

const RationaleSection = styled.div`
  margin-bottom: 1.5rem;
`;

const RationaleTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
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
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const ChecklistSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ChecklistTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
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
  background: ${({ $completed, theme }) => $completed ? `${theme.colors.primary}15` : theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-size: 0.875rem;
  color: ${({ $completed, theme }) => $completed ? theme.colors.primary : theme.colors.text.secondary};
  text-decoration: ${({ $completed }) => $completed ? 'line-through' : 'none'};
  opacity: ${({ $completed }) => $completed ? 0.7 : 1};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const RiskInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};

  ${media.max.sm`
    grid-template-columns: 1fr;
    gap: 0.75rem;
  `}
`;

const RiskItem = styled.div`
  text-align: center;
`;

const RiskLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const RiskValue = styled.div<{ $type: 'return' | 'loss' | 'level' }>`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ $type, theme }) => {
    switch ($type) {
      case 'return': return '#10B981';
      case 'loss': return '#EF4444';
      case 'level': return '#F59E0B';
      default: return theme.colors.text.primary;
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;

  ${media.max.sm`
    flex-direction: column;
    gap: 0.5rem;
  `}
`;

const ActionButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.FAST};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${({ $variant, theme }) => $variant === 'primary' ? `
    background: ${theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${theme.colors.primary}90;
    }
  ` : `
    background: ${theme.colors.background.primary};
    color: ${theme.colors.text.primary};
    border: 1px solid ${theme.colors.border.primary};
    
    &:hover {
      background: ${theme.colors.background.secondary};
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${media.max.sm`
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
  `}
`;

const CompactTradingSignalCard: React.FC<CompactTradingSignalCardProps> = ({
  signal,
  onExecuteTrade,
  isExecuting = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const coinIcon = getCoinIcon(signal.symbol);
  const coinColor = getCoinColor(signal.symbol);
  const signalText = getSignalText(signal.action);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleExecuteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onExecuteTrade && signal.action !== 'HOLD') {
      onExecuteTrade(signal.id, signal.action, 1, signal.price);
    }
  };

  const getSignalIcon = () => {
    switch (signal.action) {
      case 'BUY':
        return <TrendingUp size={12} />;
      case 'SELL':
        return <TrendingDown size={12} />;
      default:
        return <Target size={12} />;
    }
  };

  return (
    <Card $signalType={signal.action} $isExpanded={isExpanded} onClick={handleCardClick}>
      <CompactHeader>
        <CoinInfo>
          <CoinIconContainer $color={coinColor}>
            <CoinIconText>{coinIcon}</CoinIconText>
          </CoinIconContainer>
          <CoinDetails>
            <CoinName>{signal.name}</CoinName>
            <CoinSymbol>{signal.symbol}</CoinSymbol>
          </CoinDetails>
        </CoinInfo>
        
        <MiddleInfo>
          <InfoItem>
            <InfoLabel>전략시간대</InfoLabel>
            <Timeframe>{signal.timeframe}</Timeframe>
          </InfoItem>
          <InfoItem>
            <InfoLabel>예상수익률</InfoLabel>
            <ExpectedReturn style={{ color: signal.action === 'SELL' ? '#EF4444' : '#10B981' }}>
              {signal.action === 'SELL' ? '-' : '+'}{Math.round((signal.score - 50) * 0.4 + 5)}%
            </ExpectedReturn>
          </InfoItem>
        </MiddleInfo>

        <SignalInfo>
          <InfoLabel>매매신호</InfoLabel>
          <SignalBadge $signalType={signal.action}>
            <SignalIcon $signalType={signal.action}>
              {getSignalIcon()}
            </SignalIcon>
            {signalText}
          </SignalBadge>
        </SignalInfo>

        <PriceInfo>
          <PriceInfoItem>
            <InfoLabel>현재가격</InfoLabel>
            <Price>${formatPrice(signal.price)}</Price>
          </PriceInfoItem>
          <PriceInfoItem>
            <InfoLabel>신뢰도</InfoLabel>
            <Confidence>{signal.confidence}</Confidence>
          </PriceInfoItem>
        </PriceInfo>

        <ExpandButton onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </ExpandButton>
      </CompactHeader>

      <ExpandedContent $isExpanded={isExpanded}>
        <ExpandedInner>
          {/* 기본 정보 그리드 */}
          <DetailsGrid>
            <DetailItem>
              <DetailLabel>AI 점수</DetailLabel>
              <DetailValue>{signal.score}/100</DetailValue>
              <ConfidenceBar>
                <ConfidenceFill $confidence={signal.score} />
              </ConfidenceBar>
            </DetailItem>
            <DetailItem>
              <DetailLabel>전략 시간대</DetailLabel>
              <DetailValue>{signal.timeframe}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>우선순위</DetailLabel>
              <DetailValue>{signal.priority}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>신호 생성일</DetailLabel>
              <DetailValue>{new Date(signal.createdAt).toLocaleDateString('ko-KR')}</DetailValue>
            </DetailItem>
          </DetailsGrid>

          {/* 리스크 정보 */}
          <RiskInfo>
            <RiskItem>
              <RiskLabel>예상 수익률</RiskLabel>
              <RiskValue $type="return" style={{ color: signal.action === 'SELL' ? '#F59E0B' : '#10B981' }}>
                {signal.action === 'SELL' 
                  ? `손실 방지 (${Math.round((signal.score - 50) * 0.4 + 5)}% 하락 예상)` 
                  : `+${Math.round((signal.score - 50) * 0.4 + 5)}% (가격상승시 수익)`
                }
              </RiskValue>
            </RiskItem>
            <RiskItem>
              <RiskLabel>{signal.action === 'SELL' ? '매도 이유' : '최대 손실'}</RiskLabel>
              <RiskValue $type="loss" style={{ color: signal.action === 'SELL' ? '#F59E0B' : '#EF4444' }}>
                {signal.action === 'SELL' 
                  ? (() => {
                      const volatility = Math.abs((signal as any).metadata?.priceData?.change_24h || 0);
                      if (volatility > 25) return '높은 변동률';
                      if (volatility > 15) return '중간 변동률';
                      return '낮은 변동률';
                    })()
                  : `-${Math.round(10 - (signal.score - 50) * 0.16)}% (가격하락시 손절)`
                }
              </RiskValue>
            </RiskItem>
            <RiskItem>
              <RiskLabel>위험도</RiskLabel>
              <RiskValue $type="level">{(() => {
                const volatility = Math.abs((signal as any).metadata?.priceData?.change_24h || 0);
                if (signal.score >= 80 && volatility < 10) return '낮음';
                else if (signal.score >= 60 && volatility < 20) return '보통';
                else if (signal.score < 50 || volatility > 30) return '높음';
                else if (signal.score < 40 || volatility > 50) return '매우 높음';
                return '보통';
              })()}</RiskValue>
            </RiskItem>
          </RiskInfo>

          {/* 추천 이유 */}
          <RationaleSection>
            <RationaleTitle>
              <Target size={16} />
              AI 추천 이유
            </RationaleTitle>
            <RationaleList>
              {(() => {
                const reasons = [];
                const breakdown = (signal as any).breakdown;
                const metadata = (signal as any).metadata;
                
                // 기술적 분석 이유
                if (breakdown?.price && breakdown.price >= 70) {
                  reasons.push(`가격 지표 우수 (${breakdown.price}점)`);
                }
                if (breakdown?.volume && breakdown.volume >= 80) {
                  reasons.push(`거래량 급증 (${breakdown.volume}점)`);
                }
                if (metadata?.volumeRatio && metadata.volumeRatio > 2) {
                  reasons.push(`거래량 비율 ${metadata.volumeRatio.toFixed(1)}배 증가`);
                }
                
                // 시장 상황 이유
                if (breakdown?.market && breakdown.market >= 60) {
                  reasons.push(`시장 상황 양호 (${breakdown.market}점)`);
                }
                if (breakdown?.sentiment && breakdown.sentiment >= 60) {
                  reasons.push(`시장 심리 긍정적 (${breakdown.sentiment}점)`);
                }
                
                // 고래 활동 이유
                if (metadata?.whaleActivity && metadata.whaleActivity > 60) {
                  reasons.push(`고래 활동 증가 (${metadata.whaleActivity}점)`);
                }
                
                // 가격 변동 이유
                if (metadata?.priceData?.change_24h && metadata.priceData.change_24h > 0) {
                  reasons.push(`24시간 상승률 ${metadata.priceData.change_24h.toFixed(1)}%`);
                }
                
                // 우선순위 이유
                if (signal.priority === 'high_priority') {
                  reasons.push('높은 우선순위 신호');
                }
                
                // 기본 이유 (위 조건들이 없을 때)
                if (reasons.length === 0) {
                  reasons.push(
                    `AI 점수: ${signal.score}/100`,
                    `${signal.timeframe} 전략에 최적화`,
                    `${signal.confidence} 신뢰도 수준`
                  );
                }
                
                return reasons.map((reason, index) => (
                  <RationaleItem key={`rationale-${index}-${reason.slice(0, 10)}`}>
                    💡 {reason}
                  </RationaleItem>
                ));
              })()}
            </RationaleList>
          </RationaleSection>

          {/* 체크리스트 */}
          <ChecklistSection>
            <ChecklistTitle>
              <CheckCircle size={16} />
              매매 전 체크리스트
            </ChecklistTitle>
            <ChecklistList>
              {(() => {
                const maxLoss = Math.round(10 - (signal.score - 50) * 0.16);
                const positionSizePercentage = Math.min(20, Math.max(5, signal.score / 5));
                const stopLossMultiplier = 1 - (maxLoss / 100);
                const takeProfitMultiplier = 1 + ((Math.round((signal.score - 50) * 0.4 + 5)) * 1.5 / 100);
                
                return [
                  '시장 상황 및 뉴스 확인',
                  `리스크 관리 (최대 ${maxLoss}% 손실 한도)`,
                  `포지션 크기 결정 (${positionSizePercentage}% 권장)`,
                  `손절가 설정 (${(signal.price * stopLossMultiplier).toFixed(4)})`,
                  `익절가 설정 (${(signal.price * takeProfitMultiplier).toFixed(4)})`
                ].map((item, index) => (
                  <ChecklistItem key={`checklist-${index}-${item.slice(0, 10)}`} $completed={false}>
                    <CheckCircle size={14} />
                    {item}
                  </ChecklistItem>
                ));
              })()}
            </ChecklistList>
          </ChecklistSection>

          {/* 액션 버튼 */}
          <ActionButtons>
            <ActionButton $variant="secondary" onClick={(e) => { e.stopPropagation(); }}>
              <Clock size={14} />
              더 자세히 보기
            </ActionButton>
            {signal.action !== 'HOLD' && (
              <ActionButton 
                $variant="primary" 
                onClick={handleExecuteClick}
                disabled={isExecuting}
              >
                <DollarSign size={14} />
                {signal.action === 'BUY' ? '매수하기' : '매도하기'}
              </ActionButton>
            )}
          </ActionButtons>
        </ExpandedInner>
      </ExpandedContent>
    </Card>
  );
};

export default CompactTradingSignalCard;
