import React, { type ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { responsiveFlex, media } from '@/utils/responsive';

interface ResponsiveFlexProps {
  children: ReactNode;
  className?: string;
  direction?: {
    mobile?: 'row' | 'column';
    tablet?: 'row' | 'column';
    desktop?: 'row' | 'column';
  };
  gap?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  wrap?: boolean;
}

const StyledFlex = styled.div<{
  $direction?: ResponsiveFlexProps['direction'];
  $gap?: ResponsiveFlexProps['gap'];
  $alignItems?: ResponsiveFlexProps['alignItems'];
  $justifyContent?: ResponsiveFlexProps['justifyContent'];
  $wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction?.mobile || 'column'};
  gap: ${({ $gap }) => $gap?.mobile || '1rem'};
  ${({ $wrap }) => $wrap && 'flex-wrap: wrap;'}
  
  ${({ $direction, $gap }) => css`
    ${media.min.sm`
      flex-direction: ${$direction?.tablet || $direction?.mobile || 'column'};
      gap: ${$gap?.tablet || $gap?.mobile || '1.5rem'};
    `}
    
    ${media.min.lg`
      flex-direction: ${$direction?.desktop || $direction?.tablet || $direction?.mobile || 'row'};
      gap: ${$gap?.desktop || $gap?.tablet || $gap?.mobile || '2rem'};
    `}
  `}
  
  ${({ $alignItems }) => $alignItems && `align-items: ${$alignItems};`}
  ${({ $justifyContent }) => $justifyContent && `justify-content: ${$justifyContent};`}
`;

/**
 * 반응형 플렉스 컴포넌트
 * 화면 크기에 따라 방향과 간격이 자동으로 조정되는 플렉스 레이아웃을 제공합니다.
 */
export const ResponsiveFlex: React.FC<ResponsiveFlexProps> = ({
  children,
  className,
  direction,
  gap,
  alignItems,
  justifyContent,
  wrap = false,
}) => {
  return (
    <StyledFlex
      className={className}
      $direction={direction}
      $gap={gap}
      $alignItems={alignItems}
      $justifyContent={justifyContent}
      $wrap={wrap}
    >
      {children}
    </StyledFlex>
  );
};
