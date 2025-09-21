/**
 * Service Worker for Advanced Caching Strategy and Offline Support
 * 고급 캐싱 전략 및 오프라인 지원을 위한 서비스 워커
 */

const CACHE_VERSION = 'v2';
const STATIC_CACHE_NAME = `gaindeuk-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `gaindeuk-dynamic-${CACHE_VERSION}`;
const API_CACHE_NAME = `gaindeuk-api-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `gaindeuk-images-${CACHE_VERSION}`;

// 캐시할 정적 리소스
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/vite.svg',
  '/logo192.png',
  '/logo512.png'
];

// 캐시 전략별 API 엔드포인트
const CACHE_STRATEGIES = {
  // 캐시 우선 (정적 데이터)
  CACHE_FIRST: [
    /\/api\/coins$/,
    /\/api\/user-profile/,
    /\/api\/settings/
  ],
  
  // 네트워크 우선 (실시간 데이터)
  NETWORK_FIRST: [
    /\/api\/trading-signals/,
    /\/api\/market-data/,
    /\/api\/price-updates/
  ],
  
  // 캐시만 (오프라인 우선)
  CACHE_ONLY: [
    /\/api\/static-content/,
    /\/api\/help/
  ],
  
  // 네트워크만 (중요한 데이터)
  NETWORK_ONLY: [
    /\/api\/auth/,
    /\/api\/transactions/
  ]
};

// 캐시 만료 시간 (밀리초)
const CACHE_EXPIRY = {
  STATIC: 7 * 24 * 60 * 60 * 1000, // 7일
  DYNAMIC: 24 * 60 * 60 * 1000,    // 1일
  API: 5 * 60 * 1000,              // 5분
  IMAGES: 30 * 24 * 60 * 60 * 1000 // 30일
};

// 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Failed to cache static assets:', error);
      })
  );
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// fetch 이벤트
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // GET 요청만 처리
  if (request.method !== 'GET') {
    return;
  }

  // 정적 리소스 처리 (캐시 우선)
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
    return;
  }

  // API 요청 처리 (전략별)
  const apiStrategy = getCacheStrategy(url.pathname);
  if (apiStrategy) {
    event.respondWith(handleApiRequest(request, apiStrategy));
    return;
  }

  // 이미지 리소스 처리 (캐시 우선)
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, IMAGE_CACHE_NAME));
    return;
  }

  // 기타 요청은 네트워크에서 가져오기
  event.respondWith(fetch(request));
});

// 캐시 전략 결정
function getCacheStrategy(pathname) {
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pattern.test(pathname))) {
      return strategy;
    }
  }
  return null;
}

// API 요청 처리
async function handleApiRequest(request, strategy) {
  const url = new URL(request.url);
  
  switch (strategy) {
    case 'CACHE_FIRST':
      return cacheFirst(request, API_CACHE_NAME);
    
    case 'NETWORK_FIRST':
      return networkFirst(request, API_CACHE_NAME);
    
    case 'CACHE_ONLY':
      return cacheOnly(request);
    
    case 'NETWORK_ONLY':
      return networkOnly(request);
    
    default:
      return fetch(request);
  }
}

// 캐시 우선 전략
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse && !isExpired(cachedResponse)) {
      console.log('📦 Serving from cache:', request.url);
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const responseClone = networkResponse.clone();
      const cache = await caches.open(cacheName);
      await cache.put(request, responseClone);
      console.log('💾 Cached:', request.url);
    }
    return networkResponse;
  } catch (error) {
    console.error('❌ Cache first failed:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// 네트워크 우선 전략
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const responseClone = networkResponse.clone();
      const cache = await caches.open(cacheName);
      await cache.put(request, responseClone);
      console.log('🌐 Network first - cached:', request.url);
    }
    return networkResponse;
  } catch (error) {
    console.log('📦 Network failed, serving from cache:', request.url);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// 캐시만 전략
async function cacheOnly(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse && !isExpired(cachedResponse)) {
    console.log('📦 Cache only - serving:', request.url);
    return cachedResponse;
  }
  return new Response('Not cached', { status: 404 });
}

// 네트워크만 전략
async function networkOnly(request) {
  try {
    const networkResponse = await fetch(request);
    console.log('🌐 Network only:', request.url);
    return networkResponse;
  } catch (error) {
    console.error('❌ Network only failed:', error);
    return new Response('Network error', { status: 503 });
  }
}

// 캐시 만료 확인
function isExpired(response) {
  const cacheDate = response.headers.get('sw-cache-date');
  if (!cacheDate) return false;
  
  const cacheTime = new Date(cacheDate).getTime();
  const now = Date.now();
  const maxAge = CACHE_EXPIRY.API; // 기본 5분
  
  return (now - cacheTime) > maxAge;
}

// 백그라운드 동기화
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // 백그라운드에서 수행할 작업
      performBackgroundSync()
    );
  }
});

// 백그라운드 동기화 작업
async function performBackgroundSync() {
  try {
    console.log('🔄 Performing background sync...');
    
    // 오프라인 상태에서 저장된 데이터 동기화
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.status === 200) {
          await cache.put(request, response);
          console.log('✅ Synced:', request.url);
        }
      } catch (error) {
        console.error('❌ Failed to sync:', request.url, error);
      }
    }
    
    console.log('✅ Background sync completed');
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// 푸시 알림 처리
self.addEventListener('push', (event) => {
  console.log('📱 Push notification received');
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/vite.svg',
      badge: '/vite.svg',
      tag: data.tag || 'default',
      data: data.data
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  console.log('📱 Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// 메시지 처리
self.addEventListener('message', (event) => {
  console.log('📨 Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then((size) => {
      event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
    });
  }
});

// 캐시 크기 계산
async function getCacheSize() {
  try {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('❌ Failed to calculate cache size:', error);
    return 0;
  }
}
