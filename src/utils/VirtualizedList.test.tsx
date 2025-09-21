/**
 * VirtualizedList 컴포넌트 테스트
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VirtualizedList from './VirtualizedList';

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
})) as any;

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now())
  },
  writable: true
});

// Test data
const mockItems = Array.from({ length: 1000 }, (_, index) => ({
  id: index,
  name: `Item ${index}`,
  value: index * 10
}));

const mockRenderItem = (item: typeof mockItems[0], index: number) => (
  <div data-testid={`item-${index}`}>
    {item.name} - {item.value}
  </div>
);

const mockKeyExtractor = (item: typeof mockItems[0]) => item.id.toString();

describe('VirtualizedList', () => {
  const defaultProps = {
    items: mockItems,
    itemHeight: 50,
    containerHeight: 300,
    renderItem: mockRenderItem,
    keyExtractor: mockKeyExtractor
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<VirtualizedList {...defaultProps} />);
    
    expect(screen.getByRole('generic')).toBeInTheDocument();
  });

  it('should render visible items only', () => {
    render(<VirtualizedList {...defaultProps} />);
    
    // Should only render items that are visible in the viewport
    // With containerHeight 300 and itemHeight 50, about 6 items should be visible
    const visibleItems = screen.getAllByTestId(/^item-/);
    expect(visibleItems.length).toBeLessThanOrEqual(10); // Including overscan
  });

  it('should handle scroll events', () => {
    const onScroll = jest.fn();
    render(<VirtualizedList {...defaultProps} onScroll={onScroll} />);
    
    const container = screen.getByRole('generic');
    
    fireEvent.scroll(container, { target: { scrollTop: 100 } });
    
    expect(onScroll).toHaveBeenCalledWith(100);
  });

  it('should update visible items on scroll', () => {
    const { rerender } = render(<VirtualizedList {...defaultProps} />);
    
    const container = screen.getByRole('generic');
    
    // Scroll down
    fireEvent.scroll(container, { target: { scrollTop: 500 } });
    
    // Should show different items
    const visibleItems = screen.getAllByTestId(/^item-/);
    expect(visibleItems.length).toBeGreaterThan(0);
  });

  it('should handle keyboard navigation', () => {
    render(<VirtualizedList {...defaultProps} />);
    
    const container = screen.getByRole('generic');
    container.focus();
    
    // Test Home key
    fireEvent.keyDown(container, { key: 'Home' });
    expect(container.scrollTop).toBe(0);
    
    // Test End key
    fireEvent.keyDown(container, { key: 'End' });
    expect(container.scrollTop).toBeGreaterThan(0);
    
    // Test PageDown key
    const initialScrollTop = container.scrollTop;
    fireEvent.keyDown(container, { key: 'PageDown' });
    expect(container.scrollTop).toBeGreaterThan(initialScrollTop);
    
    // Test PageUp key
    fireEvent.keyDown(container, { key: 'PageUp' });
    expect(container.scrollTop).toBeLessThan(initialScrollTop);
  });

  it('should handle custom overscan', () => {
    render(<VirtualizedList {...defaultProps} overscan={10} />);
    
    const visibleItems = screen.getAllByTestId(/^item-/);
    // With overscan 10, should render more items
    expect(visibleItems.length).toBeGreaterThan(6);
  });

  it('should handle empty items array', () => {
    render(<VirtualizedList {...defaultProps} items={[]} />);
    
    const visibleItems = screen.queryAllByTestId(/^item-/);
    expect(visibleItems).toHaveLength(0);
  });

  it('should handle single item', () => {
    const singleItem = [mockItems[0]];
    render(<VirtualizedList {...defaultProps} items={singleItem} />);
    
    const visibleItems = screen.getAllByTestId(/^item-/);
    expect(visibleItems).toHaveLength(1);
    expect(visibleItems[0]).toHaveTextContent('Item 0 - 0');
  });

  it('should handle different item heights', () => {
    render(<VirtualizedList {...defaultProps} itemHeight={100} />);
    
    const visibleItems = screen.getAllByTestId(/^item-/);
    // With itemHeight 100 and containerHeight 300, about 3 items should be visible
    expect(visibleItems.length).toBeLessThanOrEqual(5); // Including overscan
  });

  it('should handle different container heights', () => {
    render(<VirtualizedList {...defaultProps} containerHeight={600} />);
    
    const visibleItems = screen.getAllByTestId(/^item-/);
    // With containerHeight 600 and itemHeight 50, about 12 items should be visible
    expect(visibleItems.length).toBeLessThanOrEqual(15); // Including overscan
  });

  it('should maintain scroll position on prop changes', () => {
    const { rerender } = render(<VirtualizedList {...defaultProps} />);
    
    const container = screen.getByRole('generic');
    fireEvent.scroll(container, { target: { scrollTop: 250 } });
    
    // Change props but keep same items
    rerender(<VirtualizedList {...defaultProps} overscan={5} />);
    
    // Scroll position should be maintained
    expect(container.scrollTop).toBe(250);
  });

  it('should handle rapid scroll events', () => {
    render(<VirtualizedList {...defaultProps} />);
    
    const container = screen.getByRole('generic');
    
    // Simulate rapid scrolling
    for (let i = 0; i < 10; i++) {
      fireEvent.scroll(container, { target: { scrollTop: i * 100 } });
    }
    
    // Should still render items
    const visibleItems = screen.getAllByTestId(/^item-/);
    expect(visibleItems.length).toBeGreaterThan(0);
  });

  it('should handle window resize', () => {
    render(<VirtualizedList {...defaultProps} />);
    
    // Simulate window resize
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 600,
    });
    
    fireEvent(window, new Event('resize'));
    
    // Should still render items
    const visibleItems = screen.getAllByTestId(/^item-/);
    expect(visibleItems.length).toBeGreaterThan(0);
  });

  it('should handle scroll to specific index', () => {
    const { rerender } = render(<VirtualizedList {...defaultProps} />);
    
    const container = screen.getByRole('generic');
    
    // Test scrolling to index 50
    fireEvent.scroll(container, { target: { scrollTop: 50 * 50 } });
    
    // Should show items around index 50
    const visibleItems = screen.getAllByTestId(/^item-/);
    expect(visibleItems.length).toBeGreaterThan(0);
  });

  it('should handle edge cases', () => {
    // Test with very small container
    render(<VirtualizedList {...defaultProps} containerHeight={50} />);
    
    const visibleItems = screen.getAllByTestId(/^item-/);
    expect(visibleItems.length).toBeGreaterThan(0);
    
    // Test with very large items
    render(<VirtualizedList {...defaultProps} itemHeight={1000} />);
    
    const visibleItemsLarge = screen.getAllByTestId(/^item-/);
    expect(visibleItemsLarge.length).toBeGreaterThan(0);
  });

  it('should handle custom className', () => {
    const customClassName = 'custom-virtualized-list';
    render(<VirtualizedList {...defaultProps} className={customClassName} />);
    
    const container = screen.getByRole('generic');
    expect(container).toHaveClass(customClassName);
  });

  it('should handle scroll events with different scroll positions', () => {
    const onScroll = jest.fn();
    render(<VirtualizedList {...defaultProps} onScroll={onScroll} />);
    
    const container = screen.getByRole('generic');
    
    // Test different scroll positions
    const scrollPositions = [0, 100, 500, 1000, 2000];
    
    scrollPositions.forEach(position => {
      fireEvent.scroll(container, { target: { scrollTop: position } });
      expect(onScroll).toHaveBeenCalledWith(position);
    });
  });
});
