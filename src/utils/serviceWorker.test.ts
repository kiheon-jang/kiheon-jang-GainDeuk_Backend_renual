/**
 * Service Worker 유틸리티 테스트
 */

import {
  registerServiceWorker,
  unregisterServiceWorker,
  getServiceWorkerStatus,
  getCacheSize,
  clearCache,
  isOffline,
  addNetworkStatusListener,
  requestBackgroundSync,
  requestNotificationPermission,
  sendNotification
} from './serviceWorker';

// Mock navigator.serviceWorker
const mockServiceWorker = {
  register: jest.fn(),
  getRegistration: jest.fn(),
  getRegistrations: jest.fn(),
  controller: null,
  ready: Promise.resolve({
    sync: {
      register: jest.fn()
    }
  })
};

Object.defineProperty(navigator, 'serviceWorker', {
  value: mockServiceWorker,
  writable: true
});

// Mock caches
const mockCaches = {
  open: jest.fn(),
  delete: jest.fn(),
  keys: jest.fn()
};

Object.defineProperty(window, 'caches', {
  value: mockCaches,
  writable: true
});

// Mock Notification
const mockNotification = {
  requestPermission: jest.fn(),
  permission: 'default'
};

Object.defineProperty(window, 'Notification', {
  value: mockNotification,
  writable: true
});

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true
});

