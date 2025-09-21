/**
 * 반응형 테스트 유틸리티 테스트
 */

import {
  getDeviceType,
  isMobile,
  isTablet,
  isDesktop,
  isTouchDevice,
  logResponsiveInfo,
  setupResponsiveTest
} from './responsiveTest';

// Mock window object
const mockWindow = {
  innerWidth: 1024,
  innerHeight: 768,
  matchMedia: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};

Object.defineProperty(window, 'window', {
  value: mockWindow,
  writable: true
});

// Mock navigator
const mockNavigator = {
  maxTouchPoints: 0
};

Object.defineProperty(navigator, 'navigator', {
  value: mockNavigator,
  writable: true
});

// Mock console
const mockConsole = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

Object.defineProperty(console, 'console', {
  value: mockConsole,
  writable: true
});

describe('Responsive Test Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDeviceType', () => {
    it('should return mobile for small screens', () => {
      mockWindow.innerWidth = 400; // Below 576px
      
      const deviceType = getDeviceType();
      
      expect(deviceType).toBe('mobile');
    });

    it('should return tablet for medium screens', () => {
      mockWindow.innerWidth = 800; // Between 576px and 992px
      
      const deviceType = getDeviceType();
      
      expect(deviceType).toBe('tablet');
    });

    it('should return desktop for large screens', () => {
      mockWindow.innerWidth = 1200; // Above 992px
      
      const deviceType = getDeviceType();
      
      expect(deviceType).toBe('desktop');
    });

    it('should return unknown for undefined window', () => {
      // @ts-ignore
      delete window.window;
      
      const deviceType = getDeviceType();
      
      expect(deviceType).toBe('unknown');
    });
  });

  describe('isMobile', () => {
    it('should return true for mobile screens', () => {
      mockWindow.innerWidth = 400;
      
      const result = isMobile();
      
      expect(result).toBe(true);
    });

    it('should return false for non-mobile screens', () => {
      mockWindow.innerWidth = 800;
      
      const result = isMobile();
      
      expect(result).toBe(false);
    });
  });

  describe('isTablet', () => {
    it('should return true for tablet screens', () => {
      mockWindow.innerWidth = 800;
      
      const result = isTablet();
      
      expect(result).toBe(true);
    });

    it('should return false for non-tablet screens', () => {
      mockWindow.innerWidth = 400;
      
      const result = isTablet();
      
      expect(result).toBe(false);
    });
  });

  describe('isDesktop', () => {
    it('should return true for desktop screens', () => {
      mockWindow.innerWidth = 1200;
      
      const result = isDesktop();
      
      expect(result).toBe(true);
    });

    it('should return false for non-desktop screens', () => {
      mockWindow.innerWidth = 800;
      
      const result = isDesktop();
      
      expect(result).toBe(false);
    });
  });

  describe('isTouchDevice', () => {
    it('should return true for touch devices', () => {
      mockNavigator.maxTouchPoints = 5;
      
      const result = isTouchDevice();
      
      expect(result).toBe(true);
    });

    it('should return false for non-touch devices', () => {
      mockNavigator.maxTouchPoints = 0;
      
      const result = isTouchDevice();
      
      expect(result).toBe(false);
    });

    it('should return false for undefined window', () => {
      // @ts-ignore
      delete window.window;
      
      const result = isTouchDevice();
      
      expect(result).toBe(false);
    });
  });

  describe('logResponsiveInfo', () => {
    it('should log responsive information', () => {
      mockWindow.innerWidth = 1024;
      mockWindow.innerHeight = 768;
      mockNavigator.maxTouchPoints = 0;
      
      logResponsiveInfo();
      
      expect(mockConsole.log).toHaveBeenCalledWith('--- Responsive Info ---');
      expect(mockConsole.log).toHaveBeenCalledWith('Window Width: 1024px');
      expect(mockConsole.log).toHaveBeenCalledWith('Window Height: 768px');
      expect(mockConsole.log).toHaveBeenCalledWith('Device Type: desktop');
      expect(mockConsole.log).toHaveBeenCalledWith('Is Touch Device: false');
      expect(mockConsole.log).toHaveBeenCalledWith('-----------------------');
    });

    it('should not log for undefined window', () => {
      // @ts-ignore
      delete window.window;
      
      logResponsiveInfo();
      
      expect(mockConsole.log).not.toHaveBeenCalled();
    });
  });

  describe('setupResponsiveTest', () => {
    it('should setup responsive test listeners', () => {
      mockWindow.innerWidth = 1024;
      mockWindow.innerHeight = 768;
      mockNavigator.maxTouchPoints = 0;
      
      setupResponsiveTest();
      
      expect(mockConsole.log).toHaveBeenCalledWith('--- Responsive Info ---');
      expect(mockWindow.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(mockWindow.addEventListener).toHaveBeenCalledWith('orientationchange', expect.any(Function));
    });

    it('should not setup listeners for undefined window', () => {
      // @ts-ignore
      delete window.window;
      
      setupResponsiveTest();
      
      expect(mockWindow.addEventListener).not.toHaveBeenCalled();
    });
  });
});