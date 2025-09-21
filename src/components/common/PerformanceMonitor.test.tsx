/**
 * PerformanceMonitor 컴포넌트 테스트
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PerformanceMonitor from './PerformanceMonitor';

// Mock performance hooks
jest.mock('@/hooks/usePerformance', () => ({
  usePerformanceMonitoring: () => ({
    metrics: {
      renderTime: 10,
      mountTime: Date.now(),
      updateCount: 5,
      lastUpdateTime: Date.now()
    }
  }),
  useMemoryMonitoring: jest.fn()
}));

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => [])
};

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((callback) => {
  setTimeout(callback, 16);
  return 1;
});

global.cancelAnimationFrame = jest.fn();

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render performance metrics', () => {
    render(<PerformanceMonitor />);
    
    expect(screen.getByText('FPS')).toBeInTheDocument();
    expect(screen.getByText('Render')).toBeInTheDocument();
    expect(screen.getByText('Memory')).toBeInTheDocument();
    expect(screen.getByText('Updates')).toBeInTheDocument();
  });

  it('should not render in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    render(<PerformanceMonitor />);
    
    expect(screen.queryByText('FPS')).not.toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
  });

  it('should show performance warnings when metrics exceed thresholds', () => {
    // Mock high render time
    jest.mock('@/hooks/usePerformance', () => ({
      usePerformanceMonitoring: () => ({
        metrics: {
          renderTime: 20, // Exceeds 16ms threshold
          mountTime: Date.now(),
          updateCount: 15, // Exceeds 10 updates threshold
          lastUpdateTime: Date.now()
        }
      }),
      useMemoryMonitoring: jest.fn()
    }));
    
    render(<PerformanceMonitor />);
    
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Too many updates')).toBeInTheDocument();
  });

  it('should position correctly', () => {
    const { container } = render(<PerformanceMonitor position="top-left" />);
    
    const monitor = container.firstChild as HTMLElement;
    expect(monitor).toHaveStyle('top: 1rem; left: 1rem;');
  });

  it('should hide when show prop is false', () => {
    render(<PerformanceMonitor show={false} />);
    
    expect(screen.queryByText('FPS')).not.toBeInTheDocument();
  });
});
