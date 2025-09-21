/**
 * 최적화된 이미지 컴포넌트
 * WebP, AVIF 지원, 반응형 이미지, 지연 로딩, 블러 플레이스홀더 포함
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { 
  generateOptimizedImageUrl, 
  generateSrcSet, 
  calculateImageSize,
  preloadImage,
  createLazyImageLoader,
  generateBlurPlaceholder,
  getSupportedFormats,
  type ImageFormat,
  type ResponsiveBreakpoint
} from '@/utils/imageOptimization';
import { getCoinIcon, getCoinColor } from '@/utils/imageUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  formats?: ImageFormat[];
  quality?: number;
  breakpoints?: ResponsiveBreakpoint[];
  lazy?: boolean;
  placeholder?: boolean;
  blur?: number;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  sizes?: string;
  symbol?: string; // 암호화폐 심볼 (아이콘 기반 시스템용)
}

const ImageContainer = styled.div<{ 
  aspectRatio?: number; 
  width?: number; 
  height?: number;
  isLoading?: boolean;
}>`
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  
  ${({ aspectRatio, width, height }) => {
    if (aspectRatio) {
      return css`
        aspect-ratio: ${aspectRatio};
        width: ${width ? `${width}px` : '100%'};
      `;
    }
    
    if (width && height) {
      return css`
        width: ${width}px;
        height: ${height}px;
      `;
    }
    
    return css`
      width: ${width ? `${width}px` : '100%'};
      height: ${height ? `${height}px` : 'auto'};
    `;
  }}
  
  ${({ isLoading }) => isLoading && css`
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        ${({ theme }) => theme.colors.gray[200]} 25%,
        ${({ theme }) => theme.colors.gray[100]} 50%,
        ${({ theme }) => theme.colors.gray[200]} 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
  `}
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const StyledImage = styled.img<{ 
  isLoaded: boolean; 
  hasError: boolean;
  blur?: number;
}>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: ${({ theme }) => theme.transitions.NORMAL};
  opacity: ${({ isLoaded, hasError }) => isLoaded && !hasError ? 1 : 0};
  
  ${({ blur, isLoaded }) => blur && !isLoaded && css`
    filter: blur(${blur}px);
  `}
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ErrorPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.fonts.size.SM};
  text-align: center;
  padding: 1rem;
`;

const BlurPlaceholder = styled.div<{ blurDataUrl: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${({ blurDataUrl }) => blurDataUrl});
  background-size: cover;
  background-position: center;
  filter: blur(10px);
  transform: scale(1.1);
  transition: opacity ${({ theme }) => theme.transitions.NORMAL};
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
  border-top: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

const IconContainer = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: ${({ $color }) => $color}20;
  border-radius: 50%;
  border: 2px solid ${({ $color }) => $color}40;
`;

const IconText = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  aspectRatio,
  formats = ['webp', 'jpeg'],
  quality = 80,
  breakpoints,
  lazy = true,
  placeholder = true,
  blur = 10,
  className,
  onLoad,
  onError,
  priority = false,
  sizes = '100vw',
  symbol
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [blurDataUrl, setBlurDataUrl] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 지원하는 포맷 확인
  const supportedFormats = getSupportedFormats();
  const availableFormats = formats.filter(format => supportedFormats.includes(format));
  const primaryFormat = availableFormats[0] || 'jpeg';

  // 이미지 크기 계산
  const imageSize = calculateImageSize(width || 800, height, aspectRatio);

  // 최적화된 이미지 URL 생성
  const optimizedSrc = generateOptimizedImageUrl(src, {
    width: imageSize.width,
    height: imageSize.height,
    format: primaryFormat,
    quality
  });

  // 아이콘 기반 시스템 사용 여부 확인
  const useIconSystem = optimizedSrc === 'icon-based' || src.includes('cryptologos.cc');
  
  // 아이콘 정보 가져오기
  const coinIcon = symbol ? getCoinIcon(symbol) : '₿';
  const coinColor = symbol ? getCoinColor(symbol) : '#6B7280';

  // srcset 생성
  const srcSet = generateSrcSet(src, breakpoints, availableFormats);

  // 블러 플레이스홀더 생성
  useEffect(() => {
    if (placeholder && imageSize.width && imageSize.height) {
      const placeholder = generateBlurPlaceholder(imageSize.width, imageSize.height, blur);
      setBlurDataUrl(placeholder);
    }
  }, [placeholder, imageSize.width, imageSize.height, blur]);

  // 지연 로딩 처리
  useEffect(() => {
    if (!lazy || priority) return;

    const observer = createLazyImageLoader(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority]);

  // 이미지 로드 처리
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(false);
    onError?.();
  }, [onError]);

  // 이미지 프리로딩
  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      preloadImage(optimizedSrc)
        .then(() => {
          if (imgRef.current) {
            imgRef.current.src = optimizedSrc;
          }
        })
        .catch(handleError);
    }
  }, [isInView, isLoaded, hasError, optimizedSrc, handleError]);

  // 아이콘 기반 시스템 렌더링
  if (useIconSystem) {
    return (
      <ImageContainer
        ref={containerRef}
        aspectRatio={aspectRatio}
        width={width}
        height={height}
        className={className}
      >
        <IconContainer $color={coinColor}>
          <IconText>{coinIcon}</IconText>
        </IconContainer>
      </ImageContainer>
    );
  }

  // 에러 상태 렌더링
  if (hasError) {
    return (
      <ImageContainer
        ref={containerRef}
        aspectRatio={aspectRatio}
        width={width}
        height={height}
        className={className}
      >
        <ErrorPlaceholder>
          <div>이미지를 불러올 수 없습니다</div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
            {alt}
          </div>
        </ErrorPlaceholder>
      </ImageContainer>
    );
  }

  return (
    <ImageContainer
      ref={containerRef}
      aspectRatio={aspectRatio}
      width={width}
      height={height}
      isLoading={!isLoaded && isInView}
      className={className}
    >
      {/* 블러 플레이스홀더 */}
      {blurDataUrl && !isLoaded && isInView && (
        <BlurPlaceholder blurDataUrl={blurDataUrl} />
      )}

      {/* 로딩 스피너 */}
      {!isLoaded && isInView && (
        <LoadingSpinner />
      )}

      {/* 최적화된 이미지 */}
      {isInView && (
        <StyledImage
          ref={imgRef}
          src={optimizedSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          isLoaded={isLoaded}
          hasError={hasError}
          blur={blur}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy && !priority ? 'lazy' : 'eager'}
          decoding="async"
        />
      )}
    </ImageContainer>
  );
};

export default OptimizedImage;
