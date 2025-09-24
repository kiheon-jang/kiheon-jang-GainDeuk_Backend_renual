import React from 'react';
import styled, { keyframes } from 'styled-components';
import { media } from '@/utils/responsive';

// 애니메이션 정의
const slideIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0); 
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// 스타일드 컴포넌트
const Card = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  animation: ${slideIn} 0.8s ease-out;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  ${media.max.sm`
    padding: 1rem;
  `}
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusIndicator = styled.div<{ $status: 'bullish' | 'bearish' | 'neutral' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-weight: 600;
  font-size: 0.9rem;
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'bullish':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
          border: 1px solid ${theme.colors.success}40;
        `;
      case 'bearish':
        return `
          background: ${theme.colors.danger}20;
          color: ${theme.colors.danger};
          border: 1px solid ${theme.colors.danger}40;
        `;
      default:
        return `
          background: ${theme.colors.text.secondary}20;
          color: ${theme.colors.text.secondary};
          border: 1px solid ${theme.colors.text.secondary}40;
        `;
    }
  }}
`;

const PriceSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const CurrentPrice = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
  
  ${media.max.sm`
    font-size: 2rem;
  `}
`;

const PriceChange = styled.div<{ $isPositive: boolean }>`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ $isPositive, theme }) => 
    $isPositive ? theme.colors.success : theme.colors.danger};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const PriceChangeIcon = styled.span<{ $isPositive: boolean }>`
  font-size: 1.2rem;
  transform: ${({ $isPositive }) => $isPositive ? 'rotate(0deg)' : 'rotate(180deg)'};
  transition: transform 0.3s ease;
`;

const TimeframeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  
  ${media.max.sm`
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  `}
`;

const TimeframeItem = styled.div<{ $isActive?: boolean }>`
  text-align: center;
  padding: 1rem;
  background: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.primary + '20' : theme.colors.background.primary};
  border: 1px solid ${({ $isActive, theme }) => 
    $isActive ? theme.colors.primary + '40' : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.hover};
    transform: translateY(-1px);
  }
`;

const TimeframeLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const TimeframeValue = styled.div<{ $isPositive?: boolean }>`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ $isPositive, theme }) => {
    if ($isPositive === true) return theme.colors.success;
    if ($isPositive === false) return theme.colors.danger;
    return theme.colors.text.primary;
  }};
`;

const TechnicalIndicators = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  ${media.max.sm`
    grid-template-columns: 1fr;
    gap: 0.75rem;
  `}
`;

const IndicatorItem = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.hover};
    transform: translateY(-1px);
  }
`;

const IndicatorLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const IndicatorValue = styled.div<{ $color?: string }>`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ $color, theme }) => $color || theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const IndicatorStatus = styled.div<{ $status: 'strong' | 'moderate' | 'weak' }>`
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  font-weight: 600;
  text-transform: uppercase;
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'strong':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'moderate':
        return `
          background: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `;
      case 'weak':
        return `
          background: ${theme.colors.danger}20;
          color: ${theme.colors.danger};
        `;
      default:
        return `
          background: ${theme.colors.text.secondary}20;
          color: ${theme.colors.text.secondary};
        `;
    }
  }}
`;

const VolumeSection = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 1rem;
`;

const VolumeBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  overflow: hidden;
  margin: 0.5rem 0;
`;

const VolumeProgress = styled.div<{ $percentage: number; $isHigh: boolean }>`
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  background: ${({ $isHigh, theme }) => 
    $isHigh ? theme.colors.success : theme.colors.warning};
  transition: all 0.5s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: ${rotate} 1s ease-in-out infinite;
`;

// 타입 정의
interface PriceData {
  current: number;
  change1h: number;
  change24h: number;
  change7d: number;
  change30d: number;
}

interface TechnicalIndicator {
  name: string;
  value: string | number;
  status: 'strong' | 'moderate' | 'weak';
  color?: string;
}

interface TechnicalAnalysisCardProps {
  symbol: string;
  name: string;
  priceData: PriceData;
  volumeRatio: number;
  volatility: number;
  technicalIndicators: TechnicalIndicator[];
  isLoading?: boolean;
  lastUpdated?: string;
  className?: string;
}

