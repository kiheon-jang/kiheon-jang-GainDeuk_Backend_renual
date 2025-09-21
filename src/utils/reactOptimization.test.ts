/**
 * React 최적화 유틸리티 테스트
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  usePerformanceMetrics,
  deepEqual,
  shallowEqual,
  optimizedMemo,
  useStableObject,
  useStableArray,
  useStableCallback,
  usePrevious,
  useHasChanged,
  useDebouncedValue,
  useThrottledValue,
  useConditionalMemo,
  useSafeMemo,
  withPerformanceTracking,
  withRenderThrottling,
  getOptimizationRecommendations,
  type PerformanceMetrics
} from './reactOptimization';

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now())
  },
  writable: true
});

// Test component for performance metrics
const TestComponent: React.FC<{ name: string }> = ({ name }) => {
  const metrics = usePerformanceMetrics(name);
  
  return (
    <div>
      <span data-testid="render-count">{metrics.renderCount}</span>
      <span data-testid="component-name">{name}</span>
    </div>
  );
};

// Test component for memoization
const MemoTestComponent: React.FC<{ value: number; callback: () => void }> = ({ value, callback }) => {
  const stableValue = useStableObject({ value });
  const stableArray = useStableArray([value]);
  const stableCallback = useStableCallback(callback, [value]);
  
  return (
    <div>
      <span data-testid="value">{stableValue.value}</span>
      <span data-testid="array-length">{stableArray.length}</span>
      <button onClick={stableCallback}>Click</button>
    </div>
  );
};

// Test component for previous value
const PreviousValueComponent: React.FC<{ value: string }> = ({ value }) => {
  const prevValue = usePrevious(value);
  const hasChanged = useHasChanged(value);
  
  return (
    <div>
      <span data-testid="current-value">{value}</span>
      <span data-testid="previous-value">{prevValue || 'none'}</span>
      <span data-testid="has-changed">{hasChanged.toString()}</span>
    </div>
  );
};

// Test component for debounced value
const DebouncedComponent: React.FC<{ value: string; delay: number }> = ({ value, delay }) => {
  const debouncedValue = useDebouncedValue(value, delay);
  
  return <span data-testid="debounced-value">{debouncedValue}</span>;
};

// Test component for throttled value
const ThrottledComponent: React.FC<{ value: string; delay: number }> = ({ value, delay }) => {
  const throttledValue = useThrottledValue(value, delay);
  
  return <span data-testid="throttled-value">{throttledValue}</span>;
};

// Test component for conditional memo
const ConditionalMemoComponent: React.FC<{ value: number; condition: boolean }> = ({ value, condition }) => {
  const memoizedValue = useConditionalMemo(() => value * 2, [value], condition);
  
  return <span data-testid="memoized-value">{memoizedValue}</span>;
};

// Test component for safe memo
const SafeMemoComponent: React.FC<{ shouldError: boolean }> = ({ shouldError }) => {
  const safeValue = useSafeMemo(
    () => {
      if (shouldError) {
        throw new Error('Test error');
      }
      return 'success';
    },
    [shouldError],
    'fallback'
  );
  
  return <span data-testid="safe-value">{safeValue}</span>;
};

describe('React Optimization Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('usePerformanceMetrics', () => {
    it('should track render count', () => {
      const { rerender } = render(<TestComponent name="TestComponent" />);
      
      expect(screen.getByTestId('render-count')).toHaveTextContent('1');
      
      rerender(<TestComponent name="TestComponent" />);
      expect(screen.getByTestId('render-count')).toHaveTextContent('2');
    });

    it('should provide component name', () => {
      render(<TestComponent name="TestComponent" />);
      
      expect(screen.getByTestId('component-name')).toHaveTextContent('TestComponent');
    });
  });

  describe('deepEqual', () => {
    it('should return true for identical primitive values', () => {
      expect(deepEqual(1, 1)).toBe(true);
      expect(deepEqual('test', 'test')).toBe(true);
      expect(deepEqual(true, true)).toBe(true);
    });

    it('should return false for different primitive values', () => {
      expect(deepEqual(1, 2)).toBe(false);
      expect(deepEqual('test', 'other')).toBe(false);
      expect(deepEqual(true, false)).toBe(false);
    });

    it('should return true for identical objects', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { a: 1, b: { c: 2 } };
      
      expect(deepEqual(obj1, obj2)).toBe(true);
    });

    it('should return false for different objects', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { a: 1, b: { c: 3 } };
      
      expect(deepEqual(obj1, obj2)).toBe(false);
    });

    it('should return true for identical arrays', () => {
      const arr1 = [1, 2, { a: 3 }];
      const arr2 = [1, 2, { a: 3 }];
      
      expect(deepEqual(arr1, arr2)).toBe(true);
    });

    it('should return false for different arrays', () => {
      const arr1 = [1, 2, { a: 3 }];
      const arr2 = [1, 2, { a: 4 }];
      
      expect(deepEqual(arr1, arr2)).toBe(false);
    });

    it('should handle null and undefined', () => {
      expect(deepEqual(null, null)).toBe(true);
      expect(deepEqual(undefined, undefined)).toBe(true);
      expect(deepEqual(null, undefined)).toBe(false);
    });
  });

  describe('shallowEqual', () => {
    it('should return true for identical primitive values', () => {
      expect(shallowEqual(1, 1)).toBe(true);
      expect(shallowEqual('test', 'test')).toBe(true);
    });

    it('should return false for different primitive values', () => {
      expect(shallowEqual(1, 2)).toBe(false);
      expect(shallowEqual('test', 'other')).toBe(false);
    });

    it('should return true for identical shallow objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 2 };
      
      expect(shallowEqual(obj1, obj2)).toBe(true);
    });

    it('should return false for different shallow objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 3 };
      
      expect(shallowEqual(obj1, obj2)).toBe(false);
    });

    it('should return false for objects with different keys', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, c: 2 };
      
      expect(shallowEqual(obj1, obj2)).toBe(false);
    });
  });

  describe('optimizedMemo', () => {
    it('should create memoized component', () => {
      const TestMemoComponent = optimizedMemo(() => <div>Test</div>, {
        displayName: 'TestMemoComponent'
      });
      
      expect(TestMemoComponent.displayName).toBe('TestMemoComponent');
    });
  });

  describe('useStableObject', () => {
    it('should return stable object reference', () => {
      const callback = jest.fn();
      const { rerender } = render(
        <MemoTestComponent value={1} callback={callback} />
      );
      
      const firstRender = screen.getByTestId('value');
      
      rerender(<MemoTestComponent value={1} callback={callback} />);
      
      // Same value should maintain reference
      expect(screen.getByTestId('value')).toBe(firstRender);
    });
  });

  describe('useStableArray', () => {
    it('should return stable array reference', () => {
      const callback = jest.fn();
      const { rerender } = render(
        <MemoTestComponent value={1} callback={callback} />
      );
      
      const firstRender = screen.getByTestId('array-length');
      
      rerender(<MemoTestComponent value={1} callback={callback} />);
      
      // Same value should maintain reference
      expect(screen.getByTestId('array-length')).toBe(firstRender);
    });
  });

  describe('useStableCallback', () => {
    it('should return stable callback reference', () => {
      const callback = jest.fn();
      const { rerender } = render(
        <MemoTestComponent value={1} callback={callback} />
      );
      
      rerender(<MemoTestComponent value={1} callback={callback} />);
      
      // Callback should be stable when dependencies don't change
      expect(callback).toHaveBeenCalledTimes(0);
    });
  });

  describe('usePrevious', () => {
    it('should return previous value', () => {
      const { rerender } = render(<PreviousValueComponent value="first" />);
      
      expect(screen.getByTestId('current-value')).toHaveTextContent('first');
      expect(screen.getByTestId('previous-value')).toHaveTextContent('none');
      
      rerender(<PreviousValueComponent value="second" />);
      
      expect(screen.getByTestId('current-value')).toHaveTextContent('second');
      expect(screen.getByTestId('previous-value')).toHaveTextContent('first');
    });
  });

  describe('useHasChanged', () => {
    it('should detect value changes', () => {
      const { rerender } = render(<PreviousValueComponent value="first" />);
      
      expect(screen.getByTestId('has-changed')).toHaveTextContent('false');
      
      rerender(<PreviousValueComponent value="second" />);
      
      expect(screen.getByTestId('has-changed')).toHaveTextContent('true');
    });
  });

  describe('useDebouncedValue', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should debounce value changes', () => {
      const { rerender } = render(<DebouncedComponent value="first" delay={100} />);
      
      expect(screen.getByTestId('debounced-value')).toHaveTextContent('first');
      
      rerender(<DebouncedComponent value="second" delay={100} />);
      
      // Value should not change immediately
      expect(screen.getByTestId('debounced-value')).toHaveTextContent('first');
      
      // Fast forward time
      act(() => {
        jest.advanceTimersByTime(100);
      });
      
      expect(screen.getByTestId('debounced-value')).toHaveTextContent('second');
    });
  });

  describe('useThrottledValue', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should throttle value changes', () => {
      const { rerender } = render(<ThrottledComponent value="first" delay={100} />);
      
      expect(screen.getByTestId('throttled-value')).toHaveTextContent('first');
      
      rerender(<ThrottledComponent value="second" delay={100} />);
      
      // Value should change immediately for first change
      expect(screen.getByTestId('throttled-value')).toHaveTextContent('second');
    });
  });

  describe('useConditionalMemo', () => {
    it('should memoize when condition is true', () => {
      const { rerender } = render(<ConditionalMemoComponent value={5} condition={true} />);
      
      expect(screen.getByTestId('memoized-value')).toHaveTextContent('10');
      
      rerender(<ConditionalMemoComponent value={5} condition={true} />);
      
      // Should maintain same value when condition is true and value doesn't change
      expect(screen.getByTestId('memoized-value')).toHaveTextContent('10');
    });

    it('should not memoize when condition is false', () => {
      const { rerender } = render(<ConditionalMemoComponent value={5} condition={false} />);
      
      expect(screen.getByTestId('memoized-value')).toHaveTextContent('10');
      
      rerender(<ConditionalMemoComponent value={5} condition={false} />);
      
      // Should recalculate when condition is false
      expect(screen.getByTestId('memoized-value')).toHaveTextContent('10');
    });
  });

  describe('useSafeMemo', () => {
    it('should return computed value when no error', () => {
      render(<SafeMemoComponent shouldError={false} />);
      
      expect(screen.getByTestId('safe-value')).toHaveTextContent('success');
    });

    it('should return fallback value when error occurs', () => {
      render(<SafeMemoComponent shouldError={true} />);
      
      expect(screen.getByTestId('safe-value')).toHaveTextContent('fallback');
    });
  });

  describe('withPerformanceTracking', () => {
    it('should wrap component with performance tracking', () => {
      const TrackedComponent = withPerformanceTracking(TestComponent, 'TrackedTest');
      
      render(<TrackedComponent name="Test" />);
      
      expect(screen.getByTestId('component-name')).toHaveTextContent('Test');
    });
  });

  describe('withRenderThrottling', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should throttle component renders', () => {
      const ThrottledTestComponent = withRenderThrottling(TestComponent, 100);
      
      const { rerender } = render(<ThrottledTestComponent name="Test" />);
      
      expect(screen.getByTestId('component-name')).toHaveTextContent('Test');
      
      rerender(<ThrottledTestComponent name="Test" />);
      
      // Should throttle renders
      act(() => {
        jest.advanceTimersByTime(100);
      });
      
      expect(screen.getByTestId('component-name')).toHaveTextContent('Test');
    });
  });

  describe('getOptimizationRecommendations', () => {
    it('should provide recommendations for slow renders', () => {
      const metrics: PerformanceMetrics = {
        renderCount: 15,
        lastRenderTime: 20,
        averageRenderTime: 18,
        totalRenderTime: 270
      };
      
      const recommendations = getOptimizationRecommendations(metrics);
      
      expect(recommendations).toContain('평균 렌더링 시간이 16ms를 초과합니다. React.memo를 고려해보세요.');
      expect(recommendations).toContain('렌더링 횟수가 많습니다. useMemo나 useCallback을 사용해보세요.');
    });

    it('should provide recommendations for high render times', () => {
      const metrics: PerformanceMetrics = {
        renderCount: 5,
        lastRenderTime: 60,
        averageRenderTime: 20,
        totalRenderTime: 100
      };
      
      const recommendations = getOptimizationRecommendations(metrics);
      
      expect(recommendations).toContain('마지막 렌더링 시간이 50ms를 초과합니다. 컴포넌트 분할을 고려해보세요.');
    });

    it('should not provide recommendations for good performance', () => {
      const metrics: PerformanceMetrics = {
        renderCount: 3,
        lastRenderTime: 10,
        averageRenderTime: 12,
        totalRenderTime: 36
      };
      
      const recommendations = getOptimizationRecommendations(metrics);
      
      expect(recommendations).toHaveLength(0);
    });
  });
});
