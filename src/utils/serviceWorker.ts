/**
 * Service Worker 등록 및 관리 유틸리티
 */

interface ServiceWorkerRegistration {
  registration: ServiceWorkerRegistration | null;
  error: Error | null;
}

/**
 * Service Worker 등록
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      console.log('✅ Service Worker registered successfully:', registration);
      
      // 등록 성공 시 이벤트 리스너 설정
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 New service worker available');
              // 새 서비스 워커가 설치되었을 때 사용자에게 알림
              if (confirm('새로운 버전이 사용 가능합니다. 지금 업데이트하시겠습니까?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        }
      });
      
      return { registration, error: null };
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      return { registration: null, error: error as Error };
    }
  } else {
    const error = new Error('Service Worker not supported');
    console.warn('⚠️ Service Worker not supported in this browser');
    return { registration: null, error };
  }
};

/**
 * Service Worker 해제
 */
export const unregisterServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      for (const registration of registrations) {
        await registration.unregister();
        console.log('🗑️ Service Worker unregistered:', registration);
      }
    } catch (error) {
      console.error('❌ Failed to unregister Service Worker:', error);
    }
  }
};

/**
 * Service Worker 상태 확인
 */
export const getServiceWorkerStatus = async (): Promise<{
  isSupported: boolean;
  isRegistered: boolean;
  isControlling: boolean;
  registration: ServiceWorkerRegistration | null;
}> => {
  if (!('serviceWorker' in navigator)) {
    return {
      isSupported: false,
      isRegistered: false,
      isControlling: false,
      registration: null
    };
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    const isRegistered = !!registration;
    const isControlling = !!navigator.serviceWorker.controller;

    return {
      isSupported: true,
      isRegistered,
      isControlling,
      registration
    };
  } catch (error) {
    console.error('❌ Failed to get Service Worker status:', error);
    return {
      isSupported: true,
      isRegistered: false,
      isControlling: false,
      registration: null
    };
  }
};

/**
 * 캐시 크기 확인
 */
export const getCacheSize = async (): Promise<number> => {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return 0;
  }

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    
    messageChannel.port1.onmessage = (event) => {
      if (event.data.type === 'CACHE_SIZE') {
        resolve(event.data.size);
      }
    };
    
    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_CACHE_SIZE' },
      [messageChannel.port2]
    );
    
    // 타임아웃 설정 (5초)
    setTimeout(() => resolve(0), 5000);
  });
};

/**
 * 캐시 클리어
 */
export const clearCache = async (): Promise<void> => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log('🗑️ Cache cleared:', cacheName);
      }
      
      console.log('✅ All caches cleared');
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
    }
  }
};

/**
 * 오프라인 상태 확인
 */
export const isOffline = (): boolean => {
  return !navigator.onLine;
};

/**
 * 온라인/오프라인 상태 변경 이벤트 리스너
 */
export const addNetworkStatusListener = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  const handleOnline = () => {
    console.log('🌐 Network: Online');
    onOnline();
  };
  
  const handleOffline = () => {
    console.log('📴 Network: Offline');
    onOffline();
  };
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // 정리 함수 반환
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

/**
 * 백그라운드 동기화 요청
 */
export const requestBackgroundSync = async (tag: string = 'background-sync'): Promise<void> => {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register(tag);
      console.log('🔄 Background sync requested:', tag);
    } catch (error) {
      console.error('❌ Failed to request background sync:', error);
    }
  } else {
    console.warn('⚠️ Background sync not supported');
  }
};

/**
 * 푸시 알림 권한 요청
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if ('Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      console.log('📱 Notification permission:', permission);
      return permission;
    } catch (error) {
      console.error('❌ Failed to request notification permission:', error);
      return 'denied';
    }
  } else {
    console.warn('⚠️ Notifications not supported');
    return 'denied';
  }
};

/**
 * 푸시 알림 전송
 */
export const sendNotification = (title: string, options?: NotificationOptions): void => {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        icon: '/vite.svg',
        badge: '/vite.svg',
        ...options
      });
      
      // 알림 클릭 시 닫기
      notification.onclick = () => {
        notification.close();
        window.focus();
      };
      
      // 5초 후 자동 닫기
      setTimeout(() => {
        notification.close();
      }, 5000);
      
      console.log('📱 Notification sent:', title);
    } catch (error) {
      console.error('❌ Failed to send notification:', error);
    }
  } else {
    console.warn('⚠️ Notifications not available');
  }
};
