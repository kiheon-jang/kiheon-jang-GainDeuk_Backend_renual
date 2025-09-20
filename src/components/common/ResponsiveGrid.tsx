import React, { type ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { responsiveGrid, media } from '@/utils/responsive';

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    largeDesktop?: number;
  };
  gap?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
}

const StyledGrid = styled.div<{
  $columns?: ResponsiveGridProps['columns'];
  $gap?: ResponsiveGridProps['gap'];
  $alignItems?: ResponsiveGridProps['alignItems'];
  $justifyContent?: ResponsiveGridProps['justifyContent'];
}>`
  ${responsiveGrid}
  
  ${({ $columns }) => $columns && css`
    grid-template-columns: repeat(${$columns.mobile || 1}, 1fr);
    
    ${media.min.sm`
      grid-template-columns: repeat(${$columns.tablet || 2}, 1fr);
    `}
    
    ${media.min.lg`
      grid-template-columns: repeat(${$columns.desktop || 3}, 1fr);
    `}
    
    ${media.min['2xl']`
      grid-template-columns: repeat(${$columns.largeDesktop || 4}, 1fr);
    `}
  `}
  
  ${({ $gap }) => $gap && css`
    gap: ${$gap.mobile || '1rem'};
    
    ${media.min.sm`
      gap: ${$gap.tablet || '1.5rem'};
    `}
    
    ${media.min.lg`
      gap: ${$gap.desktop || '2rem'};
    `}
  `}
  
  ${({ $alignItems }) => $alignItems && `align-items: ${$alignItems};`}
  ${({ $justifyContent }) => $justifyContent && `justify-content: ${$justifyContent};`}
`;

/**
 * 반응형 그리드 컴포넌트
 * 화면 크기에 따라 자동으로 열 개수가 조정되는 그리드 레이아웃을 제공합니다.
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  columns,
  gap,
  alignItems,
  justifyContent,
}) => {
  return (
    <StyledGrid
      className={className}
      $columns={columns}
      $gap={gap}
      $alignItems={alignItems}
      $justifyContent={justifyContent}
    >
      {children}
    </StyledGrid>
  );
};
