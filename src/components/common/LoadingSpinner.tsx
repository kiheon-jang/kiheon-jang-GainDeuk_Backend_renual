import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: ${({ size }) => {
    switch (size) {
      case 'sm': return '2rem';
      case 'lg': return '8rem';
      default: return '4rem';
    }
  }};
`;

const Spinner = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  width: ${({ size }) => {
    switch (size) {
      case 'sm': return '1rem';
      case 'lg': return '3rem';
      default: return '2rem';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'sm': return '1rem';
      case 'lg': return '3rem';
      default: return '2rem';
    }
  }};
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
  border-top: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fonts.size.SM};
`;

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = '로딩 중...', 
  fullScreen = false 
}) => {
  const content = (
    <SpinnerContainer size={size}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Spinner size={size} />
        {text && <LoadingText>{text}</LoadingText>}
      </div>
    </SpinnerContainer>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
