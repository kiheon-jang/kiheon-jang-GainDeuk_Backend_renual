import { css } from 'styled-components';
import { TOUCH_DEVICE } from '@/constants';

/**
 * 터치 디바이스 감지 및 터치 친화적 스타일링을 위한 유틸리티 함수들
 */

// 터치 디바이스에서만 적용되는 스타일
export const touchOnly = (styles: any) => css`
  @media ${TOUCH_DEVICE} {
    ${styles}
  }
`;

// 터치 디바이스가 아닌 경우에만 적용되는 스타일
export const noTouch = (styles: any) => css`
  @media not ${TOUCH_DEVICE} {
    ${styles}
  }
`;

// 터치 친화적 버튼 스타일
export const touchFriendlyButton = css`
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 16px; // iOS 줌 방지
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  
  &:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

// 터치 친화적 링크 스타일
export const touchFriendlyLink = css`
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  
  &:active {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

// 터치 친화적 입력 필드 스타일
export const touchFriendlyInput = css`
  min-height: 44px;
  padding: 12px 16px;
  font-size: 16px; // iOS 줌 방지
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.colors.border.primary};
  transition: border-color 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &:invalid {
    border-color: ${({ theme }) => theme.colors.danger};
  }
`;

// 터치 친화적 카드 스타일
export const touchFriendlyCard = css`
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  
  &:active {
    transform: scale(0.98);
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

// 스와이프 제스처를 위한 스타일
export const swipeable = css`
  touch-action: pan-x;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

// 터치 디바이스에서 호버 효과 비활성화
export const disableHoverOnTouch = css`
  @media ${TOUCH_DEVICE} {
    &:hover {
      transform: none;
      box-shadow: inherit;
    }
  }
`;

// 터치 디바이스에서 포커스 스타일 개선
export const touchFocus = css`
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
  
  @media ${TOUCH_DEVICE} {
    &:focus {
      outline: none;
    }
  }
`;

// 터치 디바이스에서 스크롤 개선
export const smoothScroll = css`
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
`;

// 터치 디바이스에서 텍스트 선택 방지
export const noSelect = css`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

// 터치 디바이스에서 드래그 방지
export const noDrag = css`
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
`;

// 터치 디바이스에서 컨텍스트 메뉴 방지
export const noContextMenu = css`
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

// 터치 디바이스에서 줌 방지
export const noZoom = css`
  touch-action: manipulation;
`;

// 터치 디바이스에서 하이라이트 제거
export const noHighlight = css`
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;
