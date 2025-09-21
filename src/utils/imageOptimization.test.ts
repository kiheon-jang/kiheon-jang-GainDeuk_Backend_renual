/**
 * 이미지 최적화 유틸리티 테스트
 */

import {
  getSupportedFormats,
  generateOptimizedImageUrl,
  generateSrcSet,
  calculateImageSize,
  preloadImage,
  createLazyImageLoader,
  generateBlurPlaceholder,
  validateImageOptions,
  getImageMimeType,
  getImageOptimizationStats,
  type ImageFormat,
  type ResponsiveBreakpoint,
  type ImageOptimizationOptions
} from './imageOptimization';

// Mock DOM APIs
const mockCanvas = {
  toDataURL: jest.fn((format) => {
    if (format === 'image/webp') return 'data:image/webp;base64,test';
    if (format === 'image/avif') return 'data:image/avif;base64,test';
    return 'data:image/jpeg;base64,test';
  })
};

Object.defineProperty(document, 'createElement', {
  value: jest.fn((tagName) => {
    if (tagName === 'canvas') {
      return {
        ...mockCanvas,
        width: 1,
        height: 1,
        getContext: jest.fn(() => ({
          fillStyle: '',
          fillRect: jest.fn(),
          filter: ''
        }))
      };
    }
    return {};
  }),
  writable: true
});

// Mock window.performance
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now())
  },
  writable: true
});

// Mock Image constructor
global.Image = jest.fn(() => ({
  onload: null,
  onerror: null,
  src: ''
})) as any;

