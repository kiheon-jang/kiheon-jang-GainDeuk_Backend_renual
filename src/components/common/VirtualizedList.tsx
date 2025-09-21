/**
 * 가상화된 리스트 컴포넌트
 * 대용량 데이터를 효율적으로 렌더링
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { usePerformanceMetrics } from '@/utils/reactOptimization';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  overscan?: number; // 화면 밖에 미리 렌더링할 아이템 수
  onScroll?: (scrollTop: number) => void;
  className?: string;
}

interface VirtualizedItem {
  index: number;
  top: number;
  height: number;
}

const VirtualizedContainer = styled.div<{ height: number }>`
  height: ${({ height }) => height}px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const VirtualizedContent = styled.div<{ height: number }>`
  height: ${({ height }) => height}px;
  position: relative;
`;

const VirtualizedItem = styled.div<{ top: number; height: number }>`
  position: absolute;
  top: ${({ top }) => top}px;
  left: 0;
  right: 0;
  height: ${({ height }) => height}px;
  padding: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  
  &:last-child {
    border-bottom: none;
  }
`;

const Scrollbar = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 8px;
  background: ${({ theme }) => theme.colors.gray[200]};
  border-radius: 4px;
  opacity: 0;
  transition: opacity ${({ theme }) => theme.transitions.FAST};
  
  ${VirtualizedContainer}:hover & {
    opacity: 1;
  }
`;

const ScrollThumb = styled.div<{ 
  top: number; 
  height: number; 
  isDragging: boolean;
}>`
  position: absolute;
  top: ${({ top }) => top}px;
  left: 0;
  right: 0;
  height: ${({ height }) => height}px;
  background: ${({ theme, isDragging }) => 
    isDragging ? theme.colors.primary : theme.colors.gray[400]};
  border-radius: 4px;
  cursor: ${({ isDragging }) => isDragging ? 'grabbing' : 'grab'};
  transition: background ${({ theme }) => theme.transitions.FAST};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
  }
`;

function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  keyExtractor,
  overscan = 5,
  onScroll,
  className
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartScrollTop, setDragStartScrollTop] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollThumbRef = useRef<HTMLDivElement>(null);
  
  // 성능 메트릭 수집
  const metrics = usePerformanceMetrics('VirtualizedList');

  // 총 높이 계산
  const totalHeight = useMemo(() => items.length * itemHeight, [items.length, itemHeight]);

  // 가시 영역 계산
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, containerHeight, itemHeight, items.length, overscan]);

  // 가시 아이템들 계산
  const visibleItems = useMemo(() => {
    const { startIndex, endIndex } = visibleRange;
    const items: VirtualizedItem[] = [];
    
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        top: i * itemHeight,
        height: itemHeight
      });
    }
    
    return items;
  }, [visibleRange, itemHeight]);

  // 스크롤바 높이 및 위치 계산
  const scrollbarMetrics = useMemo(() => {
    const scrollbarHeight = containerHeight;
    const thumbHeight = Math.max(20, (containerHeight / totalHeight) * scrollbarHeight);
    const thumbTop = (scrollTop / (totalHeight - containerHeight)) * (scrollbarHeight - thumbHeight);
    
    return {
      thumbHeight,
      thumbTop: Math.max(0, Math.min(thumbTop, scrollbarHeight - thumbHeight))
    };
  }, [scrollTop, totalHeight, containerHeight]);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = event.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    onScroll?.(newScrollTop);
  }, [onScroll]);

  // 스크롤바 드래그 시작
  const handleThumbMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setIsDragging(true);
    setDragStartY(event.clientY);
    setDragStartScrollTop(scrollTop);
  }, [scrollTop]);

  // 스크롤바 드래그 중
  const handleThumbMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const deltaY = event.clientY - dragStartY;
    const scrollbarHeight = containerHeight;
    const scrollRatio = deltaY / (scrollbarHeight - scrollbarMetrics.thumbHeight);
    const newScrollTop = dragStartScrollTop + (scrollRatio * (totalHeight - containerHeight));
    
    const clampedScrollTop = Math.max(0, Math.min(newScrollTop, totalHeight - containerHeight));
    setScrollTop(clampedScrollTop);
    
    if (containerRef.current) {
      containerRef.current.scrollTop = clampedScrollTop;
    }
  }, [isDragging, dragStartY, dragStartScrollTop, containerHeight, scrollbarMetrics.thumbHeight, totalHeight]);

  // 스크롤바 드래그 종료
  const handleThumbMouseUp = useCallback(() => {
    setIsDragging(false);
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
    const newScrollTop = index * itemHeight;
    setScrollTop(newScrollTop);
    
    if (containerRef.current) {
      containerRef.current.scrollTop = newScrollTop;
    }
  }, [itemHeight]);

  // 맨 위로 스크롤
  const scrollToTop = useCallback(() => {
    scrollToIndex(0);
  }, [scrollToIndex]);

  // 맨 아래로 스크롤
  const scrollToBottom = useCallback(() => {
    scrollToIndex(items.length - 1);
  }, [scrollToIndex, items.length]);

  // 키보드 네비게이션
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Home':
        event.preventDefault();
        scrollToTop();
        break;
      case 'End':
        event.preventDefault();
        scrollToBottom();
        break;
      case 'PageUp':
        event.preventDefault();
        setScrollTop(prev => Math.max(0, prev - containerHeight));
        break;
      case 'PageDown':
        event.preventDefault();
        setScrollTop(prev => Math.min(totalHeight - containerHeight, prev + containerHeight));
        break;
    }
  }, [scrollToTop, scrollToBottom, containerHeight, totalHeight]);

  return (
    <VirtualizedContainer
      ref={containerRef}
      height={containerHeight}
      onScroll={handleScroll}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={className}
    >
      <VirtualizedContent height={totalHeight}>
        {visibleItems.map(({ index, top, height }) => (
          <VirtualizedItem
            key={keyExtractor(items[index], index)}
            top={top}
            height={height}
          >
            {renderItem(items[index], index)}
          </VirtualizedItem>
        ))}
      </VirtualizedContent>
      
      <Scrollbar>
        <ScrollThumb
          ref={scrollThumbRef}
          top={scrollbarMetrics.thumbTop}
          height={scrollbarMetrics.thumbHeight}
          isDragging={isDragging}
          onMouseDown={handleThumbMouseDown}
        />
      </Scrollbar>
    </VirtualizedContainer>
  );
}

export default VirtualizedList;
