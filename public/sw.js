// Service Worker for GainDeuk Trading App - TEMPORARILY DISABLED
// const CACHE_NAME = 'gaindeuk-v1';
// const STATIC_CACHE_NAME = 'gaindeuk-static-v1';
// const DYNAMIC_CACHE_NAME = 'gaindeuk-dynamic-v1';

// 캐시할 정적 리소스들
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/src/App.css',
  '/manifest.json'
];

// API 엔드포인트별 캐시 전략
const CACHE_STRATEGIES = {
  '/api/signals': 'NETWORK_FIRST',
  '/api/coins': 'NETWORK_FIRST',
  '/api/health': 'NETWORK_FIRST',
  '/api/news': 'STALE_WHILE_REVALIDATE',
  '/api/whale': 'STALE_WHILE_REVALIDATE'
};

// 설치 이벤트 - 정적 리소스 캐시
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static assets');
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

// 활성화 이벤트 - 오래된 캐시 정리
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

// Fetch 이벤트 - 요청 인터셉트 및 캐시 전략 적용
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 개발 환경에서는 API 요청과 외부 리소스를 서비스 워커에서 처리하지 않음
  if (url.hostname === 'localhost' && url.pathname.startsWith('/api/')) {
    console.log('🔧 Development mode: Bypassing service worker for API request:', url.pathname);
    return;
  }

  // 외부 도메인 요청은 서비스 워커에서 처리하지 않음
  if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
    console.log('🌐 External domain request, bypassing service worker:', url.hostname);
    return;
  }

  // cryptologos.cc 이미지 요청 차단 (CORS 오류 방지)
  if (url.hostname === 'cryptologos.cc' || url.href.includes('cryptologos.cc')) {
    console.log('🚫 Blocking cryptologos.cc image request to prevent CORS errors:', url.href);
    return new Response('', { status: 403, statusText: 'Forbidden' });
  }

  // 이미지 요청은 서비스 워커에서 처리하지 않음 (개발 환경에서)
  if (url.pathname.includes('.png') || url.pathname.includes('.jpg') || url.pathname.includes('.jpeg') || url.pathname.includes('.gif') || url.pathname.includes('.svg')) {
    console.log('🖼️ Image request, bypassing service worker:', url.pathname);
    return;
  }

  // 외부 API 요청은 서비스 워커에서 처리하지 않음
  if (url.hostname.includes('cryptologos.cc') || url.hostname.includes('exchangerate-api.com')) {
    console.log('🌐 External API request, bypassing service worker:', url.hostname);
    return;
  }

  // API 요청 처리
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request).catch((error) => {
      console.error('❌ Service Worker API request failed:', error);
      // 네트워크 오류 시 기본 응답 반환
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Service temporarily unavailable',
          timestamp: new Date().toISOString()
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }));
    return;
  }

  // 정적 리소스 요청 처리
  event.respondWith(handleStaticRequest(request).catch((error) => {
    console.error('❌ Service Worker static request failed:', error);
    // 정적 리소스 오류 시 기본 응답 반환
    return new Response('Resource not available', {
      status: 404,
      statusText: 'Not Found'
    });
  }));
});

// API 요청 처리 함수
async function handleApiRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // 캐시 전략 결정
  const strategy = CACHE_STRATEGIES[pathname] || 'NETWORK_FIRST';
  
  console.log(`📡 API Request: ${pathname} (Strategy: ${strategy})`);

  try {
    switch (strategy) {
      case 'NETWORK_FIRST':
        return await networkFirst(request);
      case 'CACHE_FIRST':
        return await cacheFirst(request);
      case 'STALE_WHILE_REVALIDATE':
        return await staleWhileRevalidate(request);
      default:
        return await networkFirst(request);
    }
  } catch (error) {
    console.error(`❌ API request failed for ${pathname}:`, error);
    
    // 네트워크 오류 시 캐시에서 응답 시도
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📦 Serving cached response due to network error');
      return cachedResponse;
    }
    
    // 캐시도 없으면 기본 오류 응답
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Network error and no cached data available',
        timestamp: new Date().toISOString()
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// 정적 리소스 요청 처리 함수
async function handleStaticRequest(request) {
  try {
    // 외부 도메인 요청은 서비스 워커에서 처리하지 않음
    const url = new URL(request.url);
    if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
      console.log('🌐 External request, bypassing service worker:', url.hostname);
      return fetch(request);
    }

    // 캐시 우선 전략
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📦 Serving cached static resource:', url.pathname);
      return cachedResponse;
    }

    // 캐시에 없으면 네트워크에서 가져오기
    console.log('🌐 Fetching static resource from network:', url.pathname);
    const networkResponse = await fetch(request);
    
    // 성공적인 응답이면 캐시에 저장
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      console.log('✅ Static resource cached:', url.pathname);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Static request failed:', error);
    
    // 오프라인 페이지 반환 (필요시)
    if (request.destination === 'document') {
      const offlinePage = await caches.match('/index.html');
      if (offlinePage) {
        return offlinePage;
      }
    }
    
    // 외부 리소스 오류 시 기본 응답 반환
    if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
      return new Response('External resource not available', {
        status: 404,
        statusText: 'Not Found'
      });
    }
    
    // 로컬 리소스 오류 시 기본 응답 반환
    return new Response('Resource not available', { 
      status: 404, 
      statusText: 'Not Found' 
    });
  }
}

// Network First 전략
async function networkFirst(request) {
  try {
    console.log('🌐 Network First: Trying network...');
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 성공적인 응답을 캐시에 저장
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      console.log('✅ Network First: Network response cached');
      return networkResponse;
    }
    
    throw new Error(`Network response not ok: ${networkResponse.status}`);
  } catch (error) {
    console.log('⚠️ Network First: Network failed, trying cache...');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('📦 Network First: Serving cached response');
      return cachedResponse;
    }
    
    throw error;
  }
}

// Cache First 전략 (개선된 버전)
async function cacheFirst(request) {
  try {
    console.log('📦 Cache First: Checking cache...');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('✅ Cache First: Serving cached response');
      return cachedResponse;
    }
    
    console.log('🌐 Cache First: Cache miss, trying network...');
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 성공적인 응답을 캐시에 저장
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      console.log('✅ Cache First: Network response cached');
      return networkResponse;
    }
    
    throw new Error(`Network response not ok: ${networkResponse.status}`);
  } catch (error) {
    console.error('❌ Cache First failed:', error);
    throw error;
  }
}

// Stale While Revalidate 전략
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // 백그라운드에서 네트워크 요청 시작
  const networkResponsePromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
        console.log('🔄 Stale While Revalidate: Cache updated');
      }
      return response;
    })
    .catch((error) => {
      console.log('⚠️ Stale While Revalidate: Network update failed:', error);
      return null;
    });
  
  // 캐시된 응답이 있으면 즉시 반환
  if (cachedResponse) {
    console.log('📦 Stale While Revalidate: Serving stale response');
    return cachedResponse;
  }
  
  // 캐시된 응답이 없으면 네트워크 응답 대기
  console.log('🌐 Stale While Revalidate: No cache, waiting for network...');
  const networkResponse = await networkResponsePromise;
  
  if (networkResponse) {
    return networkResponse;
  }
  
  throw new Error('No cached response and network failed');
}

// 메시지 이벤트 처리 (캐시 관리용)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      })
    );
  }
});

console.log('🎯 Service Worker loaded successfully');
