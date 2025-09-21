# 성능 모니터링 및 최적화 가이드

이 문서는 GainDeuk 애플리케이션의 성능 모니터링 및 최적화 기능에 대해 설명합니다.

## 📊 성능 모니터링

### 실시간 성능 메트릭

개발 환경에서 실시간으로 다음 성능 메트릭을 모니터링할 수 있습니다:

- **FPS (Frames Per Second)**: 애니메이션 성능
- **렌더링 시간**: 컴포넌트 렌더링 소요 시간
- **메모리 사용량**: JavaScript 힙 메모리 사용량
- **업데이트 횟수**: 컴포넌트 리렌더링 횟수

### 성능 모니터링 컴포넌트

```tsx
import PerformanceMonitor from '@/components/common/PerformanceMonitor';

// 기본 사용법
<PerformanceMonitor />

// 위치 지정
<PerformanceMonitor position="top-left" />

// 표시/숨김 제어
<PerformanceMonitor show={false} />
```

### 성능 모니터링 훅

```tsx
import { usePerformanceMonitoring } from '@/hooks/usePerformance';

const MyComponent = () => {
  const { metrics, markRenderStart, markRenderEnd } = usePerformanceMonitoring('MyComponent');
  
  // 렌더링 시작 마킹
  markRenderStart();
  
  // 렌더링 완료 마킹
  markRenderEnd();
  
  return <div>컴포넌트 내용</div>;
};
```

## 🚀 성능 최적화

### 코드 스플리팅

페이지별로 코드를 분할하여 초기 로딩 시간을 단축합니다:

```tsx
// 페이지 컴포넌트 지연 로딩
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const TradingGuide = lazy(() => import('@/pages/TradingGuide'));

// Suspense로 로딩 상태 처리
<Suspense fallback={<PageLoadingFallback />}>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/trading" element={<TradingGuide />} />
  </Routes>
</Suspense>
```

### 번들 최적화

Vite 설정을 통해 번들을 최적화합니다:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['lucide-react', 'react-hot-toast'],
          'styled-vendor': ['styled-components'],
        }
      }
    }
  }
});
```

### 컴포넌트 최적화

React.memo와 useMemo를 활용한 컴포넌트 최적화:

```tsx
import React, { memo, useMemo } from 'react';

const OptimizedComponent = memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: true
    }));
  }, [data]);

  return <div>{/* 컴포넌트 내용 */}</div>;
});
```

## 💾 캐싱 전략

### 서비스 워커 캐싱

서비스 워커를 통해 정적 리소스와 API 응답을 캐싱합니다:

```typescript
// 서비스 워커 등록
import { registerServiceWorker } from '@/utils/serviceWorker';

useEffect(() => {
  registerServiceWorker();
}, []);
```

### React Query 캐싱

API 응답을 자동으로 캐싱하고 관리합니다:

```tsx
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['coins'],
  queryFn: fetchCoins,
  staleTime: 5 * 60 * 1000, // 5분
  cacheTime: 10 * 60 * 1000, // 10분
});
```

## 🔧 성능 설정

### 성능 설정 컴포넌트

설정 페이지에서 다음 성능 관련 설정을 관리할 수 있습니다:

- **서비스 워커 상태**: 등록, 제어 상태 확인
- **캐시 관리**: 캐시 크기 확인 및 삭제
- **네트워크 상태**: 온라인/오프라인 상태 모니터링
- **알림 설정**: 푸시 알림 권한 및 테스트

### 성능 유틸리티

```typescript
import { 
  mark, 
  measure, 
  measureApiRequest, 
  measureUserInteraction 
} from '@/utils/performance';

// 성능 마크 생성
mark('component-render-start', 'MyComponent');

// 성능 측정
const duration = measure(
  'component-render',
  'component-render-start',
  'component-render-end',
  'MyComponent'
);

// API 요청 시간 측정
const result = await measureApiRequest('fetchCoins', () => fetchCoins());

// 사용자 상호작용 시간 측정
const handleClick = measureUserInteraction('button-click', () => {
  // 클릭 처리 로직
});
```

## 📱 모바일 최적화

### 터치 친화적 UI

터치 디바이스를 위한 최적화된 UI 컴포넌트:

```tsx
import { touchFriendly, touchFriendlyButton } from '@/utils/touch';

const TouchButton = styled.button`
  ${touchFriendlyButton}
  /* 추가 스타일 */
`;
```

### 반응형 디자인

다양한 화면 크기에 최적화된 레이아웃:

```tsx
import { media, responsiveTypography } from '@/utils/responsive';

const ResponsiveComponent = styled.div`
  ${responsiveTypography.h1}
  
  ${media.max.md`
    font-size: 1.5rem;
  `}
  
  ${media.max.sm`
    font-size: 1.25rem;
  `}
`;
```

## 🚨 성능 경고

### 자동 성능 경고

다음 조건에서 자동으로 성능 경고가 표시됩니다:

- 렌더링 시간이 16ms (60fps)를 초과하는 경우
- 컴포넌트 업데이트 횟수가 10회를 초과하는 경우
- 메모리 사용량이 90%를 초과하는 경우

### 성능 경고 훅

```tsx
import { usePerformanceWarnings } from '@/hooks/usePerformance';

const MyComponent = () => {
  const { checkPerformance } = usePerformanceWarnings();
  const { metrics } = usePerformanceMonitoring('MyComponent');
  
  useEffect(() => {
    const warnings = checkPerformance(metrics);
    if (warnings.length > 0) {
      console.warn('Performance warnings:', warnings);
    }
  }, [metrics, checkPerformance]);
  
  return <div>컴포넌트 내용</div>;
};
```

## 📈 성능 측정 도구

### 개발자 도구

개발 환경에서 다음 도구를 활용할 수 있습니다:

1. **Performance Monitor**: 실시간 성능 메트릭 표시
2. **Service Worker DevTools**: 캐시 상태 및 관리
3. **React DevTools**: 컴포넌트 렌더링 분석
4. **Network Tab**: API 요청 및 응답 시간 분석

### 성능 테스트

```typescript
import { logResponsiveInfo, setupResponsiveTest } from '@/utils/responsiveTest';

// 반응형 정보 로깅
logResponsiveInfo();

// 반응형 테스트 설정
setupResponsiveTest();
```

## 🔍 성능 디버깅

### 성능 문제 해결

1. **느린 렌더링**: React.memo, useMemo, useCallback 활용
2. **메모리 누수**: useEffect 정리 함수 확인
3. **번들 크기**: 코드 스플리팅 및 트리 셰이킹 확인
4. **API 지연**: React Query 캐싱 및 백그라운드 업데이트 활용

### 성능 프로파일링

```typescript
import { mark, measure } from '@/utils/performance';

// 성능 프로파일링 시작
mark('profile-start', 'MyComponent');

// 작업 수행
performExpensiveOperation();

// 성능 프로파일링 종료
mark('profile-end', 'MyComponent');
const duration = measure(
  'profile',
  'profile-start',
  'profile-end',
  'MyComponent'
);
```

## 📚 추가 리소스

- [React Performance](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [React Query Performance](https://tanstack.com/query/latest/docs/react/guides/performance)
