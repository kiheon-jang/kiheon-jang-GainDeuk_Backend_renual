/**
 * PerformanceSettings 컴포넌트 테스트
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PerformanceSettings from './PerformanceSettings';

// Mock service worker utilities
jest.mock('@/utils/serviceWorker', () => ({
  getServiceWorkerStatus: jest.fn(),
  getCacheSize: jest.fn(),
  clearCache: jest.fn(),
  isOffline: jest.fn(),
  addNetworkStatusListener: jest.fn(),
  requestNotificationPermission: jest.fn(),
  sendNotification: jest.fn()
}));

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

// Mock window.Notification
Object.defineProperty(window, 'Notification', {
  value: {
    permission: 'default',
    requestPermission: jest.fn()
  },
  writable: true
});

describe('PerformanceSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render performance settings', () => {
    render(<PerformanceSettings />);
    
    expect(screen.getByText('성능 설정')).toBeInTheDocument();
    expect(screen.getByText('서비스 워커')).toBeInTheDocument();
    expect(screen.getByText('캐시 관리')).toBeInTheDocument();
    expect(screen.getByText('네트워크 상태')).toBeInTheDocument();
    expect(screen.getByText('알림 설정')).toBeInTheDocument();
  });

  it('should show service worker status', async () => {
    const { getServiceWorkerStatus } = require('@/utils/serviceWorker');
    getServiceWorkerStatus.mockResolvedValue({
      isSupported: true,
      isRegistered: true,
      isControlling: true
    });
    
    render(<PerformanceSettings />);
    
    await waitFor(() => {
      expect(screen.getByText('지원됨')).toBeInTheDocument();
      expect(screen.getByText('등록됨')).toBeInTheDocument();
      expect(screen.getByText('제어 중')).toBeInTheDocument();
    });
  });

  it('should show cache size', async () => {
    const { getCacheSize } = require('@/utils/serviceWorker');
    getCacheSize.mockResolvedValue(1024 * 1024); // 1MB
    
    render(<PerformanceSettings />);
    
    await waitFor(() => {
      expect(screen.getByText('1 MB')).toBeInTheDocument();
    });
  });

  it('should clear cache when button is clicked', async () => {
    const { clearCache } = require('@/utils/serviceWorker');
    clearCache.mockResolvedValue(undefined);
    
    // Mock confirm dialog
    window.confirm = jest.fn(() => true);
    
    render(<PerformanceSettings />);
    
    const clearButton = screen.getByText('캐시 삭제');
    fireEvent.click(clearButton);
    
    expect(window.confirm).toHaveBeenCalledWith('모든 캐시를 삭제하시겠습니까?');
    expect(clearCache).toHaveBeenCalled();
  });

  it('should request notification permission', async () => {
    const { requestNotificationPermission } = require('@/utils/serviceWorker');
    requestNotificationPermission.mockResolvedValue('granted');
    
    render(<PerformanceSettings />);
    
    const requestButton = screen.getByText('권한 요청');
    fireEvent.click(requestButton);
    
    expect(requestNotificationPermission).toHaveBeenCalled();
  });

  it('should send test notification', async () => {
    const { sendNotification } = require('@/utils/serviceWorker');
    sendNotification.mockImplementation(() => {});
    
    // Mock notification permission as granted
    Object.defineProperty(window, 'Notification', {
      value: {
        permission: 'granted',
        requestPermission: jest.fn()
      },
      writable: true
    });
    
    render(<PerformanceSettings />);
    
    const testButton = screen.getByText('테스트');
    fireEvent.click(testButton);
    
    expect(sendNotification).toHaveBeenCalledWith('테스트 알림', {
      body: '성능 설정이 정상적으로 작동하고 있습니다.'
    });
  });

  it('should show network status', () => {
    const { isOffline } = require('@/utils/serviceWorker');
    isOffline.mockReturnValue(false);
    
    render(<PerformanceSettings />);
    
    expect(screen.getByText('온라인')).toBeInTheDocument();
  });

  it('should show offline status', () => {
    const { isOffline } = require('@/utils/serviceWorker');
    isOffline.mockReturnValue(true);
    
    render(<PerformanceSettings />);
    
    expect(screen.getByText('오프라인')).toBeInTheDocument();
  });

  it('should format cache size correctly', async () => {
    const { getCacheSize } = require('@/utils/serviceWorker');
    getCacheSize.mockResolvedValue(1024 * 1024 * 1024); // 1GB
    
    render(<PerformanceSettings />);
    
    await waitFor(() => {
      expect(screen.getByText('1 GB')).toBeInTheDocument();
    });
  });

  it('should show notification permission status', () => {
    Object.defineProperty(window, 'Notification', {
      value: {
        permission: 'granted',
        requestPermission: jest.fn()
      },
      writable: true
    });
    
    render(<PerformanceSettings />);
    
    expect(screen.getByText('허용됨')).toBeInTheDocument();
  });

  it('should show denied notification permission', () => {
    Object.defineProperty(window, 'Notification', {
      value: {
        permission: 'denied',
        requestPermission: jest.fn()
      },
      writable: true
    });
    
    render(<PerformanceSettings />);
    
    expect(screen.getByText('거부됨')).toBeInTheDocument();
  });
});
