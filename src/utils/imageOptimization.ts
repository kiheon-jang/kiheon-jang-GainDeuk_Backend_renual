/**
 * 이미지 최적화 유틸리티
 * WebP, AVIF 등 차세대 이미지 포맷 지원 및 반응형 이미지 처리
 */

// 지원하는 이미지 포맷
export type ImageFormat = 'webp' | 'avif' | 'jpeg' | 'png' | 'gif' | 'svg';

// 이미지 품질 설정
export interface ImageQuality {
  webp: number;
  avif: number;
  jpeg: number;
  png: number;
}

// 반응형 이미지 브레이크포인트
export interface ResponsiveBreakpoint {
  width: number;
  density?: number;
  format?: ImageFormat;
}

// 이미지 최적화 옵션
export interface ImageOptimizationOptions {
  quality?: Partial<ImageQuality>;
  formats?: ImageFormat[];
  breakpoints?: ResponsiveBreakpoint[];
  lazy?: boolean;
  placeholder?: boolean;
  blur?: number;
}

// 기본 품질 설정
const DEFAULT_QUALITY: ImageQuality = {
  webp: 80,
  avif: 70,
  jpeg: 85,
  png: 90
};

// 기본 브레이크포인트
const DEFAULT_BREAKPOINTS: ResponsiveBreakpoint[] = [
  { width: 320, density: 1 },
  { width: 640, density: 1 },
  { width: 768, density: 1 },
  { width: 1024, density: 1 },
  { width: 1280, density: 1 },
  { width: 1920, density: 1 },
  { width: 2560, density: 1 }
];

/**
 * 브라우저가 지원하는 이미지 포맷 감지
 */
export const getSupportedFormats = (): ImageFormat[] => {
  const formats: ImageFormat[] = ['jpeg', 'png', 'gif', 'svg'];
  
  // WebP 지원 확인
  const webpSupported = (() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  })();
  
  if (webpSupported) {
    formats.unshift('webp');
  }
  
  // AVIF 지원 확인
  const avifSupported = (() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  })();
  
  if (avifSupported) {
    formats.unshift('avif');
  }
  
  return formats;
};

/**
 * 이미지 URL 생성 (CDN 또는 최적화 서비스 사용)
 */
export const generateOptimizedImageUrl = (
  originalUrl: string,
  options: {
    width?: number;
    height?: number;
    format?: ImageFormat;
    quality?: number;
    blur?: number;
  } = {}
): string => {
  const { width, height, format, quality, blur } = options;
  
  // CDN 또는 이미지 최적화 서비스 URL 생성
  // 예: Cloudinary, ImageKit, 또는 자체 이미지 최적화 서비스
  const baseUrl = process.env.REACT_APP_IMAGE_CDN_URL || originalUrl;
  
  if (baseUrl === originalUrl) {
    // CDN이 없는 경우 원본 URL 반환
    return originalUrl;
  }
  
  const params = new URLSearchParams();
  
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (format) params.set('f', format);
  if (quality) params.set('q', quality.toString());
  if (blur) params.set('blur', blur.toString());
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * 반응형 이미지 srcset 생성
 */
export const generateSrcSet = (
  originalUrl: string,
  breakpoints: ResponsiveBreakpoint[] = DEFAULT_BREAKPOINTS,
  formats: ImageFormat[] = ['jpeg']
): string => {
  const supportedFormats = getSupportedFormats();
  const availableFormats = formats.filter(format => supportedFormats.includes(format));
  
  if (availableFormats.length === 0) {
    availableFormats.push('jpeg'); // fallback
  }
  
  const srcsetEntries: string[] = [];
  
  breakpoints.forEach(breakpoint => {
    const format = breakpoint.format || availableFormats[0];
    const density = breakpoint.density || 1;
    const width = breakpoint.width * density;
    
    const optimizedUrl = generateOptimizedImageUrl(originalUrl, {
      width,
      format,
      quality: DEFAULT_QUALITY[format as keyof ImageQuality]
    });
    
    srcsetEntries.push(`${optimizedUrl} ${width}w`);
  });
  
  return srcsetEntries.join(', ');
};

/**
 * 이미지 크기 계산 (화면 크기 기반)
 */
export const calculateImageSize = (
  containerWidth: number,
  containerHeight?: number,
  aspectRatio?: number
): { width: number; height: number } => {
  let width = containerWidth;
  let height = containerHeight;
  
  if (aspectRatio && !height) {
    height = width / aspectRatio;
  } else if (aspectRatio && !width) {
    width = height * aspectRatio;
  }
  
  // 최대 크기 제한
  const maxWidth = 1920;
  const maxHeight = 1080;
  
  if (width > maxWidth) {
    width = maxWidth;
    if (aspectRatio) {
      height = width / aspectRatio;
    }
  }
  
  if (height && height > maxHeight) {
    height = maxHeight;
    if (aspectRatio) {
      width = height * aspectRatio;
    }
  }
  
  return { width: Math.round(width), height: Math.round(height || 0) };
};

/**
 * 이미지 프리로딩
 */
export const preloadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * 이미지 지연 로딩 (Intersection Observer 사용)
 */
export const createLazyImageLoader = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

/**
 * 이미지 블러 플레이스홀더 생성
 */
export const generateBlurPlaceholder = (
  width: number,
  height: number,
  blur: number = 10
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // 그라데이션 배경 생성
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f0f0f0');
  gradient.addColorStop(1, '#e0e0e0');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // 블러 효과 적용
  ctx.filter = `blur(${blur}px)`;
  
  return canvas.toDataURL('image/jpeg', 0.1);
};

/**
 * 이미지 최적화 설정 검증
 */
export const validateImageOptions = (options: ImageOptimizationOptions): boolean => {
  if (options.quality) {
    const quality = options.quality;
    if (quality.webp && (quality.webp < 1 || quality.webp > 100)) return false;
    if (quality.avif && (quality.avif < 1 || quality.avif > 100)) return false;
    if (quality.jpeg && (quality.jpeg < 1 || quality.jpeg > 100)) return false;
    if (quality.png && (quality.png < 1 || quality.png > 100)) return false;
  }
  
  if (options.breakpoints) {
    for (const breakpoint of options.breakpoints) {
      if (breakpoint.width < 1) return false;
      if (breakpoint.density && breakpoint.density < 0.1) return false;
    }
  }
  
  return true;
};

/**
 * 이미지 포맷별 MIME 타입 반환
 */
export const getImageMimeType = (format: ImageFormat): string => {
  const mimeTypes: Record<ImageFormat, string> = {
    webp: 'image/webp',
    avif: 'image/avif',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    svg: 'image/svg+xml'
  };
  
  return mimeTypes[format];
};

/**
 * 이미지 최적화 통계
 */
export const getImageOptimizationStats = (): {
  supportedFormats: ImageFormat[];
  totalImages: number;
  optimizedImages: number;
  savings: number;
} => {
  const supportedFormats = getSupportedFormats();
  const images = document.querySelectorAll('img');
  const totalImages = images.length;
  
  let optimizedImages = 0;
  let totalSavings = 0;
  
  images.forEach(img => {
    const src = img.src;
    if (src.includes('webp') || src.includes('avif')) {
      optimizedImages++;
      // 간단한 절약 계산 (실제로는 더 정교한 계산 필요)
      totalSavings += 0.3; // 30% 절약 가정
    }
  });
  
  return {
    supportedFormats,
    totalImages,
    optimizedImages,
    savings: totalSavings
  };
};
