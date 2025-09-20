import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Wifi, WifiOff } from 'lucide-react';

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const IndicatorContainer = styled.div<{ isConnected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ isConnected, theme }) => isConnected ? `${theme.colors.secondary}15` : `${theme.colors.danger}15`};
  border: 1px solid ${({ isConnected, theme }) => isConnected ? `${theme.colors.secondary}40` : `${theme.colors.danger}40`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fonts.size.SM};
  font-weight: 500;
  color: ${({ isConnected, theme }) => isConnected ? theme.colors.secondary : theme.colors.danger};
`;

const StatusIcon = styled.div<{ isConnected: boolean }>`
  display: flex;
  align-items: center;
  animation: ${({ isConnected }) => isConnected ? pulse : 'none'} 2s infinite;
`;

const StatusText = styled.span`
  font-size: ${({ theme }) => theme.fonts.size.SM};
`;

interface RealTimeIndicatorProps {
  isConnected: boolean;
  lastUpdate?: string;
}

const RealTimeIndicator: React.FC<RealTimeIndicatorProps> = ({
  isConnected,
  lastUpdate
}) => {
  return (
    <IndicatorContainer isConnected={isConnected}>
      <StatusIcon isConnected={isConnected}>
        {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
      </StatusIcon>
      <StatusText>
        {isConnected ? '실시간 연결됨' : '연결 끊김'}
        {lastUpdate && isConnected && (
          <span style={{ marginLeft: '0.5rem', opacity: 0.7 }}>
            • {lastUpdate}
          </span>
        )}
      </StatusText>
    </IndicatorContainer>
  );
};

export default RealTimeIndicator;
