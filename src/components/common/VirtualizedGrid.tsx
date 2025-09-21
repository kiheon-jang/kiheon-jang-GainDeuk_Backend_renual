/**
 * 가상화된 그리드 컴포넌트
 * 대용량 데이터를 그리드 형태로 효율적으로 렌더링
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { usePerformanceMetrics } from '@/utils/reactOptimization';

interface VirtualizedGridProps<T> {
  items: T[];
  itemWidth: number;
  itemHeight: number;
  containerWidth: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  overscan?: number; // 화면 밖에 미리 렌더링할 아이템 수
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
  className?: string;
}

interface VirtualizedGridItem {
  index: number;
  row: number;
  col: number;
  top: number;
  left: number;
  width: number;
  height: number;
}

const VirtualizedGridContainer = styled.div<{ 
  width: number; 
  height: number; 
}>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  overflow: auto;
  position: relative;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const VirtualizedGridContent = styled.div<{ 
  width: number; 
  height: number; 
}>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  position: relative;
`;

const VirtualizedGridItem = styled.div<{ 
  top: number; 
  left: number; 
  width: number; 
  height: number; 
}>`
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  padding: 0.5rem;
  box-sizing: border-box;
`;

const Scrollbar = styled.div<{ 
  position: 'horizontal' | 'vertical';
  size: number;
}>`
  position: absolute;
  background: ${({ theme }) => theme.colors.gray[200]};
  border-radius: 4px;
  opacity: 0;
  transition: opacity ${({ theme }) => theme.transitions.FAST};
  
  ${({ position, size }) => {
    if (position === 'horizontal') {
      return `
        bottom: 0;
        left: 0;
        right: 0;
        height: ${size}px;
      `;
    } else {
      return `
        right: 0;
        top: 0;
        bottom: 0;
        width: ${size}px;
      `;
    }
  }}
  
  ${VirtualizedGridContainer}:hover & {
    opacity: 1;
  }
`;

const ScrollThumb = styled.div<{ 
  top?: number; 
  left?: number; 
  width?: number; 
  height?: number; 
  isDragging: boolean;
}>`
  position: absolute;
  background: ${({ theme, isDragging }) => 
    isDragging ? theme.colors.primary : theme.colors.gray[400]};
  border-radius: 4px;
  cursor: ${({ isDragging }) => isDragging ? 'grabbing' : 'grab'};
  transition: background ${({ theme }) => theme.transitions.FAST};
  
  ${({ top }) => top !== undefined && `top: ${top}px;`}
  ${({ left }) => left !== undefined && `left: ${left}px;`}
  ${({ width }) => width !== undefined && `width: ${width}px;`}
  ${({ height }) => height !== undefined && `height: ${height}px;`}
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
  }
`;

function VirtualizedGrid<T>({
  items,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  renderItem,
  keyExtractor,
  overscan = 5,
  onScroll,
  className
}: VirtualizedGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState<'horizontal' | 'vertical' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, scrollTop: 0, scrollLeft: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalThumbRef = useRef<HTMLDivElement>(null);
  const verticalThumbRef = useRef<HTMLDivElement>(null);
  
  // 성능 메트릭 수집
  const metrics = usePerformanceMetrics('VirtualizedGrid');

  // 그리드 설정 계산
  const gridConfig = useMemo(() => {
    const columnsPerRow = Math.floor(containerWidth / itemWidth);
    const totalRows = Math.ceil(items.length / columnsPerRow);
    const totalWidth = columnsPerRow * itemWidth;
    const totalHeight = totalRows * itemHeight;
    
    return {
      columnsPerRow,
      totalRows,
      totalWidth,
      totalHeight
    };
  }, [items.length, containerWidth, itemWidth, itemHeight]);

  // 가시 영역 계산
  const visibleRange = useMemo(() => {
    const { columnsPerRow, totalRows } = gridConfig;
    
    const startRow = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endRow = Math.min(
      totalRows - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    const startCol = Math.max(0, Math.floor(scrollLeft / itemWidth) - overscan);
    const endCol = Math.min(
      columnsPerRow - 1,
      Math.ceil((scrollLeft + containerWidth) / itemWidth) + overscan
    );
    
    return { startRow, endRow, startCol, endCol };
  }, [scrollTop, scrollLeft, containerWidth, containerHeight, itemWidth, itemHeight, gridConfig, overscan]);

  // 가시 아이템들 계산
  const visibleItems = useMemo(() => {
    const { startRow, endRow, startCol, endCol } = visibleRange;
    const { columnsPerRow } = gridConfig;
    const items: VirtualizedGridItem[] = [];
    
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const index = row * columnsPerRow + col;
        
        if (index < items.length) {
          items.push({
            index,
            row,
            col,
            top: row * itemHeight,
            left: col * itemWidth,
            width: itemWidth,
            height: itemHeight
          });
        }
      }
    }
    
    return items;
  }, [visibleRange, gridConfig, itemWidth, itemHeight, items.length]);

  // 스크롤바 메트릭 계산
  const scrollbarMetrics = useMemo(() => {
    const { totalWidth, totalHeight } = gridConfig;
    const scrollbarSize = 12;
    
    // 수직 스크롤바
    const verticalThumbHeight = Math.max(20, (containerHeight / totalHeight) * containerHeight);
    const verticalThumbTop = (scrollTop / (totalHeight - containerHeight)) * (containerHeight - verticalThumbHeight);
    
    // 수평 스크롤바
    const horizontalThumbWidth = Math.max(20, (containerWidth / totalWidth) * containerWidth);
    const horizontalThumbLeft = (scrollLeft / (totalWidth - containerWidth)) * (containerWidth - horizontalThumbWidth);
    
    return {
      vertical: {
        thumbHeight: verticalThumbHeight,
        thumbTop: Math.max(0, Math.min(verticalThumbTop, containerHeight - verticalThumbHeight))
      },
      horizontal: {
        thumbWidth: horizontalThumbWidth,
        thumbLeft: Math.max(0, Math.min(horizontalThumbLeft, containerWidth - horizontalThumbWidth))
      },
      scrollbarSize
    };
  }, [scrollTop, scrollLeft, gridConfig, containerWidth, containerHeight]);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = event.currentTarget.scrollTop;
    const newScrollLeft = event.currentTarget.scrollLeft;
    
    setScrollTop(newScrollTop);
    setScrollLeft(newScrollLeft);
    onScroll?.(newScrollTop, newScrollLeft);
  }, [onScroll]);

  // 스크롤바 드래그 시작
  const handleThumbMouseDown = useCallback((
    event: React.MouseEvent,
    direction: 'horizontal' | 'vertical'
  ) => {
    event.preventDefault();
    setIsDragging(direction);
    setDragStart({
      x: event.clientX,
      y: event.clientY,
      scrollTop,
      scrollLeft
    });
  }, [scrollTop, scrollLeft]);

  // 스크롤바 드래그 중
  const handleThumbMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const { totalWidth, totalHeight } = gridConfig;
    const { scrollbarSize } = scrollbarMetrics;
    
    if (isDragging === 'vertical') {
      const deltaY = event.clientY - dragStart.y;
      const scrollbarHeight = containerHeight - scrollbarSize;
      const scrollRatio = deltaY / (scrollbarHeight - scrollbarMetrics.vertical.thumbHeight);
      const newScrollTop = dragStart.scrollTop + (scrollRatio * (totalHeight - containerHeight));
      
      const clampedScrollTop = Math.max(0, Math.min(newScrollTop, totalHeight - containerHeight));
      setScrollTop(clampedScrollTop);
      containerRef.current.scrollTop = clampedScrollTop;
    } else if (isDragging === 'horizontal') {
      const deltaX = event.clientX - dragStart.x;
      const scrollbarWidth = containerWidth - scrollbarSize;
      const scrollRatio = deltaX / (scrollbarWidth - scrollbarMetrics.horizontal.thumbWidth);
      const newScrollLeft = dragStart.scrollLeft + (scrollRatio * (totalWidth - containerWidth));
      
      const clampedScrollLeft = Math.max(0, Math.min(newScrollLeft, totalWidth - containerWidth));
      setScrollLeft(clampedScrollLeft);
      containerRef.current.scrollLeft = clampedScrollLeft;
    }
  }, [isDragging, dragStart, gridConfig, containerWidth, containerHeight, scrollbarMetrics]);

  // 스크롤바 드래그 종료
  const handleThumbMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  // 마우스 이벤트 리스너 등록/해제
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleThumbMouseMove);
      document.addEventListener('mouseup', handleThumbMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleThumbMouseMove);
        document.removeEventListener('mouseup', handleThumbMouseUp);
      };
    }
  }, [isDragging, handleThumbMouseMove, handleThumbMouseUp]);

  // 특정 인덱스로 스크롤
  const scrollToIndex = useCallback((index: number) => {
    const { columnsPerRow } = gridConfig;
    const row = Math.floor(index / columnsPerRow);
    const col = index % columnsPerRow;
    
    const newScrollTop = row * itemHeight;
    const newScrollLeft = col * itemWidth;
    
    setScrollTop(newScrollTop);
    setScrollLeft(newScrollLeft);
    
    if (containerRef.current) {
      containerRef.current.scrollTop = newScrollTop;
      containerRef.current.scrollLeft = newScrollLeft;
    }
  }, [gridConfig, itemWidth, itemHeight]);

  // 키보드 네비게이션
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const { columnsPerRow } = gridConfig;
    
    switch (event.key) {
      case 'Home':
        event.preventDefault();
        setScrollTop(0);
        setScrollLeft(0);
        break;
      case 'End':
        event.preventDefault();
        setScrollTop(gridConfig.totalHeight - containerHeight);
        setScrollLeft(gridConfig.totalWidth - containerWidth);
        break;
      case 'PageUp':
        event.preventDefault();
        setScrollTop(prev => Math.max(0, prev - containerHeight));
        break;
      case 'PageDown':
        event.preventDefault();
        setScrollTop(prev => Math.min(gridConfig.totalHeight - containerHeight, prev + containerHeight));
        break;
      case 'ArrowLeft':
        event.preventDefault();
        setScrollLeft(prev => Math.max(0, prev - itemWidth));
        break;
      case 'ArrowRight':
        event.preventDefault();
        setScrollLeft(prev => Math.min(gridConfig.totalWidth - containerWidth, prev + itemWidth));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setScrollTop(prev => Math.max(0, prev - itemHeight));
        break;
      case 'ArrowDown':
        event.preventDefault();
        setScrollTop(prev => Math.min(gridConfig.totalHeight - containerHeight, prev + itemHeight));
        break;
    }
  }, [gridConfig, containerWidth, containerHeight, itemWidth, itemHeight]);

  return (
    <VirtualizedGridContainer
      ref={containerRef}
      width={containerWidth}
      height={containerHeight}
      onScroll={handleScroll}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={className}
    >
      <VirtualizedGridContent
        width={gridConfig.totalWidth}
        height={gridConfig.totalHeight}
      >
        {visibleItems.map(({ index, top, left, width, height }) => (
          <VirtualizedGridItem
            key={keyExtractor(items[index], index)}
            top={top}
            left={left}
            width={width}
            height={height}
          >
            {renderItem(items[index], index)}
          </VirtualizedGridItem>
        ))}
      </VirtualizedGridContent>
      
      {/* 수직 스크롤바 */}
      <Scrollbar position="vertical" size={scrollbarMetrics.scrollbarSize}>
        <ScrollThumb
          ref={verticalThumbRef}
          top={scrollbarMetrics.vertical.thumbTop}
          height={scrollbarMetrics.vertical.thumbHeight}
          isDragging={isDragging === 'vertical'}
          onMouseDown={(e) => handleThumbMouseDown(e, 'vertical')}
        />
      </Scrollbar>
      
      {/* 수평 스크롤바 */}
      <Scrollbar position="horizontal" size={scrollbarMetrics.scrollbarSize}>
        <ScrollThumb
          ref={horizontalThumbRef}
          left={scrollbarMetrics.horizontal.thumbLeft}
          width={scrollbarMetrics.horizontal.thumbWidth}
          isDragging={isDragging === 'horizontal'}
          onMouseDown={(e) => handleThumbMouseDown(e, 'horizontal')}
        />
      </Scrollbar>
    </VirtualizedGridContainer>
  );
}

export default VirtualizedGrid;
