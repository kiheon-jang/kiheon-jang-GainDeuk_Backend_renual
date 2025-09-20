import React from 'react';
import styled from 'styled-components';
import type { CoinRecommendation } from '@/types';
import { getRiskColor, getRiskIcon, formatPrice, formatPercentage } from '@/utils';

interface CoinRecommendationCardProps {
  recommendation: CoinRecommendation;
  onClick?: () => void;
}

const Card = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: 1.5rem;
  transition: ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.gray[100]};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

const CoinHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CoinImage = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
`;

const CoinInfo = styled.div`
  flex: 1;
`;

const CoinName = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 0.25rem 0;
`;

const CoinSymbol = styled.span`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-weight: 500;
`;

const CoinPrice = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
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
  border-radius: ${({ theme }) => theme.borderRadius.md};
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
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const Confidence = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.gray[500]};
  background: ${({ theme }) => theme.colors.gray[50]};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
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
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: fit-content;
`;

const CoinRecommendationCard: React.FC<CoinRecommendationCardProps> = ({ 
  recommendation, 
  onClick 
}) => {
  const { coin, expectedReturn, riskLevel, reasons, confidence, timeframe } = recommendation;

  return (
    <Card onClick={onClick}>
      <CoinHeader>
        <CoinImage src={coin.image} alt={coin.name} />
        <CoinInfo>
          <CoinName>{coin.name}</CoinName>
          <CoinSymbol>{coin.symbol}</CoinSymbol>
          <CoinPrice>{formatPrice(coin.currentPrice)}</CoinPrice>
        </CoinInfo>
      </CoinHeader>
      
      <RecommendationInfo>
        <ExpectedReturn positive={expectedReturn > 0}>
          {formatPercentage(expectedReturn)}
        </ExpectedReturn>
        <RiskLevel level={riskLevel}>
          {getRiskIcon(riskLevel)} 위험도: {riskLevel}/5
        </RiskLevel>
        <Confidence>
          AI 신뢰도: {confidence}%
        </Confidence>
      </RecommendationInfo>
      
      <ReasonsList>
        {reasons.slice(0, 3).map((reason, index) => (
          <ReasonItem key={index}>
            💡 {reason}
          </ReasonItem>
        ))}
      </ReasonsList>
      
      <Timeframe>
        ⏰ 추천 기간: {timeframe}
      </Timeframe>
    </Card>
  );
};

export default CoinRecommendationCard;
