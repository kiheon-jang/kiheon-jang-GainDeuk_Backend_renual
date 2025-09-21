/**
 * 리소스 프리로딩 유틸리티
 * 중요 리소스들을 미리 로딩하여 성능 최적화
 */

// 프리로딩 리소스 타입
export type PreloadResourceType = 'script' | 'style' | 'image' | 'font' | 'fetch';

// 프리로딩 옵션
export interface PreloadOptions {
  as?: PreloadResourceType;
  crossorigin?: 'anonymous' | 'use-credentials';
  media?: string;
  type?: string;
  fetchpriority?: 'high' | 'low' | 'auto';
}

// 프리로딩 리소스 정의
export interface PreloadResource {
  href: string;
  options?: PreloadOptions;
  priority?: 'high' | 'medium' | 'low';
}

// 프리로딩 상태
interface PreloadState {
  loaded: Set<string>;
  loading: Set<string>;
  failed: Set<string>;
}

class PreloadManager {
  private state: PreloadState = {
    loaded: new Set(),
    loading: new Set(),
    failed: new Set()
  };

  private observers: Map<string, IntersectionObserver> = new Map();

  /**
   * 리소스 프리로딩
   */
  async preloadResource(resource: PreloadResource): Promise<boolean> {
    const { href, options = {}, priority = 'medium' } = resource;

    // 이미 로드되었거나 로딩 중인 경우
    if (this.state.loaded.has(href) || this.state.loading.has(href)) {
      return this.state.loaded.has(href);
    }

    this.state.loading.add(href);

    try {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      
      if (options.as) link.as = options.as;
      if (options.crossorigin) link.crossOrigin = options.crossorigin;
      if (options.media) link.media = options.media;
      if (options.type) link.type = options.type;
      if (options.fetchpriority) link.setAttribute('fetchpriority', options.fetchpriority);

      // 우선순위에 따른 처리
      if (priority === 'high') {
        link.setAttribute('fetchpriority', 'high');
      }

      // DOM에 추가
      document.head.appendChild(link);

      // 로드 완료 대기
      await new Promise<void>((resolve, reject) => {
        link.onload = () => {
          this.state.loaded.add(href);
          this.state.loading.delete(href);
          resolve();
        };
        
        link.onerror = () => {
          this.state.failed.add(href);
          this.state.loading.delete(href);
          reject(new Error(`Failed to preload: ${href}`));
        };

        // 타임아웃 설정 (10초)
        const timeoutId = setTimeout(() => {
          if (this.state.loading.has(href)) {
            this.state.failed.add(href);
            this.state.loading.delete(href);
            reject(new Error(`Preload timeout: ${href}`));
          }
        }, 10000);

        // 성공/실패 시 타임아웃 클리어
        const originalOnload = link.onload;
        const originalOnerror = link.onerror;
        
        link.onload = (event) => {
          clearTimeout(timeoutId);
          if (originalOnload) originalOnload.call(link, event);
        };
        
        link.onerror = (event) => {
          clearTimeout(timeoutId);
          if (originalOnerror) originalOnerror.call(link, event);
        };
      });

      return true;
    } catch (error) {
      console.warn(`Failed to preload resource: ${href}`, error);
      return false;
    }
  }

  /**
   * 여러 리소스 동시 프리로딩
   */
  async preloadResources(resources: PreloadResource[]): Promise<{
    loaded: string[];
    failed: string[];
  }> {
    const results = await Promise.allSettled(
      resources.map(resource => this.preloadResource(resource))
    );

    const loaded: string[] = [];
    const failed: string[] = [];

    results.forEach((result, index) => {
      const resource = resources[index];
      if (result.status === 'fulfilled' && result.value) {
        loaded.push(resource.href);
      } else {
        failed.push(resource.href);
      }
    });

    return { loaded, failed };
  }

  /**
   * 이미지 프리로딩
   */
  async preloadImage(src: string, priority: 'high' | 'medium' | 'low' = 'medium'): Promise<boolean> {
    return this.preloadResource({
      href: src,
      options: { as: 'image' },
      priority
    });
  }

  /**
   * 폰트 프리로딩
   */
  async preloadFont(href: string, type: string = 'font/woff2'): Promise<boolean> {
    return this.preloadResource({
      href,
      options: { as: 'font', type, crossorigin: 'anonymous' },
      priority: 'high'
    });
  }

  /**
   * 스크립트 프리로딩
   */
  async preloadScript(href: string, priority: 'high' | 'medium' | 'low' = 'medium'): Promise<boolean> {
    return this.preloadResource({
      href,
      options: { as: 'script' },
      priority
    });
  }

  /**
   * CSS 프리로딩
   */
  async preloadStyle(href: string, priority: 'high' | 'medium' | 'low' = 'high'): Promise<boolean> {
    return this.preloadResource({
      href,
      options: { as: 'style' },
      priority
    });
  }

