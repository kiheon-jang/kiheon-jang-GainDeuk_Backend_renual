import { css } from 'styled-components';
import { BREAKPOINTS, MEDIA_QUERIES, GRID_SYSTEM } from '@/constants';

/**
 * 반응형 디자인을 위한 미디어 쿼리 헬퍼 함수들
 */

// 미디어 쿼리 템플릿
export const media = {
  // 최소 너비 기준
  min: {
    xs: (styles: any) => css`
      @media ${MEDIA_QUERIES.min.xs} {
        ${styles}
      }
    `,
    sm: (styles: any) => css`
      @media ${MEDIA_QUERIES.min.sm} {
        ${styles}
      }
    `,
    md: (styles: any) => css`
      @media ${MEDIA_QUERIES.min.md} {
        ${styles}
      }
    `,
    lg: (styles: any) => css`
      @media ${MEDIA_QUERIES.min.lg} {
        ${styles}
      }
    `,
    xl: (styles: any) => css`
      @media ${MEDIA_QUERIES.min.xl} {
        ${styles}
      }
    `,
    '2xl': (styles: any) => css`
      @media ${MEDIA_QUERIES.min['2xl']} {
        ${styles}
      }
    `,
  },
  
  // 최대 너비 기준
  max: {
    xs: (styles: any) => css`
      @media ${MEDIA_QUERIES.max.xs} {
        ${styles}
      }
    `,
    sm: (styles: any) => css`
      @media ${MEDIA_QUERIES.max.sm} {
        ${styles}
      }
    `,
    md: (styles: any) => css`
      @media ${MEDIA_QUERIES.max.md} {
        ${styles}
      }
    `,
    lg: (styles: any) => css`
      @media ${MEDIA_QUERIES.max.lg} {
        ${styles}
      }
    `,
    xl: (styles: any) => css`
      @media ${MEDIA_QUERIES.max.xl} {
        ${styles}
      }
    `,
    '2xl': (styles: any) => css`
      @media ${MEDIA_QUERIES.max['2xl']} {
        ${styles}
      }
    `,
  },
  
  // 범위 기준
  between: {
    xs_sm: (styles: any) => css`
      @media ${MEDIA_QUERIES.between.xs_sm} {
        ${styles}
      }
    `,
    sm_md: (styles: any) => css`
      @media ${MEDIA_QUERIES.between.sm_md} {
        ${styles}
      }
    `,
    md_lg: (styles: any) => css`
      @media ${MEDIA_QUERIES.between.md_lg} {
        ${styles}
      }
    `,
    lg_xl: (styles: any) => css`
      @media ${MEDIA_QUERIES.between.lg_xl} {
        ${styles}
      }
    `,
    xl_2xl: (styles: any) => css`
      @media ${MEDIA_QUERIES.between.xl_2xl} {
        ${styles}
      }
    `,
  },
};

// 디바이스별 스타일링
export const device = {
  mobile: (styles: any) => css`
    @media ${MEDIA_QUERIES.max.sm} {
      ${styles}
    }
  `,
  tablet: (styles: any) => css`
    @media ${MEDIA_QUERIES.between.sm_md} {
      ${styles}
    }
  `,
  desktop: (styles: any) => css`
    @media ${MEDIA_QUERIES.min.lg} {
      ${styles}
    }
  `,
  mobileAndTablet: (styles: any) => css`
    @media ${MEDIA_QUERIES.max.lg} {
      ${styles}
    }
  `,
  tabletAndDesktop: (styles: any) => css`
    @media ${MEDIA_QUERIES.min.sm} {
      ${styles}
    }
  `,
};

// 반응형 컨테이너 스타일
export const responsiveContainer = css`
  width: 100%;
  max-width: ${GRID_SYSTEM.CONTAINER_MAX_WIDTH};
  margin: 0 auto;
  padding: 0 ${GRID_SYSTEM.CONTAINER_PADDING.MOBILE};
  
  ${media.min.sm`
    padding: 0 ${GRID_SYSTEM.CONTAINER_PADDING.TABLET};
  `}
  
  ${media.min.lg`
    padding: 0 ${GRID_SYSTEM.CONTAINER_PADDING.DESKTOP};
  `}
`;

// 반응형 그리드 스타일
export const responsiveGrid = css`
  display: grid;
  gap: ${GRID_SYSTEM.GRID_GAP.MOBILE};
  grid-template-columns: repeat(${GRID_SYSTEM.COLUMNS.MOBILE}, 1fr);
  
  ${media.min.sm`
    gap: ${GRID_SYSTEM.GRID_GAP.TABLET};
    grid-template-columns: repeat(${GRID_SYSTEM.COLUMNS.TABLET}, 1fr);
  `}
  
  ${media.min.lg`
    gap: ${GRID_SYSTEM.GRID_GAP.DESKTOP};
    grid-template-columns: repeat(${GRID_SYSTEM.COLUMNS.DESKTOP}, 1fr);
  `}
  
  ${media.min['2xl']`
    grid-template-columns: repeat(${GRID_SYSTEM.COLUMNS.LARGE_DESKTOP}, 1fr);
  `}
`;

// 반응형 플렉스 스타일
export const responsiveFlex = css`
  display: flex;
  flex-direction: column;
  gap: ${GRID_SYSTEM.GRID_GAP.MOBILE};
  
  ${media.min.sm`
    gap: ${GRID_SYSTEM.GRID_GAP.TABLET};
  `}
  
  ${media.min.lg`
    flex-direction: row;
    gap: ${GRID_SYSTEM.GRID_GAP.DESKTOP};
  `}
`;

// 터치 친화적 버튼 크기
export const touchFriendly = css`
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
  
  ${media.min.sm`
    padding: 14px 20px;
  `}
`;

// 반응형 타이포그래피
export const responsiveTypography = {
  h1: css`
    font-size: 1.875rem;
    line-height: 1.2;
    
    ${media.min.sm`
      font-size: 2.25rem;
    `}
    
    ${media.min.lg`
      font-size: 3rem;
    `}
  `,
  h2: css`
    font-size: 1.5rem;
    line-height: 1.3;
    
    ${media.min.sm`
      font-size: 1.875rem;
    `}
    
    ${media.min.lg`
      font-size: 2.25rem;
    `}
  `,
  h3: css`
    font-size: 1.25rem;
    line-height: 1.4;
    
    ${media.min.sm`
      font-size: 1.5rem;
    `}
    
    ${media.min.lg`
      font-size: 1.875rem;
    `}
  `,
  body: css`
    font-size: 0.875rem;
    line-height: 1.5;
    
    ${media.min.sm`
      font-size: 1rem;
    `}
  `,
  small: css`
    font-size: 0.75rem;
    line-height: 1.4;
    
    ${media.min.sm`
      font-size: 0.875rem;
    `}
  `,
};

// 반응형 스페이싱
export const responsiveSpacing = {
  section: css`
    padding: 2rem 0;
    
    ${media.min.sm`
      padding: 3rem 0;
    `}
    
    ${media.min.lg`
      padding: 4rem 0;
    `}
  `,
  card: css`
    padding: 1rem;
    
    ${media.min.sm`
      padding: 1.5rem;
    `}
    
    ${media.min.lg`
      padding: 2rem;
    `}
  `,
};
