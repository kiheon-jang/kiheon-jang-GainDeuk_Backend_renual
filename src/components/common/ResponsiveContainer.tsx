import React, { type ReactNode } from 'react';
import styled from 'styled-components';
import { responsiveContainer } from '@/utils/responsive';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: string;
  padding?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
}

const StyledContainer = styled.div<{
  $maxWidth?: string;
  $padding?: ResponsiveContainerProps['padding'];
}>`
  ${responsiveContainer}
  
  ${({ $maxWidth }) => $maxWidth && `
    max-width: ${$maxWidth};
  `}
  
  ${({ $padding }) => $padding && `
    padding: 0 ${$padding.mobile || '1rem'};
    
    @media (min-width: 576px) {
      padding: 0 ${$padding.tablet || '1.5rem'};
    }
    
    @media (min-width: 992px) {
      padding: 0 ${$padding.desktop || '2rem'};
    }
  `}
`;

/**
 * 반응형 컨테이너 컴포넌트
 * 모든 화면 크기에서 적절한 패딩과 최대 너비를 제공합니다.
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  maxWidth,
  padding,
}) => {
  return (
    <StyledContainer
      className={className}
      $maxWidth={maxWidth}
      $padding={padding}
    >
      {children}
    </StyledContainer>
  );
};
