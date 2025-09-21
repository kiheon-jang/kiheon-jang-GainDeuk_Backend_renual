import React from 'react';
import styled from 'styled-components';
import { X, TrendingUp, TrendingDown, BarChart3, Globe, ExternalLink } from 'lucide-react';
import type { Coin } from '@/types';
import { formatPrice, formatPercentage } from '@/utils';

interface CoinDetailModalProps {
  coin: Coin | null;
  isOpen: boolean;
  onClose: () => void;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  box-shadow: ${({ theme }) => theme.shadows.XL};
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const CoinHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
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
`;

const CoinInfo = styled.div``;

const CoinName = styled.h2`
  font-size: ${({ theme }) => theme.fonts.size.XL};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.25rem 0;
`;

const CoinSymbol = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  transition: ${({ theme }) => theme.transitions.FAST};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const PriceSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.LG};
`;

const CurrentPrice = styled.div`
  font-size: ${({ theme }) => theme.fonts.size['3XL']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const ChangeContainer = styled.div<{ $isPositive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${({ theme, $isPositive }) => 
    $isPositive ? theme.colors.success : theme.colors.danger};
  font-size: ${({ theme }) => theme.fonts.size.LG};
  font-weight: 600;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  font-weight: 600;
  transition: ${({ theme }) => theme.transitions.FAST};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}dd;
    border-color: ${({ theme }) => theme.colors.primary}dd;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const SecondaryButton = styled(ActionButton)`
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    background: ${({ theme }) => theme.colors.primary}15;
  }
`;

const CoinDetailModal: React.FC<CoinDetailModalProps> = ({ coin, isOpen, onClose }) => {
  if (!coin) return null;

  const isPositive = coin.change24h >= 0;
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent>
        <ModalHeader>
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
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <PriceSection>
            <CurrentPrice>{formatPrice(coin.currentPrice)}</CurrentPrice>
            <ChangeContainer $isPositive={isPositive}>
              <ChangeIcon size={20} />
              {formatPercentage(coin.change24h)}
            </ChangeContainer>
          </PriceSection>

          <StatsGrid>
            {coin.marketCap && (
              <StatCard>
                <StatLabel>시가총액</StatLabel>
                <StatValue>{formatPrice(coin.marketCap)}</StatValue>
              </StatCard>
            )}
            
            {coin.volume && (
              <StatCard>
                <StatLabel>24시간 거래량</StatLabel>
                <StatValue>{formatPrice(coin.volume)}</StatValue>
              </StatCard>
            )}
            
            <StatCard>
              <StatLabel>24시간 변동률</StatLabel>
              <StatValue style={{ 
                color: isPositive ? '#10B981' : '#EF4444' 
              }}>
                {formatPercentage(coin.change24h)}
              </StatValue>
            </StatCard>
            
            <StatCard>
              <StatLabel>현재 가격</StatLabel>
              <StatValue>{formatPrice(coin.currentPrice)}</StatValue>
            </StatCard>
          </StatsGrid>

          <ActionButtons>
            <ActionButton>
              <BarChart3 size={20} />
              차트 보기
            </ActionButton>
            <SecondaryButton>
              <Globe size={20} />
              공식 사이트
            </SecondaryButton>
            <SecondaryButton>
              <ExternalLink size={20} />
              거래소에서 보기
            </SecondaryButton>
          </ActionButtons>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CoinDetailModal;
