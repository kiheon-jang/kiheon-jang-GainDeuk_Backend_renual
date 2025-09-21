import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Clock, Target, DollarSign } from 'lucide-react';
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
  min-height: 60px;

  ${media.max.sm`
    padding: 0.75rem 1rem;
    min-height: 50px;
  `}
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
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

const SignalInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const SignalBadge = styled.div<{ $signalType: 'BUY' | 'SELL' | 'HOLD' }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  background: ${({ $signalType }) => getSignalColor($signalType)}20;
  color: ${({ $signalType }) => getSignalColor($signalType)};
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid ${({ $signalType }) => getSignalColor($signalType)}40;

  ${media.max.sm`
    font-size: 0.625rem;
    padding: 0.2rem 0.4rem;
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
  gap: 0.25rem;
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
  max-height: ${({ $isExpanded }) => $isExpanded ? '500px' : '0'};
  overflow: hidden;
  animation: ${({ $isExpanded }) => $isExpanded ? slideDown : slideUp} 0.3s ease-out;
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const ExpandedInner = styled.div`
  padding: 1.25rem;
  background: ${({ theme }) => theme.colors.background.secondary};

  ${media.max.sm`
    padding: 1rem;
  `}
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;

  ${media.max.sm`
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  `}
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;

const DetailValue = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
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
  const signalColor = getSignalColor(signal.action);
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
        
        <SignalInfo>
          <SignalBadge $signalType={signal.action}>
            <SignalIcon $signalType={signal.action}>
              {getSignalIcon()}
            </SignalIcon>
            {signalText}
          </SignalBadge>
        </SignalInfo>

        <PriceInfo>
          <Price>${formatPrice(signal.price)}</Price>
          <Confidence>{signal.confidence}</Confidence>
        </PriceInfo>

        <ExpandButton onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </ExpandButton>
      </CompactHeader>

      <ExpandedContent $isExpanded={isExpanded}>
        <ExpandedInner>
          <DetailsGrid>
            <DetailItem>
              <DetailLabel>점수</DetailLabel>
              <DetailValue>{signal.score}/100</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>시간대</DetailLabel>
              <DetailValue>{signal.timeframe}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>우선순위</DetailLabel>
              <DetailValue>{signal.priority}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>생성일</DetailLabel>
              <DetailValue>{new Date(signal.createdAt).toLocaleDateString()}</DetailValue>
            </DetailItem>
          </DetailsGrid>

          <ActionButtons>
            <ActionButton $variant="secondary" onClick={(e) => { e.stopPropagation(); }}>
              <Clock size={14} />
              상세보기
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
