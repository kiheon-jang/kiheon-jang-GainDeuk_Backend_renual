import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Wifi, WifiOff, RefreshCw, Clock } from 'lucide-react';

interface RealTimeIndicatorProps {
  isOnline: boolean;
  isRefreshing: boolean;
  lastUpdateTime?: Date;
  connectionType?: string;
  onRefresh?: () => void;
}

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const IndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  font-size: ${({ theme }) => theme.fonts.size.SM};
`;

const StatusIcon = styled.div<{ isOnline: boolean; isRefreshing: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.FULL};
  background: ${({ isOnline, theme }) => 
    isOnline ? theme.colors.success : theme.colors.danger};
  color: white;
  animation: ${({ isRefreshing }) => isRefreshing ? spin : 'none'} 1s linear infinite;
  
  ${({ isOnline, isRefreshing }) => 
    isOnline && !isRefreshing && `
      animation: ${pulse} 2s ease-in-out infinite;
    `
  }
`;

const StatusText = styled.span<{ isOnline: boolean }>`
  color: ${({ isOnline, theme }) => 
    isOnline ? theme.colors.text.primary : theme.colors.danger};
  font-weight: 500;
`;

const ConnectionInfo = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fonts.size.XS};
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: ${({ theme }) => theme.colors.primary}15;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  font-size: ${({ theme }) => theme.fonts.size.XS};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.FAST};

  &:hover {
    background: ${({ theme }) => theme.colors.primary}25;
    border-color: ${({ theme }) => theme.colors.primary}60;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TimeDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.fonts.size.XS};
`;

const RealTimeIndicator: React.FC<RealTimeIndicatorProps> = ({
  isOnline,
  isRefreshing,
  lastUpdateTime,
  connectionType,
  onRefresh,
}) => {
  const formatLastUpdate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) { // 1분 미만
      return '방금 전';
    } else if (diff < 3600000) { // 1시간 미만
      return `${Math.floor(diff / 60000)}분 전`;
    } else if (diff < 86400000) { // 1일 미만
      return `${Math.floor(diff / 3600000)}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getConnectionTypeText = (type: string): string => {
    switch (type) {
      case 'slow-2g':
        return '느린 연결';
      case '2g':
        return '2G';
      case '3g':
        return '3G';
      case '4g':
        return '4G';
      case '5g':
        return '5G';
      default:
        return '연결됨';
    }
  };

  return (
    <IndicatorContainer>
      <StatusIcon isOnline={isOnline} isRefreshing={isRefreshing}>
        {isRefreshing ? (
          <RefreshCw size={12} />
        ) : isOnline ? (
          <Wifi size={12} />
        ) : (
          <WifiOff size={12} />
        )}
      </StatusIcon>
      
      <StatusText isOnline={isOnline}>
        {isRefreshing ? '업데이트 중...' : isOnline ? '실시간 연결됨' : '오프라인'}
      </StatusText>
      
      {isOnline && connectionType && connectionType !== 'unknown' && (
        <ConnectionInfo>
          ({getConnectionTypeText(connectionType)})
        </ConnectionInfo>
      )}
      
      {lastUpdateTime && (
        <TimeDisplay>
          <Clock size={12} />
          {formatLastUpdate(lastUpdateTime)}
        </TimeDisplay>
      )}
      
      {onRefresh && (
        <RefreshButton 
          onClick={onRefresh} 
          disabled={isRefreshing || !isOnline}
          title="데이터 새로고침"
        >
          <RefreshCw size={12} />
          새로고침
        </RefreshButton>
      )}
    </IndicatorContainer>
  );
};

export default RealTimeIndicator;