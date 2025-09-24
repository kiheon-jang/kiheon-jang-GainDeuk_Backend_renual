import React from 'react';
import styled, { keyframes } from 'styled-components';
import { media } from '@/utils/responsive';

// 애니메이션 정의
const wave = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.2); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

// 스타일드 컴포넌트
const Card = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease-out;
  
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

const SentimentIndicator = styled.div<{ $sentiment: 'extreme_fear' | 'fear' | 'neutral' | 'greed' | 'extreme_greed' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-weight: 600;
  font-size: 0.9rem;
  
  ${({ $sentiment, theme }) => {
    switch ($sentiment) {
      case 'extreme_fear':
        return `
          background: ${theme.colors.danger}20;
          color: ${theme.colors.danger};
          border: 1px solid ${theme.colors.danger}40;
        `;
      case 'fear':
        return `
          background: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
          border: 1px solid ${theme.colors.warning}40;
        `;
      case 'neutral':
        return `
          background: ${theme.colors.text.secondary}20;
          color: ${theme.colors.text.secondary};
          border: 1px solid ${theme.colors.text.secondary}40;
        `;
      case 'greed':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
          border: 1px solid ${theme.colors.success}40;
        `;
      case 'extreme_greed':
        return `
          background: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary}40;
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

const SentimentBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  overflow: hidden;
  margin: 1rem 0;
  position: relative;
`;

const SentimentProgress = styled.div<{ $value: number; $sentiment: string }>`
  height: 100%;
  width: ${({ $value }) => $value}%;
  background: ${({ $sentiment, theme }) => {
    switch ($sentiment) {
      case 'extreme_fear': return theme.colors.danger;
      case 'fear': return theme.colors.warning;
      case 'neutral': return theme.colors.text.secondary;
      case 'greed': return theme.colors.success;
      case 'extreme_greed': return theme.colors.primary;
      default: return theme.colors.text.secondary;
    }
  }};
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
    animation: ${wave} 2s ease-in-out infinite;
  }
`;

const SentimentValue = styled.div`
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0.5rem 0;
`;

const SentimentLabel = styled.div`
  text-align: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
  
  ${media.max.sm`
    grid-template-columns: 1fr;
    gap: 0.75rem;
  `}
`;

const DataItem = styled.div`
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

const DataLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const DataValue = styled.div<{ $color?: string }>`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ $color, theme }) => $color || theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const DataSubValue = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const NewsSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const NewsTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NewsItem = styled.div<{ $sentiment: 'positive' | 'negative' | 'neutral' }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  margin-bottom: 0.5rem;
  border-left: 3px solid ${({ $sentiment, theme }) => {
    switch ($sentiment) {
      case 'positive': return theme.colors.success;
      case 'negative': return theme.colors.danger;
      default: return theme.colors.text.secondary;
    }
  }};
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.hover};
  }
`;

const NewsText = styled.div`
  flex: 1;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.4;
`;

const NewsSentiment = styled.span<{ $sentiment: 'positive' | 'negative' | 'neutral' }>`
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  font-weight: 600;
  
  ${({ $sentiment, theme }) => {
    switch ($sentiment) {
      case 'positive':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'negative':
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

// 타입 정의
interface NewsItem {
  id: string;
  title: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  source: string;
  publishedAt: string;
}

interface MarketSentimentCardProps {
  fearGreedIndex: number;
  sentiment: 'extreme_fear' | 'fear' | 'neutral' | 'greed' | 'extreme_greed';
  btcDominance: number;
  marketPhase: string;
  newsItems: NewsItem[];
  lastUpdated?: string;
  className?: string;
}

const MarketSentimentCard: React.FC<MarketSentimentCardProps> = ({
  fearGreedIndex,
  sentiment,
  btcDominance,
  marketPhase,
  newsItems,
  lastUpdated,
  className
}) => {
  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'extreme_fear': return '😱';
      case 'fear': return '😰';
      case 'neutral': return '😐';
      case 'greed': return '😊';
      case 'extreme_greed': return '🚀';
      default: return '📊';
    }
  };

  const getSentimentText = (sentiment: string) => {
    switch (sentiment) {
      case 'extreme_fear': return '극도의 공포';
      case 'fear': return '공포';
      case 'neutral': return '중립';
      case 'greed': return '탐욕';
      case 'extreme_greed': return '극도의 탐욕';
      default: return '알 수 없음';
    }
  };

  return (
    <Card className={className}>
      <Header>
        <Title>
          <span>📊</span>
          시장 심리 분석
        </Title>
        <SentimentIndicator $sentiment={sentiment}>
          {getSentimentEmoji(sentiment)} {getSentimentText(sentiment)}
        </SentimentIndicator>
      </Header>

      <SentimentValue>{fearGreedIndex}</SentimentValue>
      <SentimentLabel>공포탐욕지수</SentimentLabel>
      
      <SentimentBar>
        <SentimentProgress $value={fearGreedIndex} $sentiment={sentiment} />
      </SentimentBar>

      <DataGrid>
        <DataItem>
          <DataLabel>BTC 지배율</DataLabel>
          <DataValue $color="#f7931a">{btcDominance.toFixed(1)}%</DataValue>
          <DataSubValue>시장 지배율</DataSubValue>
        </DataItem>
        
        <DataItem>
          <DataLabel>시장 단계</DataLabel>
          <DataValue>{marketPhase}</DataValue>
          <DataSubValue>현재 페이즈</DataSubValue>
        </DataItem>
      </DataGrid>

      {newsItems.length > 0 && (
        <NewsSection>
          <NewsTitle>
            <span>📰</span>
            최신 뉴스 감정분석
          </NewsTitle>
          {newsItems.slice(0, 3).map((news) => (
            <NewsItem key={news.id} $sentiment={news.sentiment}>
              <NewsText>{news.title}</NewsText>
              <NewsSentiment $sentiment={news.sentiment}>
                {news.sentiment === 'positive' ? '긍정' : 
                 news.sentiment === 'negative' ? '부정' : '중립'}
              </NewsSentiment>
            </NewsItem>
          ))}
        </NewsSection>
      )}

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

export default MarketSentimentCard;
