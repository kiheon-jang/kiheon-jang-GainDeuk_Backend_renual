import React from 'react';
import styled from 'styled-components';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketSummaryProps {
  totalMarketCap: string;
  marketTrend: 'up' | 'down' | 'sideways';
  trendDescription: string;
}

const MarketCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[100]};
`;

const MarketHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const MarketTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
`;

const MarketCap = styled.div`
  font-size: ${({ theme }) => theme.fonts.size['2XL']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: 0.5rem;
`;

const TrendIndicator = styled.div<{ trend: 'up' | 'down' | 'sideways' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  font-weight: 600;
  color: ${({ trend, theme }) => {
    switch (trend) {
      case 'up':
        return theme.colors.secondary;
      case 'down':
        return theme.colors.danger;
      case 'sideways':
        return theme.colors.warning;
      default:
        return theme.colors.gray[500];
    }
  }};
  background: ${({ trend, theme }) => {
    switch (trend) {
      case 'up':
        return `${theme.colors.secondary}15`;
      case 'down':
        return `${theme.colors.danger}15`;
      case 'sideways':
        return `${theme.colors.warning}15`;
      default:
        return theme.colors.gray[50];
    }
  }};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: fit-content;
  margin-bottom: 1rem;
`;

const TrendDescription = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.5;
  background: ${({ theme }) => theme.colors.gray[50]};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const getTrendIcon = (trend: 'up' | 'down' | 'sideways') => {
  switch (trend) {
    case 'up':
      return <TrendingUp size={20} />;
    case 'down':
      return <TrendingDown size={20} />;
    case 'sideways':
      return <Minus size={20} />;
    default:
      return null;
  }
};

const getTrendText = (trend: 'up' | 'down' | 'sideways') => {
  switch (trend) {
    case 'up':
      return '상승세';
    case 'down':
      return '하락세';
    case 'sideways':
      return '횡보';
    default:
      return '알 수 없음';
  }
};

const MarketSummary: React.FC<MarketSummaryProps> = ({
  totalMarketCap,
  marketTrend,
  trendDescription
}) => {
  return (
    <MarketCard>
      <MarketHeader>
        <MarketTitle>📈 시장 현황</MarketTitle>
      </MarketHeader>

      <MarketCap>{totalMarketCap}</MarketCap>

      <TrendIndicator trend={marketTrend}>
        {getTrendIcon(marketTrend)}
        {getTrendText(marketTrend)}
      </TrendIndicator>

      <TrendDescription>
        {trendDescription}
      </TrendDescription>
    </MarketCard>
  );
};

export default MarketSummary;