describe('Service Worker Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerServiceWorker', () => {
    it('should register service worker successfully', async () => {
      const mockRegistration = { scope: '/', installing: null };
      mockServiceWorker.register.mockResolvedValue(mockRegistration);
      
      const result = await registerServiceWorker();
      
      expect(mockServiceWorker.register).toHaveBeenCalledWith('/sw.js');
      expect(result.registration).toBe(mockRegistration);
      expect(result.error).toBeNull();
    });

    it('should handle registration errors', async () => {
      const error = new Error('Registration failed');
      mockServiceWorker.register.mockRejectedValue(error);
      
      const result = await registerServiceWorker();
      
      expect(result.registration).toBeNull();
      expect(result.error).toBe(error);
    });

    it('should handle unsupported browsers', async () => {
      // @ts-ignore
      delete navigator.serviceWorker;
      
      const result = await registerServiceWorker();
      
      expect(result.registration).toBeNull();
      expect(result.error).toBeInstanceOf(Error);
    });
  });

  describe('unregisterServiceWorker', () => {
    it('should unregister all service workers', async () => {
      const mockRegistrations = [
        { unregister: jest.fn().mockResolvedValue(true) },
        { unregister: jest.fn().mockResolvedValue(true) }
      ];
      mockServiceWorker.getRegistrations.mockResolvedValue(mockRegistrations);
      
      await unregisterServiceWorker();
      
      expect(mockServiceWorker.getRegistrations).toHaveBeenCalled();
      expect(mockRegistrations[0].unregister).toHaveBeenCalled();
      expect(mockRegistrations[1].unregister).toHaveBeenCalled();
    });

    it('should handle unregistration errors', async () => {
      const error = new Error('Unregistration failed');
      mockServiceWorker.getRegistrations.mockRejectedValue(error);
      
      await expect(unregisterServiceWorker()).resolves.not.toThrow();
    });
  });

  describe('getServiceWorkerStatus', () => {
    it('should return service worker status', async () => {
      const mockRegistration = { scope: '/' };
      mockServiceWorker.getRegistration.mockResolvedValue(mockRegistration);
      mockServiceWorker.controller = { scope: '/' };
      
      const status = await getServiceWorkerStatus();
      
      expect(status.isSupported).toBe(true);
      expect(status.isRegistered).toBe(true);
      expect(status.isControlling).toBe(true);
      expect(status.registration).toBe(mockRegistration);
    });

    it('should handle unsupported browsers', async () => {
      // @ts-ignore
      delete navigator.serviceWorker;
      
      const status = await getServiceWorkerStatus();
      
      expect(status.isSupported).toBe(false);
      expect(status.isRegistered).toBe(false);
      expect(status.isControlling).toBe(false);
      expect(status.registration).toBeNull();
    });
  });

  describe('getCacheSize', () => {
    it('should return cache size', async () => {
      const mockMessageChannel = {
        port1: { onmessage: jest.fn() },
        port2: {}
      };
      
      // Mock MessageChannel
      global.MessageChannel = jest.fn(() => mockMessageChannel) as any;
      
      mockServiceWorker.controller = { postMessage: jest.fn() };
      
      // Simulate response
      setTimeout(() => {
        mockMessageChannel.port1.onmessage({
          data: { type: 'CACHE_SIZE', size: 1024 }
        });
      }, 100);
      
      const size = await getCacheSize();
      
      expect(size).toBe(1024);
    });

    it('should return 0 when no service worker controller', async () => {
      mockServiceWorker.controller = null;
      
      const size = await getCacheSize();
      
      expect(size).toBe(0);
    });
  });

  describe('clearCache', () => {
    it('should clear all caches', async () => {
      const mockCacheNames = ['cache1', 'cache2'];
      mockCaches.keys.mockResolvedValue(mockCacheNames);
      mockCaches.delete.mockResolvedValue(true);
      
      await clearCache();
      
      expect(mockCaches.keys).toHaveBeenCalled();
      expect(mockCaches.delete).toHaveBeenCalledWith('cache1');
      expect(mockCaches.delete).toHaveBeenCalledWith('cache2');
    });

    it('should handle cache clearing errors', async () => {
      const error = new Error('Cache clear failed');
      mockCaches.keys.mockRejectedValue(error);
      
      await expect(clearCache()).resolves.not.toThrow();
    });
  });

  describe('isOffline', () => {
    it('should return offline status', () => {
      navigator.onLine = false;
      expect(isOffline()).toBe(true);
      
      navigator.onLine = true;
      expect(isOffline()).toBe(false);
    });
  });

  describe('addNetworkStatusListener', () => {
    it('should add network status listeners', () => {
      const onOnline = jest.fn();
      const onOffline = jest.fn();
      
      const cleanup = addNetworkStatusListener(onOnline, onOffline);
      
      // Simulate online event
      window.dispatchEvent(new Event('online'));
      expect(onOnline).toHaveBeenCalled();
      
      // Simulate offline event
      window.dispatchEvent(new Event('offline'));
      expect(onOffline).toHaveBeenCalled();
      
      // Test cleanup
      cleanup();
    });
  });

  describe('requestBackgroundSync', () => {
    it('should request background sync', async () => {
      const mockRegistration = {
        sync: {
          register: jest.fn().mockResolvedValue(undefined)
        }
      };
      mockServiceWorker.ready = Promise.resolve(mockRegistration);
      
      await requestBackgroundSync('test-sync');
      
      expect(mockRegistration.sync.register).toHaveBeenCalledWith('test-sync');
    });

    it('should handle unsupported background sync', async () => {
      // @ts-ignore
      delete window.ServiceWorkerRegistration;
      
      await expect(requestBackgroundSync()).resolves.not.toThrow();
    });
  });

  describe('requestNotificationPermission', () => {
    it('should request notification permission', async () => {
      mockNotification.requestPermission.mockResolvedValue('granted');
      
      const permission = await requestNotificationPermission();
      
      expect(mockNotification.requestPermission).toHaveBeenCalled();
      expect(permission).toBe('granted');
    });

    it('should handle unsupported notifications', async () => {
      // @ts-ignore
      delete window.Notification;
      
      const permission = await requestNotificationPermission();
      
      expect(permission).toBe('denied');
    });
  });

  describe('sendNotification', () => {
    it('should send notification when permission is granted', () => {
      mockNotification.permission = 'granted';
      
      // Mock Notification constructor
      const mockNotificationInstance = {
        close: jest.fn(),
        onclick: null
      };
      
      // @ts-ignore
      global.Notification = jest.fn(() => mockNotificationInstance);
      
      sendNotification('Test notification');
      
      expect(global.Notification).toHaveBeenCalledWith('Test notification', {
        icon: '/vite.svg',
        badge: '/vite.svg'
      });
    });

    it('should not send notification when permission is denied', () => {
      mockNotification.permission = 'denied';
      
      // @ts-ignore
      global.Notification = jest.fn();
      
      sendNotification('Test notification');
      
      expect(global.Notification).not.toHaveBeenCalled();
    });
  });
});
