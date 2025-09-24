import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { media } from '@/utils/responsive';

// 애니메이션 정의
const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
`;

const slideIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
`;

// 스타일드 컴포넌트
const Card = styled.div<{ $isLive?: boolean }>`
  background: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: ${slideIn} 0.6s ease-out;
  
  ${({ $isLive }) => $isLive && css`
    animation: ${glow} 2s ease-in-out infinite;
  `}
  
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
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LiveIndicator = styled.div<{ $isLive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: ${({ $isLive, theme }) => 
    $isLive ? theme.colors.success : theme.colors.text.secondary};
  
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $isLive, theme }) => 
      $isLive ? theme.colors.success : theme.colors.text.secondary};
    animation: ${({ $isLive }) => $isLive ? pulse : 'none'} 2s ease-in-out infinite;
  }
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  
  ${media.max.sm`
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  `}
`;

const DataItem = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.hover};
  }
`;

const DataLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.25rem;
  font-weight: 500;
`;

const DataValue = styled.div<{ $color?: string; $isPositive?: boolean }>`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ $color, $isPositive, theme }) => {
    if ($color) return $color;
    if ($isPositive === true) return theme.colors.success;
    if ($isPositive === false) return theme.colors.danger;
    return theme.colors.text.primary;
  }};
  
  ${media.max.sm`
    font-size: 1rem;
  `}
`;

const DataSubValue = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 0.25rem;
`;

const StatusBadge = styled.span<{ $status: 'good' | 'warning' | 'danger' }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'good':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'warning':
        return `
          background: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `;
      case 'danger':
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

const LastUpdated = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

// 타입 정의
interface SignalDataItem {
  label: string;
  value: string | number;
  subValue?: string;
  color?: string;
  isPositive?: boolean;
  status?: 'good' | 'warning' | 'danger';
}

interface SignalDataCardProps {
  title: string;
  icon: string;
  data: SignalDataItem[];
  isLive?: boolean;
  lastUpdated?: string;
  className?: string;
}

const SignalDataCard: React.FC<SignalDataCardProps> = ({
  title,
  icon,
  data,
  isLive = false,
  lastUpdated,
  className
}) => {
  return (
    <Card $isLive={isLive} className={className}>
      <Header>
        <Title>
          <span>{icon}</span>
          {title}
        </Title>
        <LiveIndicator $isLive={isLive}>
          {isLive ? 'LIVE' : 'OFFLINE'}
        </LiveIndicator>
      </Header>
      
      <DataGrid>
        {data.map((item, index) => (
          <DataItem key={index}>
            <DataLabel>{item.label}</DataLabel>
            <DataValue 
              $color={item.color} 
              $isPositive={item.isPositive}
            >
              {item.value}
            </DataValue>
            {item.subValue && (
              <DataSubValue>{item.subValue}</DataSubValue>
            )}
            {item.status && (
              <StatusBadge $status={item.status}>
                {item.status}
              </StatusBadge>
            )}
          </DataItem>
        ))}
      </DataGrid>
      
      {lastUpdated && (
        <LastUpdated>
          마지막 업데이트: {new Date(lastUpdated).toLocaleTimeString('ko-KR')}
        </LastUpdated>
      )}
    </Card>
  );
};

export default SignalDataCard;