  /**
   * API 엔드포인트 프리로딩 (조건부)
   */
  async preloadFetch(href: string, _priority: 'high' | 'medium' | 'low' = 'low'): Promise<boolean> {
    // 이미 로드되었거나 로딩 중인 경우 스킵
    if (this.state.loaded.has(href) || this.state.loading.has(href)) {
      return this.state.loaded.has(href);
    }

    // fetch preload는 실제 요청과 동시에 발생해야 하므로
    // 단순히 리소스 상태만 기록하고 실제 fetch는 API 호출 시점에 수행
    this.state.loaded.add(href);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📡 API endpoint marked for preload: ${href}`);
    }
    
    return true;
  }

  /**
   * 뷰포트에 들어올 때 프리로딩
   */
  preloadOnVisible(
    element: HTMLElement,
    resources: PreloadResource[],
    options: IntersectionObserverInit = {}
  ): () => void {
    const defaultOptions: IntersectionObserverInit = {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.preloadResources(resources);
          observer.unobserve(entry.target);
        }
      });
    }, defaultOptions);

    observer.observe(element);

    // 정리 함수 반환
    return () => {
      observer.disconnect();
    };
  }

  /**
   * 마우스 호버 시 프리로딩
   */
  preloadOnHover(
    element: HTMLElement,
    resources: PreloadResource[]
  ): () => void {
    let hasPreloaded = false;

    const handleMouseEnter = () => {
      if (!hasPreloaded) {
        hasPreloaded = true;
        this.preloadResources(resources);
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);

    // 정리 함수 반환
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
    };
  }

  /**
   * 프리로딩 상태 확인
   */
  getPreloadState(): PreloadState {
    return {
      loaded: new Set(this.state.loaded),
      loading: new Set(this.state.loading),
      failed: new Set(this.state.failed)
    };
  }

  /**
   * 특정 리소스 상태 확인
   */
  isResourceLoaded(href: string): boolean {
    return this.state.loaded.has(href);
  }

  /**
   * 특정 리소스 로딩 중인지 확인
   */
  isResourceLoading(href: string): boolean {
    return this.state.loading.has(href);
  }

  /**
   * 특정 리소스 실패했는지 확인
   */
  isResourceFailed(href: string): boolean {
    return this.state.failed.has(href);
  }

  /**
   * 프리로딩 통계
   */
  getPreloadStats(): {
    total: number;
    loaded: number;
    loading: number;
    failed: number;
    successRate: number;
  } {
    const total = this.state.loaded.size + this.state.loading.size + this.state.failed.size;
    const loaded = this.state.loaded.size;
    const loading = this.state.loading.size;
    const failed = this.state.failed.size;
    const successRate = total > 0 ? (loaded / total) * 100 : 0;

    return {
      total,
      loaded,
      loading,
      failed,
      successRate
    };
  }

  /**
   * 프리로딩 상태 초기화
   */
  reset(): void {
    this.state = {
      loaded: new Set(),
      loading: new Set(),
      failed: new Set()
    };

    // 모든 옵저버 정리
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// 싱글톤 인스턴스
export const preloadManager = new PreloadManager();

/**
 * 중요 리소스 자동 프리로딩 (조건부)
 */
export const preloadCriticalResources = async (): Promise<void> => {
  // 실제로 존재하고 즉시 사용될 리소스만 preload
  const criticalResources: PreloadResource[] = [
    // 폰트는 CSS에서 자동으로 로드되므로 preload 제거
    // API는 실제 호출 시점에 preload하도록 변경
  ];

  try {
    if (criticalResources.length > 0) {
      const { loaded, failed } = await preloadManager.preloadResources(criticalResources);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🚀 Critical resources preloaded:', { loaded, failed });
      }
    }
  } catch (error) {
    console.warn('⚠️ Failed to preload critical resources:', error);
  }
};

/**
 * 페이지별 리소스 프리로딩 (조건부)
 */
export const preloadPageResources = (pageName: string): PreloadResource[] => {
  const pageResources: Record<string, PreloadResource[]> = {
    dashboard: [
      // 대시보드는 즉시 로드되므로 API preload 제거
    ],
    trading: [
      // 매매 페이지는 실제 사용 시점에 preload
    ],
    profile: [
      // 프로필 페이지는 실제 사용 시점에 preload
    ],
    coins: [
      // 코인 목록은 실제 사용 시점에 preload
    ],
    settings: [
      // 설정 페이지는 실제 사용 시점에 preload
    ]
  };

  return pageResources[pageName] || [];
};

/**
 * 페이지 진입 시 필요한 리소스만 preload
 */
export const preloadOnPageEnter = async (pageName: string): Promise<void> => {
  const resources = preloadPageResources(pageName);
  
  if (resources.length > 0) {
    try {
      const { loaded, failed } = await preloadManager.preloadResources(resources);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 ${pageName} page resources preloaded:`, { loaded, failed });
      }
    } catch (error) {
      console.warn(`⚠️ Failed to preload ${pageName} page resources:`, error);
    }
  }
};

/**
 * 프리로딩 훅 (React용)
 */
export const usePreloading = () => {
  return {
    preloadResource: preloadManager.preloadResource.bind(preloadManager),
    preloadResources: preloadManager.preloadResources.bind(preloadManager),
    preloadImage: preloadManager.preloadImage.bind(preloadManager),
    preloadFont: preloadManager.preloadFont.bind(preloadManager),
    preloadScript: preloadManager.preloadScript.bind(preloadManager),
    preloadStyle: preloadManager.preloadStyle.bind(preloadManager),
    preloadFetch: preloadManager.preloadFetch.bind(preloadManager),
    preloadOnVisible: preloadManager.preloadOnVisible.bind(preloadManager),
    preloadOnHover: preloadManager.preloadOnHover.bind(preloadManager),
    getPreloadState: preloadManager.getPreloadState.bind(preloadManager),
    getPreloadStats: preloadManager.getPreloadStats.bind(preloadManager)
  };
};