const TechnicalAnalysisCard: React.FC<TechnicalAnalysisCardProps> = ({
  symbol,
  name,
  priceData,
  volumeRatio,
  volatility,
  technicalIndicators,
  isLoading = false,
  lastUpdated,
  className
}) => {
  const getOverallTrend = () => {
    const changes = [priceData.change1h, priceData.change24h, priceData.change7d];
    const positiveChanges = changes.filter(change => change > 0).length;
    
    if (positiveChanges >= 2) return 'bullish';
    if (positiveChanges <= 1) return 'bearish';
    return 'neutral';
  };

  const getVolumeStatus = () => {
    if (volumeRatio >= 2) return 'high';
    if (volumeRatio >= 1) return 'normal';
    return 'low';
  };

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(6)}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const overallTrend = getOverallTrend();
  const volumeStatus = getVolumeStatus();

  return (
    <Card className={className}>
      <Header>
        <Title>
          <span>📈</span>
          기술적 분석 - {symbol}
        </Title>
        <StatusIndicator $status={overallTrend}>
          {overallTrend === 'bullish' ? '📈 상승' : 
           overallTrend === 'bearish' ? '📉 하락' : '➡️ 중립'}
        </StatusIndicator>
      </Header>

      <PriceSection>
        <CurrentPrice>
          {isLoading ? <LoadingSpinner /> : formatPrice(priceData.current)}
        </CurrentPrice>
        <PriceChange $isPositive={priceData.change24h >= 0}>
          <PriceChangeIcon $isPositive={priceData.change24h >= 0}>
            {priceData.change24h >= 0 ? '↗️' : '↘️'}
          </PriceChangeIcon>
          {formatPercentage(priceData.change24h)} (24h)
        </PriceChange>
      </PriceSection>

      <TimeframeGrid>
        <TimeframeItem>
          <TimeframeLabel>1시간</TimeframeLabel>
          <TimeframeValue $isPositive={priceData.change1h >= 0}>
            {formatPercentage(priceData.change1h)}
          </TimeframeValue>
        </TimeframeItem>
        
        <TimeframeItem>
          <TimeframeLabel>24시간</TimeframeLabel>
          <TimeframeValue $isPositive={priceData.change24h >= 0}>
            {formatPercentage(priceData.change24h)}
          </TimeframeValue>
        </TimeframeItem>
        
        <TimeframeItem>
          <TimeframeLabel>7일</TimeframeLabel>
          <TimeframeValue $isPositive={priceData.change7d >= 0}>
            {formatPercentage(priceData.change7d)}
          </TimeframeValue>
        </TimeframeItem>
        
        <TimeframeItem>
          <TimeframeLabel>30일</TimeframeLabel>
          <TimeframeValue $isPositive={priceData.change30d >= 0}>
            {formatPercentage(priceData.change30d)}
          </TimeframeValue>
        </TimeframeItem>
      </TimeframeGrid>

      <VolumeSection>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>거래량 비율</span>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: volumeStatus === 'high' ? '#10b981' : '#f59e0b' }}>
            {volumeRatio.toFixed(2)}x
          </span>
        </div>
        <VolumeBar>
          <VolumeProgress 
            $percentage={Math.min(volumeRatio * 25, 100)} 
            $isHigh={volumeStatus === 'high'} 
          />
        </VolumeBar>
        <div style={{ fontSize: '0.7rem', color: '#6b7280', textAlign: 'center', marginTop: '0.5rem' }}>
          {volumeStatus === 'high' ? '높은 거래량' : 
           volumeStatus === 'normal' ? '정상 거래량' : '낮은 거래량'}
        </div>
      </VolumeSection>

      <TechnicalIndicators>
        {technicalIndicators.map((indicator, index) => (
          <IndicatorItem key={index}>
            <IndicatorLabel>{indicator.name}</IndicatorLabel>
            <IndicatorValue $color={indicator.color}>
              {indicator.value}
            </IndicatorValue>
            <IndicatorStatus $status={indicator.status}>
              {indicator.status === 'strong' ? '강함' :
               indicator.status === 'moderate' ? '보통' : '약함'}
            </IndicatorStatus>
          </IndicatorItem>
        ))}
      </TechnicalIndicators>

      {lastUpdated && (
        <div style={{ 
          fontSize: '0.7rem', 
          color: '#666', 
          textAlign: 'center', 
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          마지막 업데이트: {new Date(lastUpdated).toLocaleTimeString('ko-KR')}
        </div>
      )}
    </Card>
  );
};

export default TechnicalAnalysisCard;
