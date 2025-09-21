import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Heart, 
  Share2, 
  ExternalLink,
  TrendingUp,
  AlertTriangle,
  Clock,
  Star
} from 'lucide-react';
import type { CoinRecommendation } from '@/types';
import { getRiskColor, getRiskIcon, formatPrice, formatPercentage } from '@/utils';
import { media, responsiveTypography, touchFriendly } from '@/utils/responsive';
import { optimizedMemo } from '@/utils/reactOptimization';

interface CoinRecommendationCardProps {
  recommendation: CoinRecommendation;
  onClick?: () => void;
  onAddToWatchlist?: (coinId: string) => void;
  onShare?: (recommendation: CoinRecommendation) => void;
  isInWatchlist?: boolean;
}

const Card = styled.div<{ $isExpanded?: boolean }>`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  box-shadow: ${({ theme }) => theme.shadows.MD};
  padding: 1.5rem;
  transition: all ${({ theme }) => theme.transitions.NORMAL};
  border: 2px solid ${({ theme }) => theme.colors.border.primary};
  position: relative;
  overflow: hidden;

  ${media.max.sm`
    padding: 1rem;
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.FAST};
  }

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.XL};
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.colors.primary}40;
    
    &::before {
      opacity: 1;
    }
  }

  ${({ $isExpanded, theme }) => $isExpanded && `
    box-shadow: ${theme.shadows.XL};
    border-color: ${theme.colors.primary}60;
    
    &::before {
      opacity: 1;
    }
  `}
`;

const CoinHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  
  ${media.max.sm`
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  `}
`;

const CoinImage = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
  
  ${media.max.sm`
    width: 2.5rem;
    height: 2.5rem;
  `}
`;

const CoinInfo = styled.div`
  flex: 1;
`;

const CoinName = styled.h3`
  ${responsiveTypography.h3}
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.25rem 0;
`;

const CoinSymbol = styled.span`
  ${responsiveTypography.small}
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;

const CoinPrice = styled.div`
  ${responsiveTypography.body}
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: 0.25rem;
`;

const RecommendationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const ExpectedReturn = styled.div<{ positive: boolean }>`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  font-weight: 700;
  color: ${({ positive, theme }) => positive ? theme.colors.secondary : theme.colors.danger};
  background: ${({ positive, theme }) => positive ? `${theme.colors.secondary}15` : `${theme.colors.danger}15`};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
`;

const RiskLevel = styled.div<{ level: number }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fonts.size.SM};
  font-weight: 500;
  color: ${({ level }) => getRiskColor(level)};
  background: ${({ level }) => `${getRiskColor(level)}15`};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
`;

const Confidence = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.gray[500]};
  background: ${({ theme }) => theme.colors.gray[50]};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
`;

const ReasonsList = styled.div`
  margin-bottom: 1rem;
`;

const ReasonItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Timeframe = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.gray[500]};
  background: ${({ theme }) => theme.colors.gray[50]};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  width: fit-content;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-size: ${({ theme }) => theme.fonts.size.SM};
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.FAST};
  cursor: pointer;
  border: 1px solid transparent;

  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: white;
          &:hover {
            background: ${theme.colors.primary}dd;
            transform: translateY(-1px);
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.danger}15;
          color: ${theme.colors.danger};
          border-color: ${theme.colors.danger}40;
          &:hover {
            background: ${theme.colors.danger}25;
            border-color: ${theme.colors.danger}60;
          }
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.text.primary};
          border-color: ${theme.colors.border.primary};
          &:hover {
            background: ${theme.colors.gray[200]};
            border-color: ${theme.colors.border.secondary};
          }
        `;
    }
  }}

  &:active {
    transform: translateY(0);
  }
`;

const ExpandButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.FAST};
  margin-left: auto;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ExpandedContent = styled.div<{ isExpanded: boolean }>`
  max-height: ${({ isExpanded }) => isExpanded ? '500px' : '0'};
  overflow: hidden;
  transition: max-height ${({ theme }) => theme.transitions.NORMAL} ease-in-out;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const AdditionalReasons = styled.div`
  margin-bottom: 1rem;
`;

const AdditionalReasonItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;

const AIIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.MD};
`;

const WatchlistButton = styled(ActionButton)<{ isInWatchlist: boolean }>`
  ${({ isInWatchlist, theme }) => isInWatchlist && `
    background: ${theme.colors.danger}15;
    color: ${theme.colors.danger};
    border-color: ${theme.colors.danger}40;
  `}
`;

