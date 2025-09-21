/**
 * 이미지 갤러리 컴포넌트
 * 최적화된 이미지들을 그리드 형태로 표시
 */

import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Grid, Maximize2, Download, Share2, Heart } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { media, responsiveSpacing } from '@/utils/responsive';
import { GRID_SYSTEM } from '@/constants';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: {
    desktop?: number;
    tablet?: number;
    mobile?: number;
  };
  gap?: {
    desktop?: keyof typeof GRID_SYSTEM.GRID_GAP;
    tablet?: keyof typeof GRID_SYSTEM.GRID_GAP;
    mobile?: keyof typeof GRID_SYSTEM.GRID_GAP;
  };
  showLightbox?: boolean;
  showActions?: boolean;
  onImageClick?: (image: GalleryImage, index: number) => void;
  onImageDownload?: (image: GalleryImage) => void;
  onImageShare?: (image: GalleryImage) => void;
  onImageLike?: (image: GalleryImage) => void;
  className?: string;
}

const GalleryContainer = styled.div`
  width: 100%;
`;

const GalleryGrid = styled.div<{
  columns: { desktop: number; tablet: number; mobile: number };
  gap: { desktop: string; tablet: string; mobile: string };
}>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns.desktop}, 1fr);
  gap: ${({ gap }) => gap.desktop};

  ${media.max.md`
    grid-template-columns: repeat(${({ columns }) => columns.tablet}, 1fr);
    gap: ${({ gap }) => gap.tablet};
  `}

  ${media.max.sm`
    grid-template-columns: repeat(${({ columns }) => columns.mobile}, 1fr);
    gap: ${({ gap }) => gap.mobile};
  `}
`;

const ImageItem = styled.div`
  position: relative;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.primary};
  box-shadow: ${({ theme }) => theme.shadows.SM};
  transition: ${({ theme }) => theme.transitions.NORMAL};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.LG};
    transform: translateY(-2px);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 60%,
    rgba(0, 0, 0, 0.7) 100%
  );
  opacity: 0;
  transition: ${({ theme }) => theme.transitions.FAST};
  display: flex;
  align-items: flex-end;
  padding: 1rem;

  ${ImageItem}:hover & {
    opacity: 1;
  }
`;

const ImageInfo = styled.div`
  color: white;
  width: 100%;
`;

const ImageTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  margin: 0 0 0.25rem 0;
  line-height: 1.2;
`;

const ImageDescription = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.XS};
  margin: 0;
  opacity: 0.9;
  line-height: 1.3;
`;

const ImageActions = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: ${({ theme }) => theme.transitions.FAST};

  ${ImageItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.FAST};
  backdrop-filter: blur(10px);

  &:hover {
    background: white;
    transform: scale(1.1);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  margin: 0;
`;

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  columns = {
    desktop: 4,
    tablet: 3,
    mobile: 2
  },
  gap = {
    desktop: 'DESKTOP',
    tablet: 'TABLET',
    mobile: 'MOBILE'
  },
  showLightbox = true,
  showActions = true,
  onImageClick,
  onImageDownload,
  onImageShare,
  onImageLike,
  className
}) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const handleImageClick = useCallback((image: GalleryImage, index: number) => {
    if (showLightbox) {
      setSelectedImage(image);
    }
    onImageClick?.(image, index);
  }, [showLightbox, onImageClick]);

  const handleDownload = useCallback((e: React.MouseEvent, image: GalleryImage) => {
    e.stopPropagation();
    onImageDownload?.(image);
  }, [onImageDownload]);

  const handleShare = useCallback((e: React.MouseEvent, image: GalleryImage) => {
    e.stopPropagation();
    onImageShare?.(image);
  }, [onImageShare]);

  const handleLike = useCallback((e: React.MouseEvent, image: GalleryImage) => {
    e.stopPropagation();
    onImageLike?.(image);
  }, [onImageLike]);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);

  if (images.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>
          <Grid size={48} />
        </EmptyStateIcon>
        <EmptyStateText>표시할 이미지가 없습니다</EmptyStateText>
      </EmptyState>
    );
  }

  const gapValues = {
    desktop: GRID_SYSTEM.GRID_GAP[gap.desktop],
    tablet: GRID_SYSTEM.GRID_GAP[gap.tablet],
    mobile: GRID_SYSTEM.GRID_GAP[gap.mobile]
  };

  return (
    <GalleryContainer className={className}>
      <GalleryGrid columns={columns} gap={gapValues}>
        {images.map((image, index) => (
          <ImageItem
            key={image.id}
            onClick={() => handleImageClick(image, index)}
          >
            <OptimizedImage
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              aspectRatio={image.aspectRatio}
              formats={['webp', 'avif', 'jpeg']}
              quality={85}
              lazy={true}
              placeholder={true}
              sizes={`(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw`}
            />
            
            {(image.title || image.description) && (
              <ImageOverlay>
                <ImageInfo>
                  {image.title && <ImageTitle>{image.title}</ImageTitle>}
                  {image.description && <ImageDescription>{image.description}</ImageDescription>}
                </ImageInfo>
              </ImageOverlay>
            )}
            
            {showActions && (
              <ImageActions>
                <ActionButton
                  onClick={(e) => handleDownload(e, image)}
                  title="다운로드"
                >
                  <Download size={16} />
                </ActionButton>
                <ActionButton
                  onClick={(e) => handleShare(e, image)}
                  title="공유"
                >
                  <Share2 size={16} />
                </ActionButton>
                <ActionButton
                  onClick={(e) => handleLike(e, image)}
                  title="좋아요"
                >
                  <Heart size={16} />
                </ActionButton>
              </ImageActions>
            )}
          </ImageItem>
        ))}
      </GalleryGrid>
    </GalleryContainer>
  );
};

export default ImageGallery;
