import React from 'react';
import styled from 'styled-components';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import type { Coin } from '@/types';
import { formatPrice, formatPercentage } from '@/utils';

interface CoinCardProps {
  coin: Coin;
  isRecommended?: boolean;
  onClick?: () => void;
}

const Card = styled.div<{ isRecommended?: boolean }>`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.MD};
  border: 2px solid ${({ theme, isRecommended }) => 
    isRecommended ? theme.colors.primary : theme.colors.border.primary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.FAST};
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.LG};
    border-color: ${({ theme, isRecommended }) => 
      isRecommended ? theme.colors.primary : theme.colors.border.secondary};
  }
`;

const RecommendedBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  font-size: ${({ theme }) => theme.fonts.size.XS};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const CoinHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CoinIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fonts.size.XL};
  font-weight: bold;
  background: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[700]};
  flex-shrink: 0;
`;

const CoinInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const CoinName = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CoinSymbol = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0;
  font-weight: 500;
`;

const PriceSection = styled.div`
  margin-bottom: 1rem;
`;

const CurrentPrice = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.XL};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const ChangeContainer = styled.div<{ isPositive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme, isPositive }) => 
    isPositive ? theme.colors.success : theme.colors.danger};
`;

const ChangeIcon = styled.div<{ isPositive: boolean }>`
  display: flex;
  align-items: center;
`;

const ChangeText = styled.span`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  font-weight: 600;
`;

const MarketInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const MarketCap = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Volume = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const CoinCard: React.FC<CoinCardProps> = ({ coin, isRecommended = false, onClick }) => {
  const isPositive = coin.change24h >= 0;
  const ChangeIconComponent = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card isRecommended={isRecommended} onClick={onClick}>
      {isRecommended && (
        <RecommendedBadge>
          <Star size={12} />
          AI 추천
        </RecommendedBadge>
      )}
      
      <CoinHeader>
        <CoinIcon>
          {coin.image ? (
            <img 
              src={coin.image} 
              alt={coin.name}
              style={{ width: '100%', height: '100%', borderRadius: '50%' }}
            />
          ) : (
            coin.symbol.charAt(0).toUpperCase()
          )}
        </CoinIcon>
        <CoinInfo>
          <CoinName>{coin.name}</CoinName>
          <CoinSymbol>{coin.symbol.toUpperCase()}</CoinSymbol>
        </CoinInfo>
      </CoinHeader>

      <PriceSection>
        <CurrentPrice>{formatPrice(coin.currentPrice)}</CurrentPrice>
        <ChangeContainer isPositive={isPositive}>
          <ChangeIcon isPositive={isPositive}>
            <ChangeIconComponent size={16} />
          </ChangeIcon>
          <ChangeText>{formatPercentage(coin.change24h)}</ChangeText>
        </ChangeContainer>
      </PriceSection>

      <MarketInfo>
        {coin.marketCap && (
          <MarketCap>
            시가총액: {formatPrice(coin.marketCap)}
          </MarketCap>
        )}
        {coin.volume && (
          <Volume>
            거래량: {formatPrice(coin.volume)}
          </Volume>
        )}
      </MarketInfo>
    </Card>
  );
};

export default CoinCard;
