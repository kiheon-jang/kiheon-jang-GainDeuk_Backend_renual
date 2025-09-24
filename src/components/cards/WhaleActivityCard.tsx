import React from 'react';
import styled, { keyframes } from 'styled-components';
import { media } from '@/utils/responsive';

// 애니메이션 정의
const slideIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

const wave = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.3); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
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

const ActivityLevel = styled.div<{ $level: 'high' | 'medium' | 'low' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-weight: 600;
  font-size: 0.9rem;
  
  ${({ $level, theme }) => {
    switch ($level) {
      case 'high':
        return `
          background: ${theme.colors.danger}20;
          color: ${theme.colors.danger};
          border: 1px solid ${theme.colors.danger}40;
        `;
      case 'medium':
        return `
          background: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
          border: 1px solid ${theme.colors.warning}40;
        `;
      case 'low':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
          border: 1px solid ${theme.colors.success}40;
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

const WhaleIcon = styled.div`
  font-size: 3rem;
  text-align: center;
  margin: 1rem 0;
  animation: ${float} 3s ease-in-out infinite;
`;

const ActivityScore = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ScoreValue = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
  
  ${media.max.sm`
    font-size: 2.5rem;
  `}
`;

const ScoreLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const ScoreBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  overflow: hidden;
  margin: 0.5rem 0;
`;

const ScoreProgress = styled.div<{ $score: number; $level: 'high' | 'medium' | 'low' }>`
  height: 100%;
  width: ${({ $score }) => $score}%;
  background: ${({ $level, theme }) => {
    switch ($level) {
      case 'high': return theme.colors.danger;
      case 'medium': return theme.colors.warning;
      case 'low': return theme.colors.success;
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

const ActivityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  
  ${media.max.sm`
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  `}
`;

const ActivityItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.hover};
    transform: translateY(-1px);
  }
`;

const ActivityLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const ActivityValue = styled.div<{ $color?: string }>`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ $color, theme }) => $color || theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const ActivitySubValue = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RecentTransactions = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const TransactionsTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TransactionItem = styled.div<{ $type: 'buy' | 'sell' }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  margin-bottom: 0.5rem;
  border-left: 3px solid ${({ $type, theme }) => 
    $type === 'buy' ? theme.colors.success : theme.colors.danger};
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.hover};
  }
`;

const TransactionInfo = styled.div`
  flex: 1;
`;

const TransactionAmount = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TransactionTime = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TransactionType = styled.span<{ $type: 'buy' | 'sell' }>`
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  font-weight: 600;
  text-transform: uppercase;
  
  ${({ $type, theme }) => {
    switch ($type) {
      case 'buy':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'sell':
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

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: ${pulse} 1s ease-in-out infinite;
`;

// 타입 정의
interface WhaleTransaction {
  id: string;
  type: 'buy' | 'sell';
  amount: string;
  timestamp: string;
}

interface WhaleActivityCardProps {
  activityScore: number;
  largeTransactions: number;
  totalVolume: string;
  averageTransactionSize: string;
  recentTransactions: WhaleTransaction[];
  isLoading?: boolean;
  lastUpdated?: string;
  className?: string;
}

const WhaleActivityCard: React.FC<WhaleActivityCardProps> = ({
  activityScore,
  largeTransactions,
  totalVolume,
  averageTransactionSize,
  recentTransactions,
  isLoading = false,
  lastUpdated,
  className
}) => {
  const getActivityLevel = (score: number): 'high' | 'medium' | 'low' => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const getActivityEmoji = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return '🐋';
      case 'medium': return '🐳';
      case 'low': return '🐟';
      default: return '🐋';
    }
  };

  const getActivityText = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return '높은 활동';
      case 'medium': return '보통 활동';
      case 'low': return '낮은 활동';
      default: return '알 수 없음';
    }
  };

  const activityLevel = getActivityLevel(activityScore);

  return (
    <Card className={className}>
      <Header>
        <Title>
          <span>🐋</span>
          고래 활동 분석
        </Title>
        <ActivityLevel $level={activityLevel}>
          {getActivityEmoji(activityLevel)} {getActivityText(activityLevel)}
        </ActivityLevel>
      </Header>

      <WhaleIcon>
        {getActivityEmoji(activityLevel)}
      </WhaleIcon>

      <ActivityScore>
        <ScoreValue>
          {isLoading ? <LoadingSpinner /> : activityScore}
        </ScoreValue>
        <ScoreLabel>활동 점수 (0-100)</ScoreLabel>
        <ScoreBar>
          <ScoreProgress $score={activityScore} $level={activityLevel} />
        </ScoreBar>
      </ActivityScore>

      <ActivityGrid>
        <ActivityItem>
          <ActivityLabel>대형 거래</ActivityLabel>
          <ActivityValue $color="#f59e0b">{largeTransactions}</ActivityValue>
          <ActivitySubValue>건</ActivitySubValue>
        </ActivityItem>
        
        <ActivityItem>
          <ActivityLabel>총 거래량</ActivityLabel>
          <ActivityValue $color="#3b82f6">{totalVolume}</ActivityValue>
          <ActivitySubValue>24시간</ActivitySubValue>
        </ActivityItem>
        
        <ActivityItem>
          <ActivityLabel>평균 거래</ActivityLabel>
          <ActivityValue $color="#10b981">{averageTransactionSize}</ActivityValue>
          <ActivitySubValue>크기</ActivitySubValue>
        </ActivityItem>
      </ActivityGrid>

      {recentTransactions.length > 0 && (
        <RecentTransactions>
          <TransactionsTitle>
            <span>📊</span>
            최근 대형 거래
          </TransactionsTitle>
          {recentTransactions.slice(0, 3).map((transaction) => (
            <TransactionItem key={transaction.id} $type={transaction.type}>
              <TransactionInfo>
                <TransactionAmount>{transaction.amount}</TransactionAmount>
                <TransactionTime>
                  {new Date(transaction.timestamp).toLocaleTimeString('ko-KR')}
                </TransactionTime>
              </TransactionInfo>
              <TransactionType $type={transaction.type}>
                {transaction.type === 'buy' ? '매수' : '매도'}
              </TransactionType>
            </TransactionItem>
          ))}
        </RecentTransactions>
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

export default WhaleActivityCard;