describe('Image Optimization Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSupportedFormats', () => {
    it('should return supported image formats', () => {
      const formats = getSupportedFormats();
      
      expect(Array.isArray(formats)).toBe(true);
      expect(formats).toContain('jpeg');
      expect(formats).toContain('png');
      expect(formats).toContain('gif');
      expect(formats).toContain('svg');
    });

    it('should detect WebP support', () => {
      mockCanvas.toDataURL.mockReturnValue('data:image/webp;base64,test');
      
      const formats = getSupportedFormats();
      
      expect(formats).toContain('webp');
    });

    it('should detect AVIF support', () => {
      mockCanvas.toDataURL.mockReturnValue('data:image/avif;base64,test');
      
      const formats = getSupportedFormats();
      
      expect(formats).toContain('avif');
    });
  });

  describe('generateOptimizedImageUrl', () => {
    it('should generate optimized URL with parameters', () => {
      const url = generateOptimizedImageUrl('https://example.com/image.jpg', {
        width: 800,
        height: 600,
        format: 'webp',
        quality: 80
      });
      
      expect(url).toContain('w=800');
      expect(url).toContain('h=600');
      expect(url).toContain('f=webp');
      expect(url).toContain('q=80');
    });

    it('should return original URL when no CDN configured', () => {
      const originalUrl = 'https://example.com/image.jpg';
      const url = generateOptimizedImageUrl(originalUrl);
      
      expect(url).toBe(originalUrl);
    });
  });

  describe('generateSrcSet', () => {
    it('should generate srcset for multiple breakpoints', () => {
      const breakpoints: ResponsiveBreakpoint[] = [
        { width: 320, density: 1 },
        { width: 640, density: 1 },
        { width: 1280, density: 1 }
      ];
      
      const srcset = generateSrcSet('https://example.com/image.jpg', breakpoints, ['jpeg']);
      
      expect(srcset).toContain('320w');
      expect(srcset).toContain('640w');
      expect(srcset).toContain('1280w');
    });

    it('should use supported formats', () => {
      const breakpoints: ResponsiveBreakpoint[] = [
        { width: 320, density: 1 }
      ];
      
      const srcset = generateSrcSet('https://example.com/image.jpg', breakpoints, ['webp', 'jpeg']);
      
      expect(srcset).toContain('320w');
    });
  });

  describe('calculateImageSize', () => {
    it('should calculate size based on container width', () => {
      const size = calculateImageSize(800, undefined, 16/9);
      
      expect(size.width).toBe(800);
      expect(size.height).toBe(450); // 800 / (16/9)
    });

    it('should calculate size based on container height', () => {
      const size = calculateImageSize(undefined, 600, 16/9);
      
      expect(size.width).toBe(1067); // 600 * (16/9)
      expect(size.height).toBe(600);
    });

    it('should limit maximum size', () => {
      const size = calculateImageSize(3000, undefined, 16/9);
      
      expect(size.width).toBeLessThanOrEqual(1920);
      expect(size.height).toBeLessThanOrEqual(1080);
    });
  });

  describe('preloadImage', () => {
    it('should preload image successfully', async () => {
      const mockImage = {
        onload: null,
        onerror: null,
        src: ''
      };
      
      (global.Image as jest.Mock).mockReturnValue(mockImage);
      
      const promise = preloadImage('https://example.com/image.jpg');
      
      // Simulate successful load
      setTimeout(() => {
        if (mockImage.onload) {
          mockImage.onload();
        }
      }, 0);
      
      const result = await promise;
      expect(result).toBe(mockImage);
    });

    it('should handle image load error', async () => {
      const mockImage = {
        onload: null,
        onerror: null,
        src: ''
      };
      
      (global.Image as jest.Mock).mockReturnValue(mockImage);
      
      const promise = preloadImage('https://example.com/invalid.jpg');
      
      // Simulate error
      setTimeout(() => {
        if (mockImage.onerror) {
          mockImage.onerror();
        }
      }, 0);
      
      await expect(promise).rejects.toThrow();
    });
  });

  describe('createLazyImageLoader', () => {
    it('should create intersection observer', () => {
      const callback = jest.fn();
      const observer = createLazyImageLoader(callback);
      
      expect(observer).toBeDefined();
      expect(typeof observer.observe).toBe('function');
      expect(typeof observer.disconnect).toBe('function');
    });
  });

  describe('generateBlurPlaceholder', () => {
    it('should generate blur placeholder', () => {
      const placeholder = generateBlurPlaceholder(100, 100, 10);
      
      expect(placeholder).toContain('data:image/jpeg;base64,');
    });
  });

  describe('validateImageOptions', () => {
    it('should validate quality options', () => {
      const validOptions: ImageOptimizationOptions = {
        quality: {
          webp: 80,
          avif: 70,
          jpeg: 85,
          png: 90
        }
      };
      
      expect(validateImageOptions(validOptions)).toBe(true);
    });

    it('should reject invalid quality values', () => {
      const invalidOptions: ImageOptimizationOptions = {
        quality: {
          webp: 150, // Invalid: > 100
          jpeg: -10  // Invalid: < 0
        }
      };
      
      expect(validateImageOptions(invalidOptions)).toBe(false);
    });

    it('should validate breakpoints', () => {
      const validOptions: ImageOptimizationOptions = {
        breakpoints: [
          { width: 320, density: 1 },
          { width: 640, density: 2 }
        ]
      };
      
      expect(validateImageOptions(validOptions)).toBe(true);
    });

    it('should reject invalid breakpoints', () => {
      const invalidOptions: ImageOptimizationOptions = {
        breakpoints: [
          { width: 0, density: 1 }, // Invalid: width = 0
          { width: 640, density: 0.05 } // Invalid: density < 0.1
        ]
      };
      
      expect(validateImageOptions(invalidOptions)).toBe(false);
    });
  });

  describe('getImageMimeType', () => {
    it('should return correct MIME types', () => {
      expect(getImageMimeType('webp')).toBe('image/webp');
      expect(getImageMimeType('avif')).toBe('image/avif');
      expect(getImageMimeType('jpeg')).toBe('image/jpeg');
      expect(getImageMimeType('png')).toBe('image/png');
      expect(getImageMimeType('gif')).toBe('image/gif');
      expect(getImageMimeType('svg')).toBe('image/svg+xml');
    });
  });

  describe('getImageOptimizationStats', () => {
    it('should return optimization statistics', () => {
      // Mock document.querySelectorAll
      const mockImages = [
        { src: 'https://example.com/image.webp' },
        { src: 'https://example.com/image.jpg' }
      ];
      
      Object.defineProperty(document, 'querySelectorAll', {
        value: jest.fn(() => mockImages),
        writable: true
      });
      
      const stats = getImageOptimizationStats();
      
      expect(stats).toHaveProperty('supportedFormats');
      expect(stats).toHaveProperty('totalImages');
      expect(stats).toHaveProperty('optimizedImages');
      expect(stats).toHaveProperty('savings');
      expect(stats.totalImages).toBe(2);
    });
  });
});
