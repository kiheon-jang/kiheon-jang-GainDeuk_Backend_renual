/**
 * 프리로딩 유틸리티 테스트
 */

import {
  preloadManager,
  preloadCriticalResources,
  preloadPageResources,
  usePreloading,
  type PreloadResource,
  type PreloadResourceType
} from './preloading';

// Mock DOM APIs
const mockLinkElement = {
  rel: '',
  href: '',
  as: '',
  crossOrigin: '',
  media: '',
  type: '',
  onload: null,
  onerror: null,
  setAttribute: jest.fn()
};

Object.defineProperty(document, 'createElement', {
  value: jest.fn((tagName) => {
    if (tagName === 'link') {
      return mockLinkElement;
    }
    return {};
  }),
  writable: true
});

Object.defineProperty(document, 'head', {
  value: {
    appendChild: jest.fn()
  },
  writable: true
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
})) as any;

describe('Preloading Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    preloadManager.reset();
  });

  describe('preloadManager', () => {
    it('should preload resource successfully', async () => {
      const resource: PreloadResource = {
        href: 'https://example.com/script.js',
        options: { as: 'script' },
        priority: 'high'
      };

      // Mock successful load
      setTimeout(() => {
        if (mockLinkElement.onload) {
          mockLinkElement.onload();
        }
      }, 0);

      const result = await preloadManager.preloadResource(resource);

      expect(result).toBe(true);
      expect(document.createElement).toHaveBeenCalledWith('link');
      expect(document.head.appendChild).toHaveBeenCalledWith(mockLinkElement);
      expect(mockLinkElement.rel).toBe('preload');
      expect(mockLinkElement.href).toBe(resource.href);
      expect(mockLinkElement.as).toBe('script');
    });

    it('should handle preload failure', async () => {
      const resource: PreloadResource = {
        href: 'https://example.com/invalid.js',
        options: { as: 'script' }
      };

      // Mock error
      setTimeout(() => {
        if (mockLinkElement.onerror) {
          mockLinkElement.onerror();
        }
      }, 0);

      const result = await preloadManager.preloadResource(resource);

      expect(result).toBe(false);
    });

    it('should preload multiple resources', async () => {
      const resources: PreloadResource[] = [
        { href: 'https://example.com/script1.js', options: { as: 'script' } },
        { href: 'https://example.com/script2.js', options: { as: 'script' } }
      ];

      // Mock successful loads
      setTimeout(() => {
        if (mockLinkElement.onload) {
          mockLinkElement.onload();
        }
      }, 0);

      const result = await preloadManager.preloadResources(resources);

      expect(result.loaded).toHaveLength(2);
      expect(result.failed).toHaveLength(0);
    });

    it('should preload image', async () => {
      const src = 'https://example.com/image.jpg';

      // Mock successful load
      setTimeout(() => {
        if (mockLinkElement.onload) {
          mockLinkElement.onload();
        }
      }, 0);

      const result = await preloadManager.preloadImage(src, 'high');

      expect(result).toBe(true);
      expect(mockLinkElement.as).toBe('image');
    });

    it('should preload font', async () => {
      const href = 'https://example.com/font.woff2';

      // Mock successful load
      setTimeout(() => {
        if (mockLinkElement.onload) {
          mockLinkElement.onload();
        }
      }, 0);

      const result = await preloadManager.preloadFont(href, 'font/woff2');

      expect(result).toBe(true);
      expect(mockLinkElement.as).toBe('font');
      expect(mockLinkElement.type).toBe('font/woff2');
      expect(mockLinkElement.crossOrigin).toBe('anonymous');
    });

    it('should preload script', async () => {
      const href = 'https://example.com/script.js';

      // Mock successful load
      setTimeout(() => {
        if (mockLinkElement.onload) {
          mockLinkElement.onload();
        }
      }, 0);

      const result = await preloadManager.preloadScript(href, 'high');

      expect(result).toBe(true);
      expect(mockLinkElement.as).toBe('script');
    });

    it('should preload style', async () => {
      const href = 'https://example.com/style.css';

      // Mock successful load
      setTimeout(() => {
        if (mockLinkElement.onload) {
          mockLinkElement.onload();
        }
      }, 0);

      const result = await preloadManager.preloadStyle(href, 'high');

      expect(result).toBe(true);
      expect(mockLinkElement.as).toBe('style');
    });

    it('should preload fetch', async () => {
      const href = 'https://example.com/api/data';

      // Mock successful load
      setTimeout(() => {
        if (mockLinkElement.onload) {
          mockLinkElement.onload();
        }
      }, 0);

      const result = await preloadManager.preloadFetch(href, 'low');

      expect(result).toBe(true);
      expect(mockLinkElement.as).toBe('fetch');
      expect(mockLinkElement.crossOrigin).toBe('anonymous');
    });

    it('should preload on visible', () => {
      const mockElement = document.createElement('div');
      const resources: PreloadResource[] = [
        { href: 'https://example.com/script.js', options: { as: 'script' } }
      ];

      const cleanup = preloadManager.preloadOnVisible(mockElement, resources);

      expect(global.IntersectionObserver).toHaveBeenCalled();
      expect(typeof cleanup).toBe('function');
    });

    it('should preload on hover', () => {
      const mockElement = document.createElement('div');
      const resources: PreloadResource[] = [
        { href: 'https://example.com/script.js', options: { as: 'script' } }
      ];

      const cleanup = preloadManager.preloadOnHover(mockElement, resources);

      expect(typeof cleanup).toBe('function');
    });

    it('should track preload state', () => {
      const state = preloadManager.getPreloadState();

      expect(state).toHaveProperty('loaded');
      expect(state).toHaveProperty('loading');
      expect(state).toHaveProperty('failed');
    });

    it('should check resource status', () => {
      const href = 'https://example.com/script.js';

      expect(preloadManager.isResourceLoaded(href)).toBe(false);
      expect(preloadManager.isResourceLoading(href)).toBe(false);
      expect(preloadManager.isResourceFailed(href)).toBe(false);
    });

    it('should get preload statistics', () => {
      const stats = preloadManager.getPreloadStats();

      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('loaded');
      expect(stats).toHaveProperty('loading');
      expect(stats).toHaveProperty('failed');
      expect(stats).toHaveProperty('successRate');
    });
  });

  describe('preloadCriticalResources', () => {
    it('should preload critical resources', async () => {
      // Mock successful loads
      setTimeout(() => {
        if (mockLinkElement.onload) {
          mockLinkElement.onload();
        }
      }, 0);

      await preloadCriticalResources();

      expect(document.createElement).toHaveBeenCalledWith('link');
    });
  });

  describe('preloadPageResources', () => {
    it('should return dashboard resources', () => {
      const resources = preloadPageResources('dashboard');

      expect(Array.isArray(resources)).toBe(true);
      expect(resources.length).toBeGreaterThan(0);
    });

    it('should return trading resources', () => {
      const resources = preloadPageResources('trading');

      expect(Array.isArray(resources)).toBe(true);
      expect(resources.length).toBeGreaterThan(0);
    });

    it('should return empty array for unknown page', () => {
      const resources = preloadPageResources('unknown');

      expect(Array.isArray(resources)).toBe(true);
      expect(resources.length).toBe(0);
    });
  });

  describe('usePreloading', () => {
    it('should return preloading functions', () => {
      const preloading = usePreloading();

      expect(typeof preloading.preloadResource).toBe('function');
      expect(typeof preloading.preloadResources).toBe('function');
      expect(typeof preloading.preloadImage).toBe('function');
      expect(typeof preloading.preloadFont).toBe('function');
      expect(typeof preloading.preloadScript).toBe('function');
      expect(typeof preloading.preloadStyle).toBe('function');
      expect(typeof preloading.preloadFetch).toBe('function');
      expect(typeof preloading.preloadOnVisible).toBe('function');
      expect(typeof preloading.preloadOnHover).toBe('function');
      expect(typeof preloading.getPreloadState).toBe('function');
      expect(typeof preloading.getPreloadStats).toBe('function');
    });
  });
});