const CoinRecommendationCard: React.FC<CoinRecommendationCardProps> = ({ 
  recommendation, 
  onClick,
  onAddToWatchlist,
  onShare,
  isInWatchlist = false
}) => {
  const { coin, expectedReturn, riskLevel, reasons, confidence, timeframe } = recommendation;
  const [isExpanded, setIsExpanded] = useState(false);

  // 메모이제이션된 핸들러들
  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // 액션 버튼 클릭 시에는 카드 클릭 이벤트 방지
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick?.();
  }, [onClick]);

  const handleAddToWatchlist = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWatchlist?.(coin.id);
  }, [onAddToWatchlist, coin.id]);

  const handleShare = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(recommendation);
  }, [onShare, recommendation]);

  const handleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(prev => !prev);
  }, []);

  const handleViewDetails = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  }, [onClick]);

  // 메모이제이션된 계산값들
  const additionalReasons = useMemo(() => reasons.slice(3), [reasons]);
  const mainReasons = useMemo(() => reasons.slice(0, 3), [reasons]);
  const formattedPrice = useMemo(() => formatPrice(coin.currentPrice), [coin.currentPrice]);
  const formattedReturn = useMemo(() => formatPercentage(expectedReturn), [expectedReturn]);

  return (
    <Card $isExpanded={isExpanded} onClick={handleCardClick}>
      <AIIcon>
        <Star size={16} />
      </AIIcon>
      
      <CoinHeader>
        <CoinImage src={coin.image} alt={coin.name} />
        <CoinInfo>
          <CoinName>{coin.name}</CoinName>
          <CoinSymbol>{coin.symbol}</CoinSymbol>
          <CoinPrice>{formattedPrice}</CoinPrice>
        </CoinInfo>
      </CoinHeader>
      
      <RecommendationInfo>
        <ExpectedReturn positive={expectedReturn > 0}>
          <TrendingUp size={16} />
          {formattedReturn}
        </ExpectedReturn>
        <RiskLevel level={riskLevel}>
          {getRiskIcon(riskLevel)} 위험도: {riskLevel}/5
        </RiskLevel>
        <Confidence>
          <Star size={14} />
          AI 신뢰도: {confidence}%
        </Confidence>
      </RecommendationInfo>
      
      <ReasonsList>
        {mainReasons.map((reason, index) => (
          <ReasonItem key={index}>
            💡 {reason}
          </ReasonItem>
        ))}
      </ReasonsList>
      
      <Timeframe>
        <Clock size={14} />
        추천 기간: {timeframe}
      </Timeframe>

      <ActionButtons>
        <ActionButton variant="primary" onClick={handleViewDetails}>
          <Eye size={16} />
          상세보기
        </ActionButton>
        
        <WatchlistButton 
          isInWatchlist={isInWatchlist}
          onClick={handleAddToWatchlist}
        >
          <Heart size={16} fill={isInWatchlist ? 'currentColor' : 'none'} />
          {isInWatchlist ? '관심목록에서 제거' : '관심목록 추가'}
        </WatchlistButton>
        
        <ActionButton onClick={handleShare}>
          <Share2 size={16} />
          공유
        </ActionButton>
        
        {additionalReasons.length > 0 && (
          <ExpandButton onClick={handleExpand}>
            {isExpanded ? '접기' : '더보기'}
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </ExpandButton>
        )}
      </ActionButtons>

      <ExpandedContent isExpanded={isExpanded}>
        {additionalReasons.length > 0 && (
          <AdditionalReasons>
            <h4 style={{ 
              fontSize: '14px', 
              fontWeight: 600, 
              color: '#6B7280', 
              marginBottom: '0.5rem' 
            }}>
              추가 분석 내용:
            </h4>
            {additionalReasons.map((reason, index) => (
              <AdditionalReasonItem key={index}>
                <AlertTriangle size={14} />
                {reason}
              </AdditionalReasonItem>
            ))}
          </AdditionalReasons>
        )}
        
        <ActionButton variant="primary" onClick={handleViewDetails}>
          <ExternalLink size={16} />
          거래소에서 보기
        </ActionButton>
      </ExpandedContent>
    </Card>
  );
};

// React.memo로 최적화된 컴포넌트 내보내기
export default optimizedMemo(CoinRecommendationCard, {
  displayName: 'CoinRecommendationCard',
  deep: false // 얕은 비교 사용 (기본값)
});
